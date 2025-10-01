import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById, saveEvent, unsaveEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, Title, Text, Button, Group, Loader, Alert, Badge, Image, Stack, Anchor, Grid, Divider } from '@mantine/core';
import { IconBookmark, IconBookmarkOff, IconExternalLink, IconCalendar, IconCash, IconSchool } from '@tabler/icons-react';

function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchEventById(id)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
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

  if (loading) return <Group justify="center" mt="xl"><Loader /></Group>;
  if (error) return <Alert color="red" mt="xl">{error}</Alert>;
  if (!event) return <Alert color="yellow" mt="xl">Event not found.</Alert>;

  return (
    <Card withBorder shadow="lg" p="xl" mt="xl" radius="md" style={{ maxWidth: 800, margin: 'auto' }}>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 5 }}>
          {event.image && (
            <Image src={event.image} alt={event.name} radius="md" fit="cover" height={300} />
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Title order={1} style={{ fontWeight: 800 }}>{event.name}</Title>
            <Group gap="xs">
              {event.tags && event.tags.map((tag, idx) => (
                <Badge key={idx} color="blue" variant="light" size="lg">{tag}</Badge>
              ))}
            </Group>
            <Divider />
            <Text size="lg" c="dimmed">{event.description}</Text>
            <Group mt="md">
              <IconCalendar size={20} />
              <Text size="md"><b>Date:</b> {new Date(event.date).toLocaleDateString()}</Text>
            </Group>
            <Group>
              <IconCash size={20} />
              <Text size="md"><b>Registration Fee:</b> {event.registration_fee ? `$${event.registration_fee}` : 'Free'}</Text>
            </Group>
            <Group>
              <IconSchool size={20} />
              <Text size="md"><b>College:</b> {event.college.name}</Text>
            </Group>
            {event.external_links && event.external_links.length > 0 && (
              <Stack gap={4} mt="md">
                <Title order={5}>External Links</Title>
                {event.external_links.map((link, idx) => (
                  <Anchor key={idx} href={link} target="_blank" rel="noopener noreferrer">
                    <Group gap="xs">
                      <IconExternalLink size={16} />
                      {link}
                    </Group>
                  </Anchor>
                ))}
              </Stack>
            )}
            {token && (
              <Group mt="lg">
                {saved ? (
                  <Button
                    leftSection={<IconBookmarkOff size={18} />}
                    color="yellow"
                    variant="outline"
                    onClick={handleUnsave}
                    loading={saving}
                    size="lg"
                  >
                    Unsave Event
                  </Button>
                ) : (
                  <Button
                    leftSection={<IconBookmark size={18} />}
                    color="blue"
                    onClick={handleSave}
                    loading={saving}
                    size="lg"
                  >
                    Save Event
                  </Button>
                )}
              </Group>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}

export default EventDetailPage;