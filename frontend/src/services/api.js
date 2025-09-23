'''
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

  // Users
  getCurrentUser() {
    return apiClient.get('/users/me');
  },
  saveEvent(eventId) {
    return apiClient.post(`/users/me/saved-events/${eventId}`);
  },
  unsaveEvent(eventId) {
    return apiClient.delete(`/users/me/saved-events/${eventId}`);
  },

  // Colleges
  getColleges() {
    return apiClient.get('/colleges');
  },
  registerCollege(collegeData) {
    return apiClient.post('/colleges', collegeData);
  },

  // Admin
  getPendingColleges() {
    return apiClient.get('/admin/colleges/pending');
  },
  approveCollege(id) {
    return apiClient.put(`/admin/colleges/${id}/approve`);
  },
  getUsers() {
    return apiClient.get('/admin/users');
  },
  assignRepRole(id) {
    return apiClient.put(`/admin/users/${id}/assign-rep`);
  },
};
'''