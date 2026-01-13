import { Box, TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import validator from "validator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !validator.isEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
          const body = await res.json();
          msg = body?.error || body?.message || JSON.stringify(body);
        } catch {
          const text = await res.text();
          if (text) msg = text;
        }
        throw new Error(msg);
      }
      const data = await res.json();
      const token = data.token;
      const user = data.user;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      localStorage.setItem("userName", "okokokok");

      if (user) {
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userEmail", user.email);
      }
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", minWidth: "100vw" }}>
      {/* Left */}
      <Box
        sx={{
          width: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #1b092dff 0%, #1b092dff 100%)",
          color: "#492f64ff",
          p: 3,
        }}
      >
        <Card sx={{ width: "100%", maxWidth: 420 }}>
          <CardContent>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleGoogleLogin}
              sx={{ mt: 1 }}
            >
              Continue with Google
            </Button>
            <Typography variant="h5" component="h2" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                sx={{ mb: 2 }}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError(validator.isEmail(e.target.value) ? "" : "Invalid email");
                }}
                error={!!emailError}
                helperText={emailError}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <Button variant="contained" fullWidth type="submit" disabled={!email || !password || !!emailError}>
                Login
              </Button>
            </form>
            <Button variant="text" fullWidth onClick={() => navigate("/signup")}>
              Don't have an account? Sign Up
            </Button>
          </CardContent>
        </Card>


      </Box>

      {/* Right */}
      <Box
        sx={{
          width: "50%",
          backgroundImage: "linear-gradient(135deg, #361848ff 0%, #2b0a40ff 100%)",
          color: "#492f64ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: 420 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, opacity: 0.8, mb: 1, color: "#ffffffff" }}>
            Automate Everything
          </Typography>
          <Typography sx={{ opacity: 0.8, color: "#ffffffff" }}>
            Connect your apps and services to create powerful automations. Save hours every week with intelligent workflows
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}