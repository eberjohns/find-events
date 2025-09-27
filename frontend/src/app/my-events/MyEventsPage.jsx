import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Text, Loader, Alert, List, ThemeIcon, Group, Container, Button } from '@mantine/core';
import { IconBookmark } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { unsaveEvent } from '../../services/api';

function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8000/users/me/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        setEvents(user.saved_events || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load saved events.');
        setLoading(false);
      });
  }, [token]);

  const handleUnsave = async (eventId) => {
    if (!token) return;
    try {
      await unsaveEvent(eventId, token);
      setEvents(events.filter(e => e.id !== eventId));
    } catch {
      setError('Failed to unsave event.');
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">My Saved Events</Title>
        {loading && <Group position="center"><Loader /></Group>}
        {error && <Alert color="red" mb="md">{error}</Alert>}
        {!loading && !error && events.length === 0 && <Text>No saved events found.</Text>}
        <List spacing="md" size="md" icon={<ThemeIcon color="yellow" size={24} radius="xl"><IconBookmark size={16} /></ThemeIcon>}>
          {events.map(event => (
            <List.Item key={event.id}>
              <Group position="apart" align="center">
                <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <Title order={5} mb={2} style={{ cursor: 'pointer', color: '#228be6' }}>{event.name}</Title>
                  <Text size="sm" color="dimmed">{event.description}</Text>
                  <Text size="xs" color="dimmed">
                    {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
                  </Text>
                </Link>
                <Button color="yellow" variant="outline" size="xs" onClick={() => handleUnsave(event.id)}>
                  Unsave
                </Button>
              </Group>
            </List.Item>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default MyEventsPage;
