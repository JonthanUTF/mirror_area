import { useState } from "react";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
} from "@mui/material";

import { API_BASE } from "./paramsHints";
import { useServices } from "./tools/useServices";
import { useConnections } from "./tools/useConnections";
import { useOAuthHandlers } from "./tools/useOAuthHandlers";
import { ConnectionButtonsGroup } from "./components/ConnectionButtons";
import { ActionSection } from "./components/ActionSection";
import { ReactionSection } from "./components/ReactionSection";
import { serviceRequiresOAuth } from "./serviceHelpers";
import Sidebar from "../../components/Sidebar";

export default function CreateActionReaction() {
    const navigate = useNavigate();

    // Custom hooks
    const { services, loading, error: servicesError } = useServices();
    const { isServiceConnected } = useConnections();

    // Form state
    const [name, setName] = useState("");
    const [actionService, setActionService] = useState("");
    const [actionType, setActionType] = useState("");
    const [reactionService, setReactionService] = useState("");
    const [reactionType, setReactionType] = useState("");
    const [active, setActive] = useState(true);
    const [actionParams, setActionParams] = useState({});
    const [reactionParams, setReactionParams] = useState({});

    // Dialog state
    const [error, setError] = useState(servicesError);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [responseOk, setResponseOk] = useState(null);

    // OAuth handlers
    const oauthHandlers = useOAuthHandlers(
        (msg) => setError(msg),
        setResponseOk,
        setResponseText,
        setDialogOpen
    );

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

        const payload = {
            name,
            actionService,
            actionType,
            reactionService,
            reactionType,
            actionParams,
            reactionParams,
            active,
        };

        console.log('[CreateArea] Payload:', JSON.stringify(payload, null, 2));

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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            display: "flex",
            minHeight: "100vh",
            minWidth: "100vw",
            backgroundColor: "rgba(11, 18, 34, 1)",
            color: "#fff",
            // enforce white font color for MUI components inside this page
            '& .MuiTypography-root': { color: '#fff' },
            '& .MuiButton-root': { color: '#fff' },
            '& .MuiInputBase-root': { color: '#fff' },
            '& .MuiInputLabel-root': { color: '#fff' },
            '& .MuiFormControlLabel-label': { color: '#fff' },
            '& .MuiDialogTitle-root': { color: '#fff' },
            '& .MuiDialogContent-root': { color: '#fff' },
            '& .MuiDialogActions-root': { color: '#fff' },
        }}>
            <Box sx={{ width: "100%", mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Sidebar />
                        <Typography variant="h4" gutterBottom>
                            Create Action-Reaction Workflow
                        </Typography>
                    </Box>
                </Box>

                {/* Connection buttons box */}
                <Box sx={{ mt: 2, mb: 3, backgroundColor: 'rgba(255,255,255,0.03)', p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Service Connections:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', '& button': { mr: 2, mb: 1 } }}>
                        <ConnectionButtonsGroup
                            handlers={oauthHandlers}
                            isServiceConnected={isServiceConnected}
                        />
                    </Box>
                </Box>

                {/* Creation box (form) */}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, backgroundColor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Workflow Creation:
                    </Typography>
                    <Grid container spacing={3}>
                        {/* Workflow Name */}
                        <Grid item xs={5}>
                            <TextField
                                label="Workflow Name"
                                fullWidth
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>

                        {/* ACTION SECTION */}
                        <Grid container item xs={12} spacing={2} alignItems="center">
                            <ActionSection
                                services={services}
                                actionService={actionService}
                                setActionService={setActionService}
                                actionType={actionType}
                                setActionType={setActionType}
                                actionParams={actionParams}
                                setActionParams={setActionParams}
                                isServiceConnected={isServiceConnected}
                            />
                        </Grid>

                        {/* REACTION SECTION */}
                        <Grid container item xs={12} spacing={2} alignItems="center">
                            <ReactionSection
                                services={services}
                                reactionService={reactionService}
                                setReactionService={setReactionService}
                                reactionType={reactionType}
                                setReactionType={setReactionType}
                                reactionParams={reactionParams}
                                setReactionParams={setReactionParams}
                                isServiceConnected={isServiceConnected}
                            />
                        </Grid>

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
                                backgroundColor: "#a855f7",
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
            </Box>
        </Box>
    );
}
