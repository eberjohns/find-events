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