import { useState } from 'react';
import { registerUser } from '../services/api';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await registerUser({ email, password });
      setSuccess(true);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Create an Account</h2>
        {success && <p>Registration successful! You can now log in.</p>}
        {error && <p>{error}</p>}
        <div>
          <label htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;