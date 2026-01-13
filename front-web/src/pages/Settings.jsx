import { Box, TextField, Button, Card, CardContent, Typography, Snackbar, Alert, Divider, Chip } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useState, useEffect } from 'react';
import validator from "validator";

import Sidebar from "../components/Sidebar";



export default function Settings() {
    const [isUpdateButtonDisabled, setIsDisabled] = useState(false);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [successOpen, setSuccessOpen] = useState(false);

    // Twitch connection state
    const [twitchConnected, setTwitchConnected] = useState(false);
    const [twitchUsername, setTwitchUsername] = useState("");
    const [twitchLoading, setTwitchLoading] = useState(false);

    const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : "";
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : "";
    const [name, setName] = useState(userName || "");
    const [email, setEmail] = useState(userEmail || "");

    // Check Twitch connection status on mount
    useEffect(() => {
        const checkTwitchStatus = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;
                
                const res = await fetch("http://localhost:8080/auth/twitch/status", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setTwitchConnected(data.connected);
                    setTwitchUsername(data.twitchUsername || "");
                }
            } catch (err) {
                console.error("Failed to check Twitch status:", err);
            }
        };
        
        // Check for callback params
        const params = new URLSearchParams(window.location.search);
        if (params.get("twitch_connected") === "true") {
            setSuccessMessage("Twitch connected successfully!");
            setSuccessOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (params.get("twitch_error")) {
            setSuccessMessage("Failed to connect Twitch");
            setSuccessOpen(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        checkTwitchStatus();
    }, []);

    const handleTwitchConnect = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setSuccessMessage("Please login first");
            setSuccessOpen(true);
            return;
        }
        // Redirect to Twitch OAuth with token in state
        window.location.href = `http://localhost:8080/auth/twitch?state=${token}`;
    };

    const handleTwitchDisconnect = async () => {
        setTwitchLoading(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8080/auth/twitch/disconnect", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                setTwitchConnected(false);
                setTwitchUsername("");
                setSuccessMessage("Twitch disconnected successfully");
                setSuccessOpen(true);
            }
        } catch (err) {
            console.error("Failed to disconnect Twitch:", err);
        }
        setTwitchLoading(false);
    };

    const updateChangesAPI = async (name, email, password) => {
        if (!name) {
            setNameError("Full name is required");
            return;
        }
        if (!email || !validator.isEmail(email)) {
            setEmailError("Please enter a valid email");
            return;
        }
        if (!password) {
            setPasswordError("Password must not be empty");
            return;
        }
        
        setIsDisabled(true);
        
        try {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("authToken");
            const url = "http://localhost:8080/users/" + userId;
            const payload = { name, email };
            if (password && password.length > 0) payload.password = password;
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
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
            localStorage.setItem("userName", name);
            localStorage.setItem("userEmail", email);
            setNameError("");
            setEmailError("");
            setPasswordError("");
            setPassword("");
            setSuccessMessage("Profile updated successfully");
            setSuccessOpen(true);
        } catch (err) {
            setNameError(err.message);
        }
        
        setTimeout(() => {
            setIsDisabled(false);
        }, 3000);
  };

    return (
        <>
        <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(11, 18, 34, 1)",
            color: "#fff",
            }}
        >
            <Box sx= {{ display: "flex", alignItems: "center", gap: 3, mt: 2 }}>
                <Sidebar />
                <Typography variant="h4" component="h1">Settings</Typography>
            </Box>
            <Box sx= {{ display: "flex", mt: 2 }}>
                <Card
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 5,
                    color: "white",
                  }}
                >
                    <CardContent>
                        <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mb: 3,
                        }}
                        >
                            <AccountCircleIcon sx={{ fontSize: 40 }} />
                        </Box>
                        <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#fff", fontSize: 16 }}>
                                    Full Name
                                </Typography>
                                <TextField
                                    value={name}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setName(v);
                                        setNameError(v ? "" : "Full name is required");
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    error={!!nameError}
                                    helperText={nameError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: 'rgba(255,255,255,0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255,255,255,0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255,255,255,0.7)',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#fff", fontSize: 16 }}>
                                    Email
                                </Typography>
                                <TextField
                                    value={email}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setEmail(v);
                                        setEmailError(validator.isEmail(v) ? "" : "Please enter a valid email");
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    error={!!emailError}
                                    helperText={emailError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: 'rgba(255,255,255,0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255,255,255,0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255,255,255,0.7)',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1, color: "#fff", fontSize: 16 }}>
                                    Password
                                </Typography>
                                <TextField
                                    value={password}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setPassword(v);
                                        setPasswordError(v ? "" : "Password is required");
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    type="password"
                                    error={!!passwordError}
                                    helperText={passwordError}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            color: 'white',
                                            '& fieldset': {
                                                borderColor: 'rgba(255,255,255,0.3)',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'rgba(255,255,255,0.5)',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'rgba(255,255,255,0.7)',
                                            },
                                        },
                                    }}
                                />
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            onClick={() => updateChangesAPI(name, email, password)}
                            disabled={isUpdateButtonDisabled}
                            sx={{
                                background: 'linear-gradient(90deg, #d55cf6ff 0%, #60A5FA 100%)',
                                color: 'white',
                                '&:hover': {
                                    background: 'linear-gradient(90deg, #a53aedff 0%, #3B82F6 100%)',
                                },
                            }}
                        >
                            Save Changes
                        </Button>

                        {/* Connected Services Section */}
                        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />
                        
                        <Typography variant="h6" sx={{ mb: 3, color: '#fff' }}>
                            Connected Services
                        </Typography>

                        {/* Twitch Connection */}
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: 'rgba(145, 70, 255, 0.1)',
                            border: '1px solid rgba(145, 70, 255, 0.3)',
                            mb: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 1,
                                    backgroundColor: '#9146FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Typography sx={{ fontWeight: 'bold', color: 'white' }}>T</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 500 }}>
                                        Twitch
                                    </Typography>
                                    {twitchConnected ? (
                                        <Chip 
                                            label={`Connected as ${twitchUsername}`}
                                            size="small"
                                            icon={<LinkIcon sx={{ color: '#4ade80 !important' }} />}
                                            sx={{ 
                                                backgroundColor: 'rgba(74, 222, 128, 0.2)',
                                                color: '#4ade80',
                                                '& .MuiChip-icon': { color: '#4ade80' }
                                            }}
                                        />
                                    ) : (
                                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                            Not connected
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                            {twitchConnected ? (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleTwitchDisconnect}
                                    disabled={twitchLoading}
                                    startIcon={<LinkOffIcon />}
                                    sx={{
                                        borderColor: 'rgba(239, 68, 68, 0.5)',
                                        color: '#ef4444',
                                        '&:hover': {
                                            borderColor: '#ef4444',
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        }
                                    }}
                                >
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleTwitchConnect}
                                    disabled={twitchLoading}
                                    startIcon={<LinkIcon />}
                                    sx={{
                                        backgroundColor: '#9146FF',
                                        '&:hover': {
                                            backgroundColor: '#7c3aed',
                                        }
                                    }}
                                >
                                    Connect Twitch
                                </Button>
                            )}
                        </Box>

                        <Snackbar
                            open={successOpen}
                            autoHideDuration={3000}
                            onClose={() => setSuccessOpen(false)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                            <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
                                {successMessage}
                            </Alert>
                        </Snackbar>
                    </CardContent>
                </Card>
            </Box>
        </Box>
        </>
    )
}