import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const { user, token, isAuthenticated, login, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const handleRegister = async (email: string, password: string, username: string) => {
    try {
      const response = await authApi.register(email, password, username);
      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
