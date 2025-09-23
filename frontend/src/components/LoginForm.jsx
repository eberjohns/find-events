import { useState } from 'react';
import { loginUser } from '../services/api'; // Import the login function

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await loginUser({ email, password });
      const { access_token } = response.data;

      // Store the token in the browser's local storage
      localStorage.setItem('authToken', access_token);

      console.log('Login successful, token saved!');
      // Here we will redirect the user to the homepage
      window.location.href = '/'; // Simple redirect for now
    } catch (err) {
      console.error('Login failed:', err.response.data);
      setError(err.response.data.detail || 'Login failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* ... keep the input fields the same ... */}
        <div>
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
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginForm;