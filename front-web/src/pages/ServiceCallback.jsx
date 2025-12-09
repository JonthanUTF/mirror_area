import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ServiceCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState("Processing connection...");

    useEffect(() => {
        const processCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get("code");
            const error = searchParams.get("error");

            const serviceName = 'google'; // Hardcoded for now as per MVP plan

            if (error) {
                setStatus("Error: " + error);
                setTimeout(() => navigate("/createActionReaction"), 3000);
                return;
            }

            if (!code) {
                setStatus("No authorization code found.");
                return;
            }

            try {
                const token = localStorage.getItem("authToken");
                if (!token) {
                    setStatus("Error: No auth token found. Please login again.");
                    return;
                }

                const res = await fetch(`http://localhost:8080/services/${serviceName}/callback`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ code }),
                });

                if (!res.ok) {
                    const body = await res.json();
                    throw new Error(body.error || "Failed to connect service");
                }

                setStatus("Service connected successfully! Redirecting...");
                setTimeout(() => navigate("/createActionReaction"), 1500);

            } catch (err) {
                console.error(err);
                setStatus("Connection failed: " + err.message);
            }
        };

        processCallback();
    }, [location, navigate]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#1b092d',
            color: 'white',
            flexDirection: 'column',
            fontFamily: 'sans-serif'
        }}>
            <h2>{status}</h2>
        </div>
    );
}
