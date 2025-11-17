export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    GITHUB: '/auth/github',
  },
  USERS: {
    PROFILE: '/users',
  },
  AREAS: {
    BASE: '/areas',
  },
  SERVICES: {
    BASE: '/services',
    USER: '/services/user',
    CONNECT: '/services/connect',
  },
  ABOUT: '/about.json',
};

export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  AREAS: '/areas',
  SERVICES: '/services',
  PROFILE: '/profile',
};

export const SERVICE_ICONS: Record<string, string> = {
  GitHub: '🐙',
  Gmail: '📧',
  Discord: '💬',
  'Google Drive': '📁',
  Weather: '🌤️',
  Timer: '⏰',
};

export const SERVICE_COLORS: Record<string, string> = {
  GitHub: '#181717',
  Gmail: '#EA4335',
  Discord: '#5865F2',
  'Google Drive': '#4285F4',
  Weather: '#FFA500',
  Timer: '#6366F1',
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
};
