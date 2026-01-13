import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    FormControlLabel,
    Switch,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function CreateActionReaction() {
    const navigate = useNavigate();

    // Services fetched from backend
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // Connection status for services
    const [twitchConnected, setTwitchConnected] = useState(false);
    const [googleConnected, setGoogleConnected] = useState(false);
    const [microsoftConnected, setMicrosoftConnected] = useState(false);

    // Form state
    const [name, setName] = useState("");
    const [actionService, setActionService] = useState("");
    const [actionType, setActionType] = useState("");
    const [reactionService, setReactionService] = useState("");
    const [reactionType, setReactionType] = useState("");
    const [active, setActive] = useState(true);
    const [actionParams, setActionParams] = useState({});
    const [reactionParams, setReactionParams] = useState({});

    const [error, setError] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [responseOk, setResponseOk] = useState(null);

    // Fetch services from backend
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_BASE}/about.json`);
                const data = await res.json();
                setServices(data.server?.services || []);
            } catch (err) {
                console.error("Failed to fetch services:", err);
                setError("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Check service connection status
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
                    setTwitchConnected(data.connected);
                }
            } catch (err) {
                console.error("Failed to check Twitch status:", err);
            }

            // Check Google and Microsoft (via user services)
            try {
                const res = await fetch(`${API_BASE}/services`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    const googleService = data.find(s => s.service?.name === 'google');
                    setGoogleConnected(!!googleService);
                    
                    const microsoftService = data.find(s => s.service?.name === 'microsoft');
                    setMicrosoftConnected(!!microsoftService);
                }
            } catch (err) {
                console.error("Failed to check services status:", err);
            }
        };

        checkConnections();

        // Check for OAuth callback params
        const params = new URLSearchParams(window.location.search);
        if (params.get("twitch_connected") === "true") {
            setTwitchConnected(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (params.get("microsoft_connected") === "true") {
            setMicrosoftConnected(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
        if (params.get("google_connected") === "true") {
            setGoogleConnected(true);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    // Get actions for selected service
    const getActionsForService = (serviceName) => {
        const service = services.find(s => s.name === serviceName);
        return service?.actions || [];
    };

    // Get reactions for selected service
    const getReactionsForService = (serviceName) => {
        const service = services.find(s => s.name === serviceName);
        return service?.reactions || [];
    };

    // Get services that have actions
    const servicesWithActions = services.filter(s => s.actions && s.actions.length > 0);

    // Get services that have reactions
    const servicesWithReactions = services.filter(s => s.reactions && s.reactions.length > 0);

    // Get selected action details
    const selectedAction = getActionsForService(actionService).find(a => a.name === actionType);

    // Get selected reaction details
    const selectedReaction = getReactionsForService(reactionService).find(r => r.name === reactionType);

    // Check if service requires OAuth
    const serviceRequiresOAuth = (serviceName) => {
        return ['twitch', 'google', 'microsoft'].includes(serviceName);
    };

    // Check if service is connected
    const isServiceConnected = (serviceName) => {
        if (serviceName === 'twitch') return twitchConnected;
        if (serviceName === 'google') return googleConnected;
        if (serviceName === 'microsoft') return microsoftConnected;
        return true; // Non-OAuth services are always "connected"
    };

    // Handle Twitch OAuth connection
    const handleTwitchConnect = () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            setError("Please login first");
            return;
        }
        window.location.href = `${API_BASE}/auth/twitch?state=${token}`;
    };

    // Handle Google OAuth connection
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

    // Handle Microsoft OAuth connection
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
            
            // Redirect to Microsoft OAuth (same tab like other services)
            window.location.href = connectUrl;
        } catch (err) {
            const msg = err?.message || "Failed to connect Microsoft";
            setResponseOk(false);
            setResponseText(msg);
            setDialogOpen(true);
            setError(msg);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setError("");

        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        if (!actionService || !actionType) {
            setError("Please select an action");
            return;
        }

        if (!reactionService || !reactionType) {
            setError("Please select a reaction");
            return;
        }

        // Check OAuth requirements
        if (serviceRequiresOAuth(actionService) && !isServiceConnected(actionService)) {
            setError(`Please connect ${actionService} first`);
            return;
        }

        if (serviceRequiresOAuth(reactionService) && !isServiceConnected(reactionService)) {
            setError(`Please connect ${reactionService} first`);
            return;
        }

        // Merge action and reaction params
        const mergedParams = {
            ...actionParams,
            ...reactionParams,
        };

        const payload = {
            name,
            actionService,
            actionType,
            reactionService,
            reactionType,
            parameters: mergedParams,
            active,
        };

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_BASE}/areas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(payload),
            });

            const raw = await res.text();
            let parsed;
            try { parsed = JSON.parse(raw); } catch { parsed = null; }
            const message = parsed?.message || parsed?.error || raw || `HTTP ${res.status}`;

            setResponseOk(res.ok);
            setResponseText(message);
            setDialogOpen(true);

            if (!res.ok) {
                setError(message);
            }
        } catch (err) {
            const msg = err?.message || "Network error";
            setResponseOk(false);
            setResponseText(msg);
            setDialogOpen(true);
            setError(msg);
        }
    };

    // Render parameter inputs for action/reaction
    const renderParamInputs = (options, params, setParams, prefix) => {
        if (!options) return null;

        return Object.entries(options).map(([key, type]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');

            // Handle select fields (format: "select:option1,option2,option3")
            if (type.startsWith('select:')) {
                const selectOptions = type.replace('select:', '').split(',');
                return (
                    <Grid item xs={12} sm={6} key={`${prefix}-${key}`}>
                        <FormControl fullWidth>
                            <InputLabel>{label}</InputLabel>
                            <Select
                                value={params[key] || selectOptions[0]}
                                label={label}
                                onChange={(e) => setParams({ ...params, [key]: e.target.value })}
                            >
                                {selectOptions.map((opt) => (
                                    <MenuItem key={opt} value={opt}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                );
            }

            // Default text/number field
            return (
                <Grid item xs={12} sm={6} key={`${prefix}-${key}`}>
                    <TextField
                        label={label}
                        fullWidth
                        type={type === 'number' ? 'number' : 'text'}
                        value={params[key] || ''}
                        onChange={(e) => setParams({ ...params, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                        placeholder={`Enter ${key}`}
                    />
                </Grid>
            );
        });
    };

    // Render connection button for a service
    const renderConnectionButton = (serviceName) => {
        const connected = isServiceConnected(serviceName);

        if (serviceName === 'twitch') {
            return (
                <Button
                    variant={connected ? "outlined" : "contained"}
                    onClick={handleTwitchConnect}
                    disabled={connected}
                    startIcon={connected ? <CheckCircleIcon /> : <LinkIcon />}
                    sx={{
                        backgroundColor: connected ? 'transparent' : '#9146FF',
                        borderColor: connected ? '#4ade80' : undefined,
                        color: connected ? '#4ade80' : 'white',
                        '&:hover': {
                            backgroundColor: connected ? 'transparent' : '#7c3aed',
                        }
                    }}
                >
                    {connected ? 'Twitch Connected' : 'Connect Twitch'}
                </Button>
            );
        }

        if (serviceName === 'google') {
            return (
                <Button
                    variant={connected ? "outlined" : "contained"}
                    onClick={handleGoogleConnect}
                    disabled={connected}
                    startIcon={connected ? <CheckCircleIcon /> : <LinkIcon />}
                    sx={{
                        backgroundColor: connected ? 'transparent' : '#4285F4',
                        borderColor: connected ? '#4ade80' : undefined,
                        color: connected ? '#4ade80' : 'white',
                        '&:hover': {
                            backgroundColor: connected ? 'transparent' : '#3367D6',
                        }
                    }}
                >
                    {connected ? 'Google Connected' : 'Connect Google'}
                </Button>
            );
        }

        if (serviceName === 'microsoft') {
            return (
                <Button
                    variant={connected ? "outlined" : "contained"}
                    onClick={handleMicrosoftConnect}
                    disabled={connected}
                    startIcon={connected ? <CheckCircleIcon /> : <LinkIcon />}
                    sx={{
                        backgroundColor: connected ? 'transparent' : '#00A4EF',
                        borderColor: connected ? '#4ade80' : undefined,
                        color: connected ? '#4ade80' : 'white',
                        '&:hover': {
                            backgroundColor: connected ? 'transparent' : '#0078D4',
                        }
                    }}
                >
                    {connected ? 'Microsoft Connected' : 'Connect Microsoft'}
                </Button>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", minWidth: "100vw", p: 2 }}>
            <Card sx={{ width: "100%", maxWidth: 1000, margin: "0 auto" }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Create Action-Reaction Workflow
                    </Typography>

                    {/* Connection Status */}
                    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ width: '100%', mb: 1 }}>
                            Service Connections:
                        </Typography>
                        {renderConnectionButton('twitch')}
                        {renderConnectionButton('google')}
                        {renderConnectionButton('microsoft')}
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={3}>
                            {/* Workflow Name */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Workflow Name"
                                    fullWidth
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            {/* ACTION SECTION */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, color: '#7c3aed' }}>
                                    🎯 Action (Trigger)
                                </Typography>
                            </Grid>

                            {/* Action Service */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Action Service</InputLabel>
                                    <Select
                                        value={actionService}
                                        label="Action Service"
                                        onChange={(e) => {
                                            setActionService(e.target.value);
                                            setActionType("");
                                            setActionParams({});
                                        }}
                                    >
                                        {servicesWithActions.map((s) => (
                                            <MenuItem key={s.name} value={s.name}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                                                    {serviceRequiresOAuth(s.name) && (
                                                        <Chip
                                                            size="small"
                                                            label={isServiceConnected(s.name) ? "Connected" : "OAuth"}
                                                            color={isServiceConnected(s.name) ? "success" : "warning"}
                                                        />
                                                    )}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Action Type */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth disabled={!actionService}>
                                    <InputLabel>Action Type</InputLabel>
                                    <Select
                                        value={actionType}
                                        label="Action Type"
                                        onChange={(e) => {
                                            setActionType(e.target.value);
                                            setActionParams({});
                                        }}
                                    >
                                        {getActionsForService(actionService).map((a) => (
                                            <MenuItem key={a.name} value={a.name}>
                                                {a.description || a.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Action Parameters */}
                            {selectedAction?.options && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Action Parameters:
                                        </Typography>
                                    </Grid>
                                    {renderParamInputs(selectedAction.options, actionParams, setActionParams, 'action')}
                                </>
                            )}

                            {/* REACTION SECTION */}
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ mb: 2, mt: 2, color: '#16a34a' }}>
                                    ⚡ Reaction
                                </Typography>
                            </Grid>

                            {/* Reaction Service */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Reaction Service</InputLabel>
                                    <Select
                                        value={reactionService}
                                        label="Reaction Service"
                                        onChange={(e) => {
                                            setReactionService(e.target.value);
                                            setReactionType("");
                                            setReactionParams({});
                                        }}
                                    >
                                        {servicesWithReactions.map((s) => (
                                            <MenuItem key={s.name} value={s.name}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
                                                    {serviceRequiresOAuth(s.name) && (
                                                        <Chip
                                                            size="small"
                                                            label={isServiceConnected(s.name) ? "Connected" : "OAuth"}
                                                            color={isServiceConnected(s.name) ? "success" : "warning"}
                                                        />
                                                    )}
                                                </Box>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Reaction Type */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth disabled={!reactionService}>
                                    <InputLabel>Reaction Type</InputLabel>
                                    <Select
                                        value={reactionType}
                                        label="Reaction Type"
                                        onChange={(e) => {
                                            setReactionType(e.target.value);
                                            setReactionParams({});
                                        }}
                                    >
                                        {getReactionsForService(reactionService).map((r) => (
                                            <MenuItem key={r.name} value={r.name}>
                                                {r.description || r.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Reaction Parameters */}
                            {selectedReaction?.options && (
                                <>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">
                                            Reaction Parameters:
                                        </Typography>
                                    </Grid>
                                    {renderParamInputs(selectedReaction.options, reactionParams, setReactionParams, 'reaction')}
                                </>
                            )}

                            {/* Active Toggle */}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={active}
                                            onChange={(e) => setActive(e.target.checked)}
                                        />
                                    }
                                    label="Active"
                                />
                            </Grid>
                        </Grid>

                        {/* Error Message */}
                        {error && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                {error}
                            </Alert>
                        )}

                        {/* Submit Buttons */}
                        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!actionService || !actionType || !reactionService || !reactionType || !name.trim()}
                                sx={{
                                    background: 'linear-gradient(90deg, #7c3aed 0%, #16a34a 100%)',
                                }}
                            >
                                Create Workflow
                            </Button>

                            <Button
                                variant="outlined"
                                onClick={() => navigate("/home")}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Response Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{responseOk ? "✅ Success" : "⚠️ Response"}</DialogTitle>
                <DialogContent>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>{responseText}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDialogOpen(false); if (responseOk) navigate("/home"); }}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
