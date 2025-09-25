
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Paper, Title, Text, Button, Group, Loader, Alert, Table, Select, Container, Space } from '@mantine/core';

function AdminDashboard() {
  const { token } = useAuth();
  const [pendingColleges, setPendingColleges] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allColleges, setAllColleges] = useState([]);
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('http://127.0.0.1:8000/admin/colleges/pending/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch('http://127.0.0.1:8000/colleges/', {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
    ])
      .then(([colleges, users, allColleges]) => {
        setPendingColleges(colleges);
        setUsers(users);
        setAllColleges(allColleges);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load admin data.');
        setLoading(false);
      });
  }, [token]);

  const approveCollege = async (collegeId) => {
    await fetch(`http://127.0.0.1:8000/admin/colleges/${collegeId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    setPendingColleges(pendingColleges.filter(c => c.id !== collegeId));
    // Refresh allColleges after approval
    fetch('http://127.0.0.1:8000/colleges/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setAllColleges);
  };

  const assignRep = async (userId, collegeId) => {
    await fetch(`http://127.0.0.1:8000/admin/users/${userId}/assign-rep`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ college_id: collegeId }),
    });
    // Optionally update UI
  };

  if (loading) return <Group position="center"><Loader /></Group>;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Container size="md" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Title order={2} mb="md">Admin Dashboard</Title>

        <Title order={4} mt="md" mb="xs">Pending Colleges</Title>
        {pendingColleges.length === 0 ? (
          <Text color="dimmed">No pending colleges.</Text>
        ) : (
          <Table striped highlightOnHover withBorder mb="md">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingColleges.map(college => (
                <tr key={college.id}>
                  <td>{college.name}</td>
                  <td>{college.location}</td>
                  <td>
                    <Button size="xs" color="green" onClick={() => approveCollege(college.id)}>
                      Approve
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Title order={4} mt="lg" mb="xs">All Colleges</Title>
        <Table striped highlightOnHover withBorder mb="md">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allColleges.map(college => (
              <tr key={college.id}>
                <td>{college.name}</td>
                <td>{college.location}</td>
                <td>{college.is_approved ? 'Approved' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Title order={4} mt="lg" mb="xs">Assign Rep Role</Title>
        <Table striped highlightOnHover withBorder>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>College</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.filter(user => user.role !== 'ADMIN').map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td style={{ minWidth: 180 }}>
                  {user.role === 'REP' ? (
                    allColleges.find(c => c.id === user.college_id)?.name || '—'
                  ) : (
                    <Select
                      id={`college-${user.id}`}
                      placeholder="Select college"
                      data={allColleges.map(college => ({ value: String(college.id), label: `${college.name} (${college.location})` }))}
                      disabled={user.role !== 'USER'}
                    />
                  )}
                </td>
                <td>
                  {user.role === 'REP' ? (
                    <Button size="xs" color="red" onClick={async () => {
                      // Demote rep to user
                      await fetch(`http://127.0.0.1:8000/admin/users/${user.id}/demote-rep`, {
                        method: 'PUT',
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      // Optionally update UI
                    }}>
                      Demote to User
                    </Button>
                  ) : user.role === 'USER' ? (
                    <Button size="xs" onClick={() => {
                      const collegeId = document.getElementById(`college-${user.id}`).value;
                      if (collegeId) assignRep(user.id, collegeId);
                    }} disabled>
                      Assign Rep
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
      <Space h="xl" />
    </Container>
  );
}

export default AdminDashboard;