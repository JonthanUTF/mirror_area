import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";

export default function ServicesCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Processing...");
  const [ok, setOk] = useState(null);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const service = params.get('service') || localStorage.getItem('oauth_service') || 'google';
      if (!code) {
        setMessage("No code in URL");
        setOk(false);
        return;
      }

      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
        const token = localStorage.getItem("authToken");
        const redirectUri = (process.env.CLIENT_URL || window.location.origin) + "/services/callback";

        const res = await fetch(`${API_BASE}/services/${service}/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ code, redirectUri }),
        });

        const raw = await res.text();
        let parsed;
        try { parsed = JSON.parse(raw); } catch { parsed = null; }
        const msg = parsed?.message || parsed?.error || raw || `HTTP ${res.status}`;
        setMessage(msg);
        setOk(res.ok);
      } catch (err) {
        setMessage(err?.message || "Network error");
        setOk(false);
      } finally {
        const returnTo = localStorage.getItem("oauth_return") || "/home";
        localStorage.removeItem("oauth_return");
        localStorage.removeItem('oauth_service');
        setTimeout(() => navigate(returnTo), 1500);
      }
    })();
  }, [navigate]);

  return (
    <Box sx={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 4 }}>
      {ok === null ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>{ok ? "Connected" : "Error"}</Typography>
          <Typography sx={{ mb: 2, whiteSpace: "pre-wrap" }}>{message}</Typography>
          <Button variant="contained" onClick={() => navigate(localStorage.getItem("oauth_return") || "/home")}>Return</Button>
        </>
      )}
    </Box>
  );
}