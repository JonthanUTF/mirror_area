import { useState, useEffect } from "react";
import { API_BASE } from "../paramsHints";

export const useConnections = () => {
    const [connections, setConnections] = useState({
        twitch: false,
        google: false,
        microsoft: false,
        github: false,
        dropbox: false,
    });

    useEffect(() => {
        const checkConnections = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) return;

            // Check Twitch
            try {
                const res = await fetch(`${API_BASE}/auth/twitch/status`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setConnections(prev => ({ ...prev, twitch: data.connected }));
                }
            } catch (err) {
                console.error("Failed to check Twitch status:", err);
            }

            // Check other services
            try {
                const res = await fetch(`${API_BASE}/services`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setConnections(prev => ({
                        ...prev,
                        google: !!data.find(s => s.service?.name === 'google'),
                        microsoft: !!data.find(s => s.service?.name === 'microsoft'),
                        github: !!data.find(s => s.service?.name === 'github'),
                        dropbox: !!data.find(s => s.service?.name === 'dropbox'),
                    }));
                }
            } catch (err) {
                console.error("Failed to check services status:", err);
            }
        };

        checkConnections();

        // Check for OAuth callback params
        const params = new URLSearchParams(window.location.search);
        if (params.get("twitch_connected") === "true") {
            setConnections(prev => ({ ...prev, twitch: true }));
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (params.get("microsoft_connected") === "true") {
            setConnections(prev => ({ ...prev, microsoft: true }));
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (params.get("google_connected") === "true") {
            setConnections(prev => ({ ...prev, google: true }));
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const isServiceConnected = (serviceName) => {
        if (connections[serviceName] !== undefined) {
            return connections[serviceName];
        }
        return true; // Non-OAuth services are always "connected"
    };

    return { connections, isServiceConnected, setConnections };
};
