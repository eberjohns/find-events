import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Group, Button, Container, Paper, Title } from '@mantine/core';
import classes from './Navbar.module.css';

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const getClassName = ({ isActive }) => `${classes.link} ${isActive ? classes.active : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Paper shadow="xs" radius={0} p="md">
      <Container size="lg">
        <Group justify="space-between" align="center">
          <Title order={3}>
            <NavLink to="/" className={`${classes.link} ${classes.brand}`}>
              FindEvents
            </NavLink>
          </Title>
          <Group gap="xs">
            <NavLink to="/" className={getClassName}>Home</NavLink>
            {token ? (
              <>
                <NavLink to="/my-events" className={getClassName}>My Events</NavLink>
                {(user?.role === 'REP') && (// || user?.role === 'MAIN_REP'
                  <NavLink to="/create-event" className={getClassName}>Create Event</NavLink>
                )}
                {user?.role === 'USER' && (
                  <>
                    <NavLink to="/register-college" className={getClassName}>Register College</NavLink>
                    <NavLink to="/apply-for-rep" className={getClassName}>Apply for REP</NavLink>
                  </>
                )}
                {user?.role === 'MAIN_REP' && (
                  <NavLink to="/requests" className={getClassName}>Requests</NavLink>
                )}
                {user && user.role === 'ADMIN' && (
                  <NavLink to="/admin" className={getClassName}>Admin</NavLink>
                )}
                <Button variant="outline" color="red" size="xs" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={getClassName}>Login</NavLink>
                <NavLink to="/register" className={getClassName}>Register</NavLink>
              </>
            )}
          </Group>
        </Group>
      </Container>
    </Paper>
  );
}

export default Navbar;