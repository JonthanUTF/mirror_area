import { Box, Card, CardContent, Typography, Button, Chip } from "@mui/material";
import AndroidIcon from '@mui/icons-material/Android';
import DownloadIcon from '@mui/icons-material/Download';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';

import Sidebar from "../components/Sidebar";

const API_BASE = process.env.CLIENT_URL || "http://localhost:8081";

export default function MobileAPK() {
    const handleDownload = () => {
        window.open(`${API_BASE}/download/apk`, '_blank');
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                width: "100vw",
                minHeight: "100vh",
                backgroundColor: "rgba(11, 18, 34, 1)",
                color: "#fff",
            }}
        >
            {/* Header */}
            <Box sx={{ width: "100%", mt: 2 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Sidebar />
                    <Typography variant="h4" component="h1">
                        Mobile Application
                    </Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 4,
                    gap: 4,
                }}
            >
                {/* Download Card */}
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 600,
                        backgroundColor: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 5,
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        {/* Icon */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                backgroundColor: "#3DDC84",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 3,
                            }}
                        >
                            <AndroidIcon sx={{ fontSize: 48, color: "white" }} />
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            AREA Mobile
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}
                        >
                            Download AREA mobile app to manage your workflow everywhere.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleDownload}
                            startIcon={<DownloadIcon />}
                            sx={{
                                backgroundColor: "#3DDC84",
                                color: "white",
                                px: 4,
                                py: 1.5,
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                borderRadius: 3,
                                "&:hover": {
                                    backgroundColor: "#32c973",
                                },
                            }}
                        >
                            Downloard APK
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}