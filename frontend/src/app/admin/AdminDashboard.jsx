import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Paper,
  Title,
  Text,
  Button,
  Group,
  Loader,
  Alert,
  Table,
  Container,
  Accordion,
  Badge,
  Stack,
} from '@mantine/core';

function AdminDashboard() {
  const { token } = useAuth();
  const [pendingColleges, setPendingColleges] = useState([]);
  const [users, setUsers] = useState([]);
  const [allColleges, setAllColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    if (!token) return;
    setLoading(true);
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
      .then(([pending, usersData, all]) => {
        setPendingColleges(pending);
        setUsers(usersData);
        setAllColleges(all);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load admin data.');
        setLoading(false);
      });
  };

  useEffect(fetchData, [token]);

  const approveCollege = async (collegeId) => {
    await fetch(`http://127.0.0.1:8000/admin/colleges/${collegeId}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    // Refresh all data after an approval
    fetchData();
  };

  if (loading) return <Group justify="center" mt="xl"><Loader /></Group>;
  if (error) return <Alert color="red" mt="xl">{error}</Alert>;

  const roleColors = {
    ADMIN: 'pink',
    MAIN_REP: 'cyan',
    REP: 'blue',
    USER: 'gray',
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Title order={1} style={{ fontWeight: 800 }}>Admin Dashboard</Title>

        <Accordion defaultValue="pending-colleges" variant="separated">
          <Accordion.Item value="pending-colleges">
            <Accordion.Control>
              <Title order={4}>Pending College Approvals ({pendingColleges.length})</Title>
            </Accordion.Control>
            <Accordion.Panel>
              {pendingColleges.length === 0 ? (
                <Text c="dimmed" mt="md">No pending colleges.</Text>
              ) : (
                <Table striped highlightOnHover withTableBorder mt="md">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Name</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Action</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {pendingColleges.map(college => (
                      <Table.Tr key={college.id}>
                        <Table.Td>{college.name}</Table.Td>
                        <Table.Td>{college.location}</Table.Td>
                        <Table.Td>
                          <Button size="xs" color="green" onClick={() => approveCollege(college.id)}>
                            Approve
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="college-management">
            <Accordion.Control>
              <Title order={4}>College Management</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Table striped highlightOnHover withTableBorder mt="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {allColleges.map(college => (
                    <Table.Tr key={college.id}>
                      <Table.Td>{college.name}</Table.Td>
                      <Table.Td>{college.location}</Table.Td>
                      <Table.Td>
                        <Badge color={college.is_approved ? 'green' : 'orange'} variant="light">
                          {college.is_approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="all-users">
            <Accordion.Control>
              <Title order={4}>User Management</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Table striped highlightOnHover withTableBorder mt="md">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User Email</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Assigned College</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {users.map(user => (
                    <Table.Tr key={user.id}>
                      <Table.Td>{user.email}</Table.Td>
                      <Table.Td>
                        <Badge color={roleColors[user.role]} variant="light">
                          {user.role}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {user.college_id ? (allColleges.find(c => c.id === user.college_id)?.name || 'N/A') : 'None'}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Container>
  );
}

export default AdminDashboard;