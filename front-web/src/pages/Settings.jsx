import { Box, TextField, Button, Card, CardContent, Typography } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';

import Sidebar from  "../Sidebar";


const user = {
    name: "John Pork",
    email: "john@porc.org"
}

export default function Settings() {
    const [isUpdateButtonDisabled, setIsDisabled] = useState(false);

    const updateChangesAPI = async (id) => {
        setIsDisabled(true);
        
        // API here
        
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
                                    defaultValue={user.name}
                                    variant="outlined"
                                    fullWidth
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
                                    defaultValue={user.email}
                                    variant="outlined"
                                    fullWidth
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
                            onClick={() => updateChangesAPI()}
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
                    </CardContent>
                </Card>
            </Box>
        </Box>
        </>
    )
}