import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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

  return (
    <div>
      <h2>My Saved Events</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default MyEventsPage;
