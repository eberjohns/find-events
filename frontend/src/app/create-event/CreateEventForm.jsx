

import { useState } from 'react';
import { createEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  TextInput,
  Textarea,
  Button,
  Paper,
  Title,
  Alert,
  Group,
  FileInput,
  MultiSelect,
  NumberInput,
  Chip,
  Stack
} from '@mantine/core';

function CreateEventForm() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [registrationFee, setRegistrationFee] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [externalLinks, setExternalLinks] = useState(['']);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  // Handle image preview
  const handleImageChange = (file) => {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Handle tags as chips
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Handle external links
  const handleLinkChange = (idx, value) => {
    const newLinks = [...externalLinks];
    newLinks[idx] = value;
    setExternalLinks(newLinks);
  };
  const handleAddLink = () => {
    setExternalLinks([...externalLinks, '']);
  };
  const handleRemoveLink = (idx) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== idx));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      let imageData = null;
      if (image) {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }
      await submitEvent(imageData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event.');
    }
  };

  const submitEvent = async (imageData) => {
    await createEvent({
      name,
      date,
      registration_fee: registrationFee,
      tags,
      description,
      image: imageData, // base64 or URL
      external_links: externalLinks.filter(link => link.trim() !== ''),
    }, token);
    setSuccess(true);
    setName('');
    setDate('');
    setRegistrationFee('');
    setTags([]);
    setTagInput('');
    setDescription('');
    setImage(null);
    setImagePreview(null);
    setExternalLinks(['']);
  };

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 600, margin: 'auto' }}>
      <Title order={2} align="center" mb="lg">
        Create Event
      </Title>
      {success && <Alert color="green" mb="md">Event created!</Alert>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Event Name"
          placeholder="Event name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="Date"
          type="date"
          value={date}
          onChange={e => setDate(e.currentTarget.value)}
          required
          mb="md"
        />
        <NumberInput
          label="Registration Fee (USD)"
          placeholder="0"
          value={registrationFee}
          onChange={setRegistrationFee}
          min={0}
          mb="md"
        />
        <Group mb="md" align="flex-end">
          <TextInput
            label="Add Tag"
            placeholder="Type tag and press Add"
            value={tagInput}
            onChange={e => setTagInput(e.currentTarget.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
          />
          <Button onClick={handleAddTag} variant="outline">Add</Button>
        </Group>
        <Group mb="md">
          {tags.map(tag => (
            <Chip key={tag} checked onChange={() => handleRemoveTag(tag)}>{tag}</Chip>
          ))}
        </Group>
        <Textarea
          label="Description"
          placeholder="Event description"
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
          required
          mb="md"
        />
        <FileInput
          label="Event Cover Image"
          placeholder="Upload image"
          accept="image/*"
          value={image}
          onChange={handleImageChange}
          mb="md"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" style={{ maxWidth: 200, marginBottom: 16, borderRadius: 8 }} />
        )}
        <Stack mb="md">
          <Title order={5}>External Links</Title>
          {externalLinks.map((link, idx) => (
            <Group key={idx}>
              <TextInput
                placeholder="https://..."
                value={link}
                onChange={e => handleLinkChange(idx, e.currentTarget.value)}
                style={{ flex: 1 }}
              />
              <Button color="red" variant="outline" onClick={() => handleRemoveLink(idx)} disabled={externalLinks.length === 1}>Remove</Button>
            </Group>
          ))}
          <Button variant="light" onClick={handleAddLink}>Add Link</Button>
        </Stack>
        <Group position="right">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Paper>
  );
}

export default CreateEventForm;
