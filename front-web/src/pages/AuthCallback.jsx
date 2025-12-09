import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Parse query params to get token
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (token) {
            console.log("OAuth successful, saving token...");
            localStorage.setItem("authToken", token);
            navigate("/home");
        } else {
            console.error("OAuth failed:", error);
            navigate("/login?error=" + (error || "auth_failed"));
        }
    }, [location, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#1b092d',
            color: 'white'
        }}>
            <h2>Processing Login...</h2>
        </div>
    );
}
