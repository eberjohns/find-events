
import { useState } from 'react';
import { registerUser } from '../services/api';
import { TextInput, PasswordInput, Button, Paper, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';


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
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 450, margin: 'auto' }}>
      <Title order={2} align="center" mb="lg">
        Create an Account
      </Title>

      {success && (
        <Alert color="green" mb="md">
          Registration successful! You can now log in.
        </Alert>
      )}
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
          onChange={(e) => setEmail(e.currentTarget.value)}
          mb="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          mb="lg"
        />
        <Button type="submit" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
}

export default RegisterForm;