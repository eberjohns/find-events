import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function RegisterCollegeForm() {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await fetch('http://127.0.0.1:8000/colleges/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, location }),
      });
      setSuccess(true);
      setName('');
      setLocation('');
    } catch {
      setError('Failed to register college.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register College</h2>
      {success && <p>College registered! Awaiting approval.</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Location</label>
        <input value={location} onChange={e => setLocation(e.target.value)} required />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterCollegeForm;
