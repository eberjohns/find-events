

import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import { Paper, Title, Text, Loader, Alert, List, Group, Badge, Image, Stack, MultiSelect } from '@mantine/core';


function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

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

  // Collect all unique tags from events
  const allTags = Array.from(new Set(events.flatMap(e => e.tags || [])));


  // Filter events by selected tags
  const filteredEvents = selectedTags.length === 0
    ? events
    : events.filter(event => event.tags && selectedTags.every(tag => event.tags.includes(tag)));

  // Split into upcoming and past events
  const now = new Date();
  const [upcomingEvents, pastEvents] = filteredEvents.reduce(
    ([up, past], event) => {
      const eventDate = event.date ? new Date(event.date) : null;
      if (eventDate && eventDate >= now) {
        up.push(event);
      } else {
        past.push(event);
      }
      return [up, past];
    },
    [[], []]
  );

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 700, margin: 'auto' }}>
      <Title order={1} align="center" mb="sm">
        Welcome to FindEvents
      </Title>
      <Text align="center" mb="lg" color="dimmed">
        Your one-stop portal for all college fests and events.
      </Text>
      <Title order={2} mb="md">Upcoming Events</Title>
      {allTags.length > 0 && (
        <MultiSelect
          data={allTags}
          value={selectedTags}
          onChange={setSelectedTags}
          label="Filter by tags"
          placeholder="Select tags"
          clearable
          mb="md"
        />
      )}
      {loading && <Group position="center"><Loader /></Group>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {!loading && !error && upcomingEvents.length === 0 && <Text>No upcoming events found.</Text>}
      <Stack spacing="md">
        {upcomingEvents.map((event) => (
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

      {/* Past Events Section */}
      <Title order={3} mt="xl" mb="md" color="gray">Past Events</Title>
      {!loading && !error && pastEvents.length === 0 && <Text color="dimmed">No past events.</Text>}
      <Stack spacing="md">
        {pastEvents.map((event) => (
          <Paper key={event.id} withBorder shadow="xs" p="md" radius="md" opacity={0.6}>
            <Group align="flex-start" spacing="md" noWrap>
              {event.image && (
                <Image src={event.image} alt={event.name} width={100} height={100} radius="md" fit="cover" style={{ objectFit: 'cover', filter: 'grayscale(0.7)' }} />
              )}
              <div style={{ flex: 1 }}>
                <Title order={4} mb={4} color="gray">
                  <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: '#868e96' }}>{event.name}</Link>
                </Title>
                <Group spacing={4} mt={4}>
                  {event.tags && event.tags.map((tag, idx) => (
                    <Badge key={idx} color="gray" variant="light">{tag}</Badge>
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