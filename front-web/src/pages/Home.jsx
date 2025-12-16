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


import AccountTreeIcon from '@mui/icons-material/AccountTree';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const stats = [
  {
    label: "Total workflows",
    trend: "5",
    color: "#7c3aed",
    icon: AccountTreeIcon,
  },
  {
    label: "Active",
    trend: "3",
    color: "#16a34a",
    icon: CheckCircleOutlineIcon,
  },
];



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
      <Card sx={{ width: "100%", display: "flex", backgroundColor: "rgba(255,255,255,0.05)" }}>
        <CardContent>
          <Box sx={{ display: "flex", width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: "#fefefeff" }}>{item.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ color: "#fefefeff" }}>
                {item.active ? "Active" : "Inactive"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Switch checked={!!item.active} disabled color="warning" />
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
            <Typography variant="body2" color="text.secondary" sx={{ color: "#fefefeff" }}>
              Action: {item.actionService ?? "-"} — {item.actionType ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, color: "#fefefeff" }}>
              Reaction: {item.reactionService ?? "-"} — {item.reactionType ?? "—"}
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
        flexDirection: "column",
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(11, 18, 34, 1)",
        color: "#fff",
      }}
    >
      {/* Header: title + description on the left, action button aligned right */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and monitor your automations
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate("/createActionReaction")}
            sx={{ backgroundColor: "#a855f7" }}
          >
            Create workflow
          </Button>
        </Box>
      </Box>

      {/* Stats grid */}
      <Box sx={{ width: "100%", mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 2, sm: 3 },
            mb: { xs: 3, sm: 4 },
          }}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Box
                key={index}
                sx={{
                  width: { xs: "50%", lg: "25%" }, // mimic Grid xs=6 lg=3
                  boxSizing: "border-box",
                  p: 0,
                }}
              >
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
                    {/* Icon */}
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        borderRadius: 2,
                        backgroundColor: stat.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: { xs: 2, sm: 3 },
                      }}
                    >
                      <Icon sx={{ color: "white", fontSize: { xs: 20, sm: 24 } }} />
                    </Box>

                    {/* Trend */}
                    <Typography variant="h5" sx={{ color: "#fefefeff" }}>
                      {stat.trend}
                    </Typography>

                    {/* Label */}
                    <Typography variant="h6" sx={{ color: "#dacbcbff" }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Typography variant="h4" component="h1">
        Your workflows
      </Typography>

      {/* Areas list (existing) */}
      <Box sx={{ width: "100%", mt: 2 }}>
        {/* keep existing areas rendering logic */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : areas.length === 0 ? (
          <Typography color="text.secondary">No workflows found.</Typography>
        ) : (
          <Grid container spacing={2} sx={{ width: "100%" }}> {/* parent full width */}
             {areas.map((item, idx) => renderAreaCard(item, idx))}
           </Grid>
         )}
      </Box>
    </Box>
  );
}