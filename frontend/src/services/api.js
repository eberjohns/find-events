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
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Authentication
  login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },
  register(userData) {
    return apiClient.post('/auth/register', userData);
  },

  // Events
  getEvents() {
    return apiClient.get('/events');
  },
  getEventById(id) {
    return apiClient.get(`/events/${id}`);
  },
  createEvent(eventData) {
    return apiClient.post('/events', eventData);
  },
  updateEvent(id, eventData) {
    return apiClient.put(`/events/${id}`, eventData);
  },
  deleteEvent(id) {
    return apiClient.delete(`/events/${id}`);
  },

  return apiClient.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

// Fetch all events
export const fetchEvents = () => {
  return apiClient.get('/events/');
};
