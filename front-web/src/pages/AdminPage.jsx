import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Stack,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add, Edit, Delete } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import Sidebar from "../components/Sidebar";

export default function AdminPage() {
  const [users, setUsers] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState(null);
  const [error, setError] = React.useState("");
  const [isUnauthorized, setIsUnauthorized] = React.useState(false);

  const parseError = async (res) => {
    try {
      const body = await res.json();
      return body?.error || body?.message || `Request failed (${res.status})`;
    } catch {
      const text = await res.text().catch(() => "");
      return text || `Request failed (${res.status})`;
    }
  };

  const fetchUsers = React.useCallback(async () => {
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:8080/users", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        const errorMsg = await parseError(res);

        // Check if it's an admin privilege error
        if (res.status === 403 || errorMsg.toLowerCase().includes("admin")) {
          setIsUnauthorized(true);
          return;
        }

        setError(errorMsg);
        return;
      }

      const data = await res.json().catch(() => []);
      const list = Array.isArray(data) ? data : data?.users ?? data?.data ?? [];
      setUsers(list.map((u) => ({ ...u, role: u.role || "user" })));
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err?.message || "Failed to fetch users");
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`http://localhost:8080/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        setError(await parseError(res));
        return;
      }

      await fetchUsers();
    } catch (err) {
      console.error("Delete user error", err);
      setError(err?.message || "Failed to delete user");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    // remove empty strings
    Object.keys(data).forEach((k) => {
      if (typeof data[k] === "string" && data[k].trim() === "") delete data[k];
    });

    try {
      let res;
      if (editingUser) {
        res = await updateUser(editingUser.id, data);
      } else {
        res = await createUser(data);
      }

      if (!res.ok) {
        setError(await parseError(res));
        return;
      }

      await fetchUsers();
      setOpen(false);
    } catch (err) {
      console.error("Submit user error", err);
      setError(err?.message || "Failed to save user");
    }
  };

  async function createUser(payload) {
    const token = localStorage.getItem("authToken");
    return fetch("http://localhost:8080/users/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
  }

  async function updateUser(userId, updates) {
    const token = localStorage.getItem("authToken");
    return fetch(`http://localhost:8080/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(updates),
    });
  }

  const columns = [
    { field: "name", headerName: "Full Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => handleOpenEdit(params.row)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  // Show unauthorized page if user is not admin
  if (isUnauthorized) {
    return (
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
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Sidebar />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <LockIcon sx={{ fontSize: 80, color: "rgba(255, 255, 255, 0.3)" }} />
          <Typography variant="h3" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Admin Only
          </Typography>
          <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
            You don't have permission to access this page.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => window.history.back()}
            sx={{
              mt: 2,
              color: "#a855f7",
              borderColor: "#a855f7",
              "&:hover": {
                borderColor: "#9333ea",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
              },
            }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    );
  }

  return (
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
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Sidebar />
          <Typography variant="h4" component="h1">
            User Management
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpenCreate} sx={{ backgroundColor: "#a855f7" }}>
          Create User
        </Button>
      </Box>

      <Box p={4}>
        {error && (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={fetchUsers}>Retry</Button>} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ height: 400, backgroundColor: "white", borderRadius: 2 }}>
          <DataGrid rows={users} columns={columns} pageSizeOptions={[5]} disableRowSelectionOnClick />
        </Box>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{editingUser ? "Modify user" : "Create a user"}</DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Stack spacing={2}>
                <TextField name="name" label="Full Name" defaultValue={editingUser?.name || ""} required />
                <TextField name="email" label="Email" type="email" defaultValue={editingUser?.email || ""} required />
                {!editingUser && <TextField name="password" label="Password" type="password" defaultValue="" required />}
                <TextField select name="role" label="Role" defaultValue={editingUser?.role || "user"} required>
                  <MenuItem value="user">user</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                </TextField>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Box>
  );
}
