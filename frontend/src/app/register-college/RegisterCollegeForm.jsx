
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TextInput, Button, Paper, Title, Alert, Group } from '@mantine/core';

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
    <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 500, margin: 'auto' }}>
      <Title order={2} align="center" mb="lg">
        Register College
      </Title>
      {success && <Alert color="green" mb="md">College registered! Awaiting approval.</Alert>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Name"
          placeholder="College name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          required
          mb="md"
        />
        <TextInput
          label="Location"
          placeholder="College location"
          value={location}
          onChange={e => setLocation(e.currentTarget.value)}
          required
          mb="lg"
        />
        <Group position="right">
          <Button type="submit">Register</Button>
        </Group>
      </form>
    </Paper>
  );
}

export default RegisterCollegeForm;
