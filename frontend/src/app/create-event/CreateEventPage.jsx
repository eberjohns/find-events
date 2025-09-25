
import CreateEventForm from './CreateEventForm';
import { useAuth } from '../../context/AuthContext';
import { Alert, Paper } from '@mantine/core';

function CreateEventPage() {
  const { user } = useAuth();
  if (!user || user.role !== 'REP') {
    return (
      <Paper withBorder shadow="md" p="xl" mt="xl" radius="md" style={{ maxWidth: 500, margin: 'auto' }}>
        <Alert color="red">Only college representatives can create events.</Alert>
      </Paper>
    );
  }
  return <CreateEventForm />;
}

export default CreateEventPage;
