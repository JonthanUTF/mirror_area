import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Change to your server URL

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};
