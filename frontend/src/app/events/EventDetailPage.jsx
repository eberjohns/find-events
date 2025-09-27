import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById, saveEvent, unsaveEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Text, Button, Group, Loader, Alert, Badge, Image, Stack, Anchor } from '@mantine/core';
import { IconBookmark, IconBookmarkOff, IconExternalLink } from '@tabler/icons-react';


function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false); // Placeholder, ideally from user data
  const { token } = useAuth();

  useEffect(() => {
    fetchEventById(id)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
        // Check if this event is in the user's saved events
        if (token) {
          fetch('http://127.0.0.1:8000/users/me/', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(res => res.json())
            .then(user => {
              const isSaved = (user.saved_events || []).some(e => e.id === parseInt(id));
              setSaved(isSaved);
            });
        }
      })
      .catch(() => {
        setError('Failed to load event.');
        setLoading(false);
      });
  }, [id, token]);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await saveEvent(id, token);
      setSaved(true);
    } catch {
      // Optionally show error
    }
    setSaving(false);
  };

  const handleUnsave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await unsaveEvent(id, token);
      setSaved(false);
    } catch {
      // Optionally show error
    }
    setSaving(false);
  };

  if (loading) return <Group position="center"><Loader /></Group>;
  if (error) return <Alert color="red">{error}</Alert>;
  if (!event) return <Alert color="yellow">Event not found.</Alert>;

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 700, margin: 'auto' }}>
      <Stack spacing="md">
        {event.image && (
          <Image src={event.image} alt={event.name} width={400} height={220} radius="md" fit="cover" style={{ objectFit: 'cover', margin: 'auto' }} />
        )}
        <Title order={2}>{event.name}</Title>
        <Group spacing={8} mb={4}>
          {event.tags && event.tags.map((tag, idx) => (
            <Badge key={idx} color="blue" variant="light">{tag}</Badge>
          ))}
        </Group>
        <Text size="md" color="dimmed">
          <b>Date:</b> {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
        </Text>
        <Text size="md" color="dimmed">
          <b>Registration Fee:</b> {event.registration_fee ? `$${event.registration_fee}` : 'Free'}
        </Text>
        <Text size="md" color="dimmed">
          <b>College ID:</b> {event.college_id}
        </Text>
        <Text size="md" mt="md">
          {event.description}
        </Text>
        {event.external_links && event.external_links.length > 0 && (
          <Stack spacing={4} mt="md">
            <Title order={5}>External Links</Title>
            {event.external_links.map((link, idx) => (
              <Anchor key={idx} href={link} target="_blank" rel="noopener noreferrer" color="blue" leftSection={<IconExternalLink size={16} />}>
                {link}
              </Anchor>
            ))}
          </Stack>
        )}
        {token && (
          <Group mt="md">
            {saved ? (
              <Button leftIcon={<IconBookmarkOff size={16} />} color="yellow" variant="outline" onClick={handleUnsave} loading={saving}>
                Unsave Event
              </Button>
            ) : (
              <Button leftIcon={<IconBookmark size={16} />} color="blue" onClick={handleSave} loading={saving}>
                Save Event
              </Button>
            )}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}

export default EventDetailPage;
