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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

export default function CreateActionReaction() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [actionService, setActionService] = useState("");
    const [actionType, setActionType] = useState("");
    const [reactionService, setReactionService] = useState("");
    const [reactionType, setReactionType] = useState("");
    const [active, setActive] = useState(true);
    const [parameters, setParameters] = useState("");

    const [intervalS, setintervalS] = useState("");
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");

    // GitHub parameters
    const [githubOwner, setGithubOwner] = useState("");
    const [githubRepo, setGithubRepo] = useState("");
    const [githubBranch, setGithubBranch] = useState("main");
    const [githubTitle, setGithubTitle] = useState("");
    const [githubBody, setGithubBody] = useState("");
    const [githubPath, setGithubPath] = useState("");
    const [githubContent, setGithubContent] = useState("");
    const [githubIssueNumber, setGithubIssueNumber] = useState("");
    const [githubTagName, setGithubTagName] = useState("");

    const [error, setError] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [responseOk, setResponseOk] = useState(null);

    const actionTypeOptions = [
        { value: "interval", label: "Interval Timer" },
        { value: "check_temp", label: "Check Condition (rain, snow, clear)" },
        { value: "issue_created", label: "GitHub: Issue Created" },
        { value: "pr_opened", label: "GitHub: PR Opened" },
        { value: "push_committed", label: "GitHub: Push/Commit" },
        { value: "release_published", label: "GitHub: Release Published" },
        { value: "repo_starred", label: "GitHub: Repo Starred" },
    ];

    const reactionTypeOptions = [
        { value: "send_email", label: "Send Mail" },
        { value: "log_message", label: "Console Log" },
        { value: "create_issue", label: "GitHub: Create Issue" },
        { value: "comment_issue", label: "GitHub: Comment Issue" },
        { value: "create_file", label: "GitHub: Create File" },
        { value: "create_release", label: "GitHub: Create Release" },
    ];


    const handleSubmit = async (e) => {
        e?.preventDefault?.();
        setError("");
        if (!name.trim()) {
            setError("Name is required");
            return;
        }

        let paramsPayload = parameters;
        try {
            paramsPayload = parameters ? JSON.parse(parameters) : {};
        } catch {
            paramsPayload = parameters;
        }

        const computedActionService =
            actionType === "check_temp" ? "weather" :
                actionType === "interval" ? "timer" :
                    ["issue_created", "pr_opened", "push_committed", "release_published", "repo_starred"].includes(actionType) ? "github" :
                        actionService;
        const computedReactionService =
            reactionType === "send_email" ? "google" :
                reactionType === "log_message" ? "console" :
                    ["create_issue", "comment_issue", "create_file", "create_release"].includes(reactionType) ? "github" :
                        reactionService;
        setActionService(computedActionService);
        setReactionService(computedReactionService);

        let mergedParams = paramsPayload;
        if (typeof mergedParams !== "object" || mergedParams === null) {
            mergedParams = { raw: mergedParams };
        }

        if (actionType === "interval") {
            mergedParams = { ...mergedParams, interval: intervalS ? Number(intervalS) : null };
        }

        // GitHub action parameters
        if (["issue_created", "pr_opened", "push_committed", "release_published", "repo_starred"].includes(actionType)) {
            mergedParams = {
                ...mergedParams,
                owner: githubOwner,
                repo: githubRepo,
            };
            if (actionType === "push_committed") {
                mergedParams.branch = githubBranch;
            }
        }

        if (reactionType === "send_email") {
            mergedParams = {
                ...mergedParams,
                recipient,
                subject,
                body,
            };
        }

        // GitHub reaction parameters
        if (reactionType === "create_issue") {
            mergedParams = {
                ...mergedParams,
                owner: githubOwner,
                repo: githubRepo,
                title: githubTitle,
                body: githubBody,
            };
        }

        if (reactionType === "comment_issue") {
            mergedParams = {
                ...mergedParams,
                owner: githubOwner,
                repo: githubRepo,
                issue_number: Number(githubIssueNumber),
                body: githubBody,
            };
        }

        if (reactionType === "create_file") {
            mergedParams = {
                ...mergedParams,
                owner: githubOwner,
                repo: githubRepo,
                path: githubPath,
                content: githubContent,
                message: githubTitle || `Update ${githubPath}`,
                branch: githubBranch,
            };
        }

        if (reactionType === "create_release") {
            mergedParams = {
                ...mergedParams,
                owner: githubOwner,
                repo: githubRepo,
                tag_name: githubTagName,
                name: githubTitle,
                body: githubBody,
            };
        }

        const payload = {
            name,
            actionService: computedActionService,
            actionType,
            reactionService: computedReactionService,
            reactionType,
            parameters: mergedParams,
            active,
        };

        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch("http://localhost:8080/areas", {
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

    const handleGoogleServiceConnection = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('pending_service', 'google');
            const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_BASE}/services/google/connect`, {
                method: "GET",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            const data = await res.json();

            const codeFromServer = data.token;
            if (codeFromServer) {
                const callbackBody = {
                    code: codeFromServer,
                    redirectUri: data.redirectUri || (process.env.REACT_APP_CLIENT_URL || "http://localhost:8081") + "/services/callback",
                };
                const cbRes = await fetch(`${API_BASE}/services/google/callback`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: JSON.stringify(callbackBody),
                });

                const cbRaw = await cbRes.text();
                let cbParsed;
                try { cbParsed = JSON.parse(cbRaw); } catch { cbParsed = null; }
                const cbMessage = cbParsed?.message || cbParsed?.error || cbRaw || `HTTP ${cbRes.status}`;

                setResponseOk(cbRes.ok);
                setResponseText(cbMessage);
                setDialogOpen(true);

                if (!cbRes.ok) {
                    setError(cbMessage);
                }

                return;
            }

            const connectUrl = data.url || data.connectUrl || data;
            if (!connectUrl) throw new Error("No connect URL returned from server");
            window.open(connectUrl, "_blank", "noopener,noreferrer");
        } catch (err) {
            const msg = err?.message || "Failed to open connect URL";
            setResponseOk(false);
            setResponseText(msg);
            setDialogOpen(true);
            setError(msg);
        }
    };

    const handleGitHubServiceConnection = async () => {
        try {
            localStorage.setItem('oauth_return', window.location.pathname || '/');
            localStorage.setItem('pending_service', 'github');
            const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_BASE}/services/github/connect`, {
                method: "GET",
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }

            const data = await res.json();
            const connectUrl = data.url || data.connectUrl;
            if (!connectUrl) throw new Error("No connect URL returned from server");
            window.open(connectUrl, "_blank", "noopener,noreferrer");
        } catch (err) {
            const msg = err?.message || "Failed to connect GitHub";
            setResponseOk(false);
            setResponseText(msg);
            setDialogOpen(true);
            setError(msg);
        }
    };

    const intervalInvalid =
        actionType === "interval" && (!intervalS || isNaN(Number(intervalS)) || Number(intervalS) <= 0);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", minWidth: "100vw" }}>
            <Card sx={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Create Action-Reaction Workflow
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={8}>
                                <FormControl fullWidth sx={{ minWidth: 150 }}>
                                    <InputLabel id="action-type-label">Action Type</InputLabel>
                                    <Select
                                        labelId="action-type-label"
                                        value={actionType}
                                        label="Action Type"
                                        onChange={(e) => setActionType(e.target.value)}
                                    >
                                        {actionTypeOptions.map((a) => (
                                            <MenuItem key={a.value} value={a.value}>
                                                {a.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Conditional field for interval */}
                            {actionType === "interval" && (
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Trigger interval (s)"
                                        required
                                        value={intervalS}
                                        onChange={(e) => setintervalS(e.target.value)}
                                        error={!!intervalInvalid}
                                        helperText={intervalInvalid ? "Enter a positive number in seconds" : ""}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ minWidth: 150 }}>
                                    <InputLabel id="reaction-type-label">Reaction Type</InputLabel>
                                    <Select
                                        labelId="reaction-type-label"
                                        value={reactionType}
                                        label="Reaction Type"
                                        onChange={(e) => setReactionType(e.target.value)}
                                    >
                                        {reactionTypeOptions.map((r) => (
                                            <MenuItem key={r.value} value={r.value}>
                                                {r.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Connect Google button */}
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGoogleServiceConnection}
                                    fullWidth
                                >
                                    Connect Google
                                </Button>
                            </Grid>

                            {/* Connect GitHub button */}
                            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGitHubServiceConnection}
                                    fullWidth
                                >
                                    Connect GitHub
                                </Button>
                            </Grid>

                            {/* GitHub Action Parameters */}
                            {["issue_created", "pr_opened", "push_committed", "release_published", "repo_starred"].includes(actionType) && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="GitHub Owner"
                                            fullWidth
                                            required
                                            value={githubOwner}
                                            onChange={(e) => setGithubOwner(e.target.value)}
                                            placeholder="octocat"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Repository Name"
                                            fullWidth
                                            required
                                            value={githubRepo}
                                            onChange={(e) => setGithubRepo(e.target.value)}
                                            placeholder="my-repo"
                                        />
                                    </Grid>
                                    {actionType === "push_committed" && (
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Branch"
                                                fullWidth
                                                value={githubBranch}
                                                onChange={(e) => setGithubBranch(e.target.value)}
                                                placeholder="main"
                                            />
                                        </Grid>
                                    )}
                                </>
                            )}

                            {/* GitHub Reaction Parameters */}
                            {reactionType === "create_issue" && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="GitHub Owner"
                                            fullWidth
                                            required
                                            value={githubOwner}
                                            onChange={(e) => setGithubOwner(e.target.value)}
                                            placeholder="octocat"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Repository Name"
                                            fullWidth
                                            required
                                            value={githubRepo}
                                            onChange={(e) => setGithubRepo(e.target.value)}
                                            placeholder="my-repo"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Issue Title"
                                            fullWidth
                                            required
                                            value={githubTitle}
                                            onChange={(e) => setGithubTitle(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Issue Body"
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            value={githubBody}
                                            onChange={(e) => setGithubBody(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

                            {reactionType === "comment_issue" && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="GitHub Owner"
                                            fullWidth
                                            required
                                            value={githubOwner}
                                            onChange={(e) => setGithubOwner(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Repository Name"
                                            fullWidth
                                            required
                                            value={githubRepo}
                                            onChange={(e) => setGithubRepo(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Issue/PR Number"
                                            fullWidth
                                            required
                                            type="number"
                                            value={githubIssueNumber}
                                            onChange={(e) => setGithubIssueNumber(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Comment"
                                            fullWidth
                                            required
                                            multiline
                                            minRows={3}
                                            value={githubBody}
                                            onChange={(e) => setGithubBody(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

                            {reactionType === "create_file" && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="GitHub Owner"
                                            fullWidth
                                            required
                                            value={githubOwner}
                                            onChange={(e) => setGithubOwner(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Repository Name"
                                            fullWidth
                                            required
                                            value={githubRepo}
                                            onChange={(e) => setGithubRepo(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="File Path"
                                            fullWidth
                                            required
                                            value={githubPath}
                                            onChange={(e) => setGithubPath(e.target.value)}
                                            placeholder="path/to/file.txt"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Branch"
                                            fullWidth
                                            value={githubBranch}
                                            onChange={(e) => setGithubBranch(e.target.value)}
                                            placeholder="main"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Commit Message"
                                            fullWidth
                                            value={githubTitle}
                                            onChange={(e) => setGithubTitle(e.target.value)}
                                            placeholder="Update file"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="File Content"
                                            fullWidth
                                            required
                                            multiline
                                            minRows={4}
                                            value={githubContent}
                                            onChange={(e) => setGithubContent(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

                            {reactionType === "create_release" && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="GitHub Owner"
                                            fullWidth
                                            required
                                            value={githubOwner}
                                            onChange={(e) => setGithubOwner(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Repository Name"
                                            fullWidth
                                            required
                                            value={githubRepo}
                                            onChange={(e) => setGithubRepo(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Tag Name"
                                            fullWidth
                                            required
                                            value={githubTagName}
                                            onChange={(e) => setGithubTagName(e.target.value)}
                                            placeholder="v1.0.0"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Release Name"
                                            fullWidth
                                            value={githubTitle}
                                            onChange={(e) => setGithubTitle(e.target.value)}
                                            placeholder="Version 1.0.0"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Release Description"
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            value={githubBody}
                                            onChange={(e) => setGithubBody(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* conditional fields for reaction */}
                            {reactionType === "send_email" && (
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Recipient"
                                            fullWidth
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Subject"
                                            fullWidth
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Body"
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            )}

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

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={!actionType || !reactionType || !name.trim() || intervalInvalid}
                            >
                                Create
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

            {/* Dialog showing server response */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{responseOk ? "Success" : "Response"}</DialogTitle>
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