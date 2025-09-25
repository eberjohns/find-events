

import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';
import { Paper, Title, Text, Loader, Alert, List, ThemeIcon, Group } from '@mantine/core';
import { IconCalendarEvent } from '@tabler/icons-react';

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
      <List spacing="md" size="md" icon={<ThemeIcon color="blue" size={24} radius="xl"><IconCalendarEvent size={16} /></ThemeIcon>}>
        {events.map((event) => (
          <List.Item key={event.id}>
            <Title order={4} mb={2}>
              <Link to={`/events/${event.id}`}>{event.name}</Link>
            </Title>
            <Text>{event.description}</Text>
            <Text size="sm" color="dimmed">
              {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
            </Text>
          </List.Item>
        ))}
      </List>
    </Paper>
  );
}

export default HomePage;