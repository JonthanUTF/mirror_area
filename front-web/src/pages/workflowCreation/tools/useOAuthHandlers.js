import { API_BASE } from "../paramsHints";

export const useOAuthHandlers = (setError, setResponseOk, setResponseText, setDialogOpen) => {

    const handleTwitchConnect = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please login first");
            return;
        }
        window.location.href = `${API_BASE}/auth/twitch?state=${token}`;
    };

    const handleGoogleConnect = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('oauth_service', 'google');
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_BASE}/services/google/connect`, {
                method: "GET",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            const connectUrl = data.url || data.connectUrl;
            if (connectUrl) {
                window.location.href = connectUrl;
            }
        } catch (err) {
            setError(err?.message || "Failed to connect Google");
        }
    };

    const handleMicrosoftConnect = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('oauth_service', 'microsoft');
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Please login first");
                return;
            }

            const res = await fetch(`${API_BASE}/services/microsoft/connect`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const connectUrl = data.url || data.connectUrl;
            if (!connectUrl) {
                throw new Error("No connect URL returned from server");
            }

            window.location.href = connectUrl;
        } catch (err) {
            const msg = err?.message || "Failed to connect Microsoft";
            setResponseOk(false);
            setResponseText(msg);
            setDialogOpen(true);
            setError(msg);
        }
    };

    const handleGitHubConnect = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('oauth_service', 'github');
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Please login first");
                return;
            }

            const res = await fetch(`${API_BASE}/services/github/connect`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const connectUrl = data.url || data.connectUrl;
            if (connectUrl) {
                window.location.href = connectUrl;
            }
        } catch (err) {
            setError(err?.message || "Failed to connect GitHub");
        }
    };

    const handleDropboxConnect = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('oauth_service', 'dropbox');
            const token = localStorage.getItem("authToken");

            if (!token) {
                setError("Please login first");
                return;
            }

            const res = await fetch(`${API_BASE}/services/dropbox/connect`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const connectUrl = data.url || data.connectUrl;
            if (connectUrl) {
                window.location.href = connectUrl;
            }
        } catch (err) {
            setError(err?.message || "Failed to connect Dropbox");
        }
    };

    return {
        handleTwitchConnect,
        handleGoogleConnect,
        handleMicrosoftConnect,
        handleGitHubConnect,
        handleDropboxConnect,
    };
};
