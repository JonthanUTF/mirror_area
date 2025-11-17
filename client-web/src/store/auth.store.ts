import { create } from 'zustand';
import { authAPI } from '../api/client';

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('token', data.access_token);
    set({ token: data.access_token, user: data.user, isAuthenticated: true });
  },

  register: async (email, password, name) => {
    const { data } = await authAPI.register(email, password, name);
    localStorage.setItem('token', data.access_token);
    set({ token: data.access_token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: () => {
    const token = localStorage.getItem('token');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  },
}));