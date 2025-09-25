
import { useState } from 'react';
import { createEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { TextInput, Textarea, Button, Paper, Title, Alert, Group } from '@mantine/core';


function CreateEventForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await createEvent({
        name,
        description,
        start_time: startTime,
        end_time: endTime,
      }, token);
      setSuccess(true);
      setName('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event.');
    }
  };

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 500, margin: 'auto' }}>
      <Title order={2} align="center" mb="lg">
        Create Event
      </Title>
      {success && <Alert color="green" mb="md">Event created!</Alert>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          placeholder="Event name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          required
          mb="md"
        />
        <Textarea
          label="Description"
          placeholder="Event description"
          value={description}
          onChange={e => setDescription(e.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="Start Time"
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="End Time"
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.currentTarget.value)}
          required
          mb="lg"
        />
        <Group position="right">
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </Paper>
  );
}

export default CreateEventForm;
