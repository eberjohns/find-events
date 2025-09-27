import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Group, Button, Container, Paper, Title } from '@mantine/core';



function Navbar() {
  const { token, user, logout } = useAuth();

  return (
    <Paper shadow="sm" radius={0} p="md" withBorder style={{ marginBottom: 24 }}>
      <Container size="lg">
        <Group position="apart" align="center">
          <Title order={3} style={{ margin: 0 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              FindEvents
            </Link>
          </Title>
          <Group spacing="md">
            <NavLink to="/">Home</NavLink>
            {token ? (
              <>
                <NavLink to="/my-events">My Events</NavLink>
                {user?.role !== 'ADMIN' && (
                  <NavLink to="/create-event">Create Event</NavLink>
                )}
                {(!user || (user.role !== 'REP' && user.role !== 'ADMIN') || !user.college_id) && user?.role !== 'ADMIN' && (
                  <NavLink to="/register-college">Register College</NavLink>
                )}
                {user && user.role === 'ADMIN' && (
                  <NavLink to="/admin">Admin</NavLink>
                )}
                <Button variant="outline" color="red" size="xs" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </Paper>
  );
};

export default Navbar;
