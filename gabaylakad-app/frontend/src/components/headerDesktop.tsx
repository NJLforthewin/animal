import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserType } from '../pages/Profile'; // Assuming UserContext is exported from Profile
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
  Button,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

// Import MUI Icons
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';

// Navigation tabs with MUI icons
const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
  { key: 'profile', label: 'Account', icon: <AccountCircleIcon /> },
  { key: 'history', label: 'History', icon: <HistoryIcon /> },
  { key: 'location', label: 'Location Tracking', icon: <LocationOnIcon /> },
  { key: 'sensor', label: 'Sensor Data', icon: <MemoryIcon /> },
];

interface HeaderDesktopProps {
  user: UserType | null; // Use the specific type
  onNavigate?: (path: string) => void;
  // Allow passing sx props for customization (like transparency)
  sx?: object; 
}

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({ user, onNavigate, sx }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate(); // Use navigate hook directly

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigationClick = (key: string) => {
    const path = key === 'profile' ? '/profile' : `/${key}`;
    handleMenuClose();
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path); // Use navigate hook
    }
  };

  const handleLogout = () => {
    handleMenuClose();
    sessionStorage.clear();
    if (onNavigate) {
      onNavigate('/login');
    } else {
      navigate('/login'); // Use navigate hook
    }
  };

  // Generate a fallback avatar URL
  const getAvatarSrc = () => {
    if (user?.avatar) return user.avatar;
    const name = encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || 'User'));
    // Consistent background color with mobile/other parts
    return `https://ui-avatars.com/api/?name=${name}&background=8e44ad&color=fff`; 
  };

  return (
    // Use AppBar for the main header structure
    <AppBar 
      position="fixed" // Changed to fixed from static
      color="default" 
      elevation={0} // Default to no shadow, override via sx if needed
      sx={{ 
        bgcolor: 'background.paper', // Default background
        boxShadow: 1, // Default shadow
        ...sx // Apply incoming sx props (allows transparency override)
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, px: { xs: 2, sm: 3, md: 5 } }}> {/* Adjust padding */}
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}> {/* Added margin */}
          {/* Adjusted logo size */}
          <img src="/Logo.png" alt="Logo" style={{ height: 40, width: 'auto' }} /> 
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} /> 

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}> {/* Reduced gap */}
          {/* Notifications Icon */}
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          {/* User Avatar Button */}
          <IconButton onClick={handleMenuClick} size="small">
            <Avatar
              src={getAvatarSrc()}
              alt="Avatar"
              sx={{ width: 36, height: 36 }} // Slightly smaller avatar
            />
          </IconButton>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={userMenuOpen}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'user-menu-button',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                overflow: 'visible',
                mt: 1.5,
                width: 280, // Adjusted width
                borderRadius: 2,
                '& .MuiAvatar-root': {
                  width: 36,
                  height: 36,
                  mr: 1.5,
                },
                '&:before': { // Optional: Arrow pointing up
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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

            {/* Navigation Links */}
            {navTabs.map(tab => (
              <MenuItem key={tab.key} onClick={() => handleNavigationClick(tab.key)}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderDesktop;
