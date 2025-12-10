import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Switch,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteArea = async (id) => {
    if (!window.confirm("Delete this workflow?")) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8080/areas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete area:", err);
      setError(err?.message || "Failed to delete workflow");
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchAreas = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("http://localhost:8080/areas", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const text = await res.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = text; }
        const list = Array.isArray(parsed) ? parsed : parsed?.areas ?? parsed?.data ?? [];
        if (mounted) setAreas(list);
      } catch (err) {
        if (mounted) setError(err?.message || "Failed to load areas");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAreas();
    return () => {
      mounted = false;
    };
  }, []);

  const renderAreaCard = (item, idx) => (
    <Grid item xs={12} sm={6} key={item.id ?? `${item.name}-${idx}`}>
      <Card sx={{ minWidth: 675, display: "flex",}}>
        <CardContent>
          <Box sx={{ display: "flex",  width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {item.active ? "Active" : "Inactive"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch checked={!!item.active} disabled />
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => deleteArea(item.id)}
                size="large"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Action: {item.actionService ?? "—"} — {item.actionType ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Reaction: {item.reactionService ?? "—"} — {item.reactionType ?? "—"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
        p: 2,
      }}
    >
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Button variant="outlined" onClick={() => navigate("/createActionReaction")}>
          Create Action-Reaction
        </Button>
      </Box>

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1400,
          minWidth: 1100,
          margin: "0 auto",
          mt: 4,
          mb: 4,
          height: "calc(100vh - 120px)",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Action-Reaction Workflows</Typography>
            <Typography variant="body2" color="text.secondary" fontSize={18}>
              {areas.length} workflows
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : areas.length === 0 ? (
            <Typography color="text.secondary">No workflows found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {areas.map((item, idx) => renderAreaCard(item, idx))}
            </Grid>
          )}
        </CardContent>
      </Paper>
    </Box>
  );
}