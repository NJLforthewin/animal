import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../pages/Profile'; 
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  AppBarProps, // Import AppBarProps
} from '@mui/material';

// Import MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import useScrollTrigger from '@mui/material/useScrollTrigger';
// Navigation tabs with MUI icons
const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { key: 'profile', label: 'Account', icon: <AccountCircleIcon /> },
  { key: 'history', label: 'History', icon: <HistoryIcon /> },
  { key: 'location', label: 'Location Tracking', icon: <LocationOnIcon /> },
  { key: 'sensor', label: 'Sensor Data', icon: <MemoryIcon /> },
];

// useIsMobile hook (as provided)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Header: React.FC<AppBarProps> = ({ sx, ...otherProps }) => {
  // Handler for opening the user menu
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler for closing the user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Utility to get avatar src
  const getAvatarSrc = () => {
    if (user && user.avatar) return user.avatar;
    return '/default-avatar.png'; // fallback avatar
  };

  // Handler for navigation from menu
  const handleNavigate = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  // Handler for logout
  const handleLogout = () => {
    handleMenuClose();
    // Add your logout logic here (e.g., clear tokens, redirect)
    navigate('/login');
  };
  const { user } = useContext(UserContext);
  const isMobile = useIsMobile();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={isMobile ? (trigger ? 4 : 1) : 1}
      sx={{
        // Removed annoying blur effect on mobile
        backgroundColor: isMobile ? (trigger ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)') : 'background.paper',
        top: 0,
        ...sx
      }}
      {...otherProps}
    >
      <Toolbar>
        {isMobile ? (
          // Mobile Header
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo192.png" alt="Logo" style={{ width: 70, height: 70, marginRight: 8 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick} size="small" sx={{ ml: 1 }}>
              <Avatar
                src={getAvatarSrc()}
                alt="Avatar"
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
          </>
        ) : (
          // Desktop Header
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img src="/logo192.png" alt="Logo" style={{ width: 70, height: 70, marginRight: 12 }} />
            </Box>

            {/* Navigation removed from Toolbar */}
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}

            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleMenuClick} size="small" sx={{ ml: 2 }}>
              <Avatar
                src={getAvatarSrc()}
                alt="Avatar"
                sx={{ width: 36, height: 36 }}
              />
            </IconButton>
          </>
        )}

        {/* User Menu (shared by mobile and desktop) */}
        <Menu
          anchorEl={anchorEl}
          open={userMenuOpen}
          onClose={handleMenuClose}
          disableScrollLock={true}
          MenuListProps={{
            'aria-labelledby': 'user-menu-button',
          }}
          // --- Refined Positioning ---
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right', // Anchor point on the button
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right', // Point on the menu to align with anchorOrigin
          }}
          // --- End Refined Positioning ---
          PaperProps={{
              border: '1px solid',
              borderColor: 'black',
            elevation: 3,
            sx: {
              overflow: 'visible',
              mt: 1.5, 
              width: 260,
              borderRadius: 2,
              boxShadow: 'none', 
              border: 'none',
              bgcolor: 'grey.100',
              borderColor: 'grey.300',
              '& .MuiAvatar-root': {
                width: 36,
                height: 36,
                ml: -0.5,
                mr: 1.5,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: '18px', 
                width: 10,
                height: 10,
                bgcolor: 'grey.100',
                borderLeft: '1px solid',
                borderTop: '1px solid',
                borderColor: 'grey.300',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          {/* User Info Header */}
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
            <Avatar src={getAvatarSrc()} alt="Avatar" />
            <Box sx={{ overflow: 'hidden' }}> {/* Prevent long names/emails overflowing */}
              <Typography variant="body1" fontWeight="600" noWrap>
                {(user?.first_name || '') + ' ' + (user?.last_name || '')}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user?.email || 'user@email.com'}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />

           {/* Render all nav links in the menu for BOTH mobile and desktop */}
           {navTabs.map(tab => (
             <MenuItem key={tab.key} onClick={() => handleNavigate(`/${tab.key}`)}>
               <ListItemIcon>{tab.icon}</ListItemIcon>
               <ListItemText>{tab.label}</ListItemText>
             </MenuItem>
           ))}

          <Divider sx={{ my: 1 }} />

          {/* Logout Button */}
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

