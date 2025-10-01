// Save an event for the current user
export const saveEvent = (eventId, token) => {
  return apiClient.post(`/users/me/saved-events/${eventId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Unsave an event for the current user
export const unsaveEvent = (eventId, token) => {
  return apiClient.delete(`/users/me/saved-events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
// Fetch a single event by ID
export const fetchEventById = (id) => {
  return apiClient.get(`/events/${id}`);
};
// Create a new event (requires auth as REP)
export const createEvent = (eventData, token) => {
  return apiClient.post('/events/', eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const registerUser = (userData) => {
  return apiClient.post('/auth/register', userData);
};

// Add this new function
export const loginUser = (credentials) => {
  // The backend expects form data for login, not JSON.
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  return apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// Fetch all events
export const fetchEvents = () => {
  return apiClient.get('/events/');
};