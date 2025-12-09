import { Box, CardContent, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "100vw",
        position: "relative",
      }}
    >
      <Box sx={{ position: "absolute", top: 2, right: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/createActionReaction")}
        >
          Create Action-Reaction
        </Button>
      </Box>
    </Box>
  );
}