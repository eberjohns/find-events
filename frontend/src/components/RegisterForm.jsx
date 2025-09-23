import { useState } from 'react';
import { registerUser } from '../services/api'; // Import the new function

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State for handling errors
  const [success, setSuccess] = useState(false); // State for success message

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error state on new submission
    setSuccess(false);

    try {
      const response = await registerUser({ email, password });
      console.log('Registration successful:', response.data);
      setSuccess(true);
      // Optionally, redirect the user or clear the form
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Registration failed:', err.response.data);
      setError(err.response.data.detail || 'An error occurred.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create an Account</h2>
      {/* Display success or error messages */}
      {success && <p style={{ color: 'green' }}>Registration successful!</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {/* ... keep the input fields the same ... */}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Register</button>
    </form>
  );
}

export default RegisterForm;