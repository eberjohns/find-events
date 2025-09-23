'''
import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.getEvents().then(response => {
      setEvents(response.data);
    });
  }, []);

  const handleSaveEvent = (eventId) => {
    api.saveEvent(eventId).then(() => {
      alert('Event saved!');
    }).catch(error => {
      alert('Failed to save event.');
    });
  };

  return (
    <div>
      <h1>Upcoming Events</h1>
      <div className="events-list">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <h2>{event.name}</h2>
            <p>{new Date(event.date).toLocaleDateString()}</p>
            <p>{event.venue}</p>
            {user && <button onClick={() => handleSaveEvent(event.id)}>Save Event</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
'''