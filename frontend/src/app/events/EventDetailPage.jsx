import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById, saveEvent, unsaveEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';


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

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
      <p>
        {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}
      </p>
      <p>College ID: {event.college_id}</p>
      {token && (
        saved ? (
          <button onClick={handleUnsave} disabled={saving}>
            Unsave Event
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving}>
            Save Event
          </button>
        )
      )}
    </div>
  );
}

export default EventDetailPage;
