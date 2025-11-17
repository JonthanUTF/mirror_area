import { apiClient } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, username: string) =>
    apiClient.post('/auth/register', { email, password, username }),
};

export const areasApi = {
  getAll: () => apiClient.get('/areas'),
  getOne: (id: string) => apiClient.get(`/areas/${id}`),
  create: (data: any) => apiClient.post('/areas', data),
  update: (id: string, data: any) => apiClient.put(`/areas/${id}`, data),
  delete: (id: string) => apiClient.delete(`/areas/${id}`),
  toggle: (id: string) => apiClient.post(`/areas/${id}/toggle`),
};

export const servicesApi = {
  getAll: () => apiClient.get('/services'),
  getUserServices: () => apiClient.get('/services/user'),
  connect: (serviceId: string, credentials: any) =>
    apiClient.post('/services/connect', { serviceId, credentials }),
  disconnect: (serviceId: string) => apiClient.delete(`/services/${serviceId}`),
};

export const usersApi = {
  getProfile: (id: string) => apiClient.get(`/users/${id}`),
  updateProfile: (id: string, data: any) => apiClient.put(`/users/${id}`, data),
  deleteAccount: (id: string) => apiClient.delete(`/users/${id}`),
};
