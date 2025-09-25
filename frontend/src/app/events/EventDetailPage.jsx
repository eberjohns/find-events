
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById, saveEvent, unsaveEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Text, Button, Group, Loader, Alert } from '@mantine/core';
import { IconBookmark, IconBookmarkOff } from '@tabler/icons-react';


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
      })
      .catch(() => {
        setError('Failed to load event.');
        setLoading(false);
      });
  }, [id]);

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
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 600, margin: 'auto' }}>
      <Title order={2} mb="sm">{event.name}</Title>
      <Text mb="md">{event.description}</Text>
      <Text size="sm" color="dimmed" mb="xs">
        {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
      </Text>
      <Text size="sm" color="dimmed" mb="md">College ID: {event.college_id}</Text>
      {token && (
        <Group>
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
    </Paper>
  );
}

export default EventDetailPage;
