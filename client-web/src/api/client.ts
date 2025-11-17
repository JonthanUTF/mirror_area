import axios from 'axios';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
  googleAuth: () => window.location.href = `${API_BASE_URL}/auth/google`,
};

export const areasAPI = {
  getAll: () => apiClient.get('/areas'),
  getOne: (id: string) => apiClient.get(`/areas/${id}`),
  create: (data: any) => apiClient.post('/areas', data),
  toggle: (id: string) => apiClient.patch(`/areas/${id}/toggle`),
  delete: (id: string) => apiClient.delete(`/areas/${id}`),
};

export const servicesAPI = {
  getAll: () => apiClient.get('/services'),
  getUserServices: () => apiClient.get('/services/user'),
  connect: (serviceId: string) => apiClient.post(`/services/${serviceId}/connect`),
};