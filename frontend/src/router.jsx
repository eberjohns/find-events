import RegisterCollegePage from './app/register-college/RegisterCollegePage';
import AdminDashboard from './app/admin/AdminDashboard';
import MyEventsPage from './app/my-events/MyEventsPage';
import EventDetailPage from './app/events/EventDetailPage';
import { createBrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreateEventPage from './app/create-event/CreateEventPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
  { path: "create-event", element: <CreateEventPage /> },
  { path: "events/:id", element: <EventDetailPage /> },
  { path: "my-events", element: <MyEventsPage /> },
  { path: "admin", element: <AdminDashboard /> },
  { path: "register-college", element: <RegisterCollegePage /> },
    ],
  },
]);

export default router;
