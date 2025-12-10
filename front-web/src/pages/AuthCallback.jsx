import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('access_token') || params.get('authToken');
    const error = params.get('error');

    if (token) {
      localStorage.setItem('authToken', token);
      navigate('/home', { replace: true });
      return;
    }

    navigate(`/login${error ? `?error=${encodeURIComponent(error)}` : ''}`, { replace: true });
  }, [navigate]);

  return null;
}
