import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Button, Paper, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed.');
    }
  };

  return (
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 450, margin: 'auto' }}>
      <Title order={2} align="center" mb="lg">
        Login
      </Title>

      {error && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red" mb="md">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextInput
          label="Email"
          placeholder="you@email.com"
          required
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          mb="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          mb="lg"
        />
        <Button type="submit" fullWidth>
          Sign In
        </Button>
      </form>
    </Paper>
  );
}

export default LoginForm;