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
      // optional: clear query string and go to home
      navigate('/home', { replace: true });
      return;
    }

    // fallback on error
    navigate(`/login${error ? `?error=${encodeURIComponent(error)}` : ''}`, { replace: true });
  }, [navigate]);

  return null;
}
