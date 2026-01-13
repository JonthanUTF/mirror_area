import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import TimelineIcon from "@mui/icons-material/Timeline";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = (e) => {
    localStorage.setItem("authToken", "");
    localStorage.setItem("token", "");
    localStorage.setItem("userId", "");
    localStorage.setItem("userName", "");
    localStorage.setItem("userEmail", "");
    localStorage.setItem("oauth_return", "");
    handleNavigation('/login');
  };

  return (
    <>
        {/* Menu icon */}      
        <AppBar position="static" color="transparent" sx = {{ borderRadius: 7, width: 'fit-content' }}>
        <Toolbar sx={{
            justifyContent: "space-between",
            color:"#ffffff",
            }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
            </IconButton>
        </Toolbar>
        </AppBar>

        {/* Sidebar */}
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
            <Box sx={{
              width: 250,
              backgroundColor: '#160b23ff',
              height: '100%',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              paddingBottom: 2
              }} role="presentation">
            <List sx={{ flex: '1 1 auto' }}>
                <ListItem 
                  button 
                  onClick={() => handleNavigation('/home')} 
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}>
                <ListItemIcon sx={{ color: '#ffffff' }}><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
                </ListItem>

                <ListItem 
                  button 
                  onClick={() => handleNavigation('/services')} 
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}>
                <ListItemIcon sx={{ color: '#ffffff' }}><TimelineIcon /></ListItemIcon>
                <ListItemText primary="Services" />
                </ListItem>

                <ListItem 
                  button 
                  onClick={() => handleNavigation('/settings')} 
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}>
                <ListItemIcon sx={{ color: '#ffffff' }}><SettingsIcon /></ListItemIcon>
                <ListItemText primary="Settings" />
                </ListItem>

                <ListItem 
                  button 
                  onClick={() => handleNavigation('/admin')} 
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}>
                <ListItemIcon sx={{ color: '#ffffff' }}><GroupIcon /></ListItemIcon>
                <ListItemText primary="User Management" />
                </ListItem>
            </List>

            <Box sx={{ px: 1, py: 1 }}>
                <ListItem 
                  button 
                  onClick={() => handleLogout()} 
                  sx={{ 
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}>
                  <ListItemIcon sx={{ color: '#ffffff' }}><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Log out" />
                </ListItem>
            </Box>
            </Box>
        </Drawer>
    </>
  );
}
