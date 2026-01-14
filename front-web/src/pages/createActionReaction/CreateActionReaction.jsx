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
                        <ConnectionButtonsGroup
                            handlers={oauthHandlers}
                            isServiceConnected={isServiceConnected}
                        />
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

                            {/* REACTION SECTION */}
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
