import { useState } from 'react';
import { createEvent } from '../../services/api';
import { useAuth } from '../../context/AuthContext';


function CreateEventForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await createEvent({
        name,
        description,
        start_time: startTime,
        end_time: endTime,
      }, token);
      setSuccess(true);
      setName('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create event.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Event</h2>
      {success && <p>Event created!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      <div>
        <label>Start Time</label>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} required />
      </div>
      <div>
        <label>End Time</label>
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} required />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateEventForm;
