import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Button, Loader, Alert, Container, Table } from '@mantine/core';

function RequestsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8000/rep-applications/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setApplications)
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleApprove = async (id) => {
    await fetch(`http://127.0.0.1:8000/rep-applications/${id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications(applications.map(app => app.id === id ? { ...app, status: 'approved' } : app));
  };

  const handleReject = async (id) => {
    await fetch(`http://127.0.0.1:8000/rep-applications/${id}/reject`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setApplications(applications.map(app => app.id === id ? { ...app, status: 'rejected' } : app));
  };

  if (loading) return <Loader />;

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">REP Applications</Title>
        {error && <Alert color="red" mb="md">{error}</Alert>}
        <Table>
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.user.email}</td>
                <td>{app.status}</td>
                <td>
                  {app.status === 'pending' && (
                    <>
                      <Button color="green" size="xs" onClick={() => handleApprove(app.id)}>Approve</Button>
                      <Button color="red" size="xs" ml="xs" onClick={() => handleReject(app.id)}>Reject</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}

export default RequestsPage;