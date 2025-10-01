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
                {user?.role === 'REP' && (
                  <NavLink to="/create-event">Create Event</NavLink>
                )}
                {user?.role === 'USER' && (
                  <>
                    <NavLink to="/register-college">Register College</NavLink>
                    <NavLink to="/apply-for-rep">Apply for REP</NavLink>
                  </>
                )}
                {user?.role === 'REP' && (
                  <NavLink to="/requests">Requests</NavLink>
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
}

export default Navbar;