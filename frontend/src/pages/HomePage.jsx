
import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { Link } from 'react-router-dom';

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
    <div>
      <h1>Welcome to FindEvents</h1>
      <p>Your one-stop portal for all college fests and events.</p>
      <h2>Upcoming Events</h2>
      {loading && <p>Loading events...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found.</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>
              <Link to={`/events/${event.id}`}>{event.name}</Link>
            </strong>
            <br />
            {event.description} <br />
            <span>
              {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;