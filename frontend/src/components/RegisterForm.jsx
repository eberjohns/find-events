import { useState } from 'react';
import { registerUser } from '../services/api';
import { TextInput, PasswordInput, Button, Paper, Title, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';



const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ email, password });
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed.');
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
};

export default RegisterForm;
