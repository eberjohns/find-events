

import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import { Paper, Title, Text, Loader, Alert, List, Group, Badge, Image, Stack } from '@mantine/core';

function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents()
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load events.');
        setLoading(false);
      });
  }, []);

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 700, margin: 'auto' }}>
      <Title order={1} align="center" mb="sm">
        Welcome to FindEvents
      </Title>
      <Text align="center" mb="lg" color="dimmed">
        Your one-stop portal for all college fests and events.
      </Text>
      <Title order={2} mb="md">Upcoming Events</Title>
      {loading && <Group position="center"><Loader /></Group>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {!loading && !error && events.length === 0 && <Text>No events found.</Text>}
      <Stack spacing="md">
        {events.map((event) => (
          <Paper key={event.id} withBorder shadow="xs" p="md" radius="md">
            <Group align="flex-start" spacing="md" noWrap>
              {event.image && (
                <Image src={event.image} alt={event.name} width={100} height={100} radius="md" fit="cover" style={{ objectFit: 'cover' }} />
              )}
              <div style={{ flex: 1 }}>
                <Title order={4} mb={4}>
                  <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: '#228be6' }}>{event.name}</Link>
                </Title>
                <Group spacing={4} mt={4}>
                  {event.tags && event.tags.map((tag, idx) => (
                    <Badge key={idx} color="blue" variant="light">{tag}</Badge>
                  ))}
                </Group>
              </div>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export default HomePage;