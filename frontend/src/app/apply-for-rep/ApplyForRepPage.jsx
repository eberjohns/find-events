import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Button, Select, Loader, Alert, Container } from '@mantine/core';
import { fetchEvents } from '../../services/api';

function ApplyForRepPage() {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8000/colleges/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setColleges)
      .catch(() => setError('Failed to load colleges.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async () => {
    if (!selectedCollege) return;
    setError(null);
    setSuccess(false);
    try {
      await fetch('http://127.0.0.1:8000/rep-applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ college_id: Number(selectedCollege) }),
      });
      setSuccess(true);
    } catch {
      setError('Failed to submit application.');
    }
  };

  if (loading) return <Loader />;

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">Apply to be a College Representative</Title>
        {error && <Alert color="red" mb="md">{error}</Alert>}
        {success && <Alert color="green" mb="md">Application submitted!</Alert>}
        <Select
          label="Select a College"
          placeholder="Choose a college"
          data={colleges.map(c => ({ value: String(c.id), label: c.name }))}
          value={selectedCollege}
          onChange={setSelectedCollege}
          mb="md"
        />
        <Button onClick={handleSubmit} disabled={!selectedCollege}>
          Send Request
        </Button>
      </Paper>
    </Container>
  );
}

export default ApplyForRepPage;