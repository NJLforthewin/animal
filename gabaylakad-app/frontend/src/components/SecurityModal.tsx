import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

// Import MUI Icons
import KeyIcon from '@mui/icons-material/Key';
import ShieldIcon from '@mui/icons-material/Shield';
import HistoryIcon from '@mui/icons-material/History';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

// Assuming this is a custom component, we import it
// It should ideally be styled with MUI as well
import { ChangePasswordForm } from './PreferencesSection'; 

interface LoginActivity {
  device: string;
  browser: string;
  timestamp: string;
}

interface SecurityModalProps {
  open: boolean;
  onClose: () => void;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ open, onClose }) => {
  // Submodal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  
  // Login activity (mock data)
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([
    { device: 'iPhone 13', browser: 'Safari', timestamp: '2025-10-18 09:12' },
    { device: 'Windows PC', browser: 'Chrome', timestamp: '2025-10-17 21:44' },
    { device: 'MacBook Pro', browser: 'Edge', timestamp: '2025-10-16 15:30' },
  ]);
  const [loggingOut, setLoggingOut] = useState(false);

  // Close all sub-modals and call the main onClose
  const handleCloseAll = () => {
    setShowChangePassword(false);
    setShow2FA(false);
    setShowLoginActivity(false);
    onClose(); // Close the main modal
  };

  const handleLogoutAll = () => {
    setLoggingOut(true);
    setTimeout(() => {
      setLoginActivity([]);
      setLoggingOut(false);
    }, 1200);
  };

  // Navigation items
  const modalNav = [
    {
      label: 'Change Password',
      icon: <KeyIcon />,
      onClick: () => setShowChangePassword(true),
    },
    {
      label: 'Two-Factor Authentication (2FA)',
      icon: <ShieldIcon />,
      onClick: () => setShow2FA(true),
    },
    {
      label: 'Login Activity',
      icon: <HistoryIcon />,
      onClick: () => setShowLoginActivity(true),
    },
  ];

  return (
    <>
      {/* Main Security Modal */}
      <Dialog
        open={open && !showChangePassword && !show2FA && !showLoginActivity}
        onClose={handleCloseAll}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Security
          <IconButton onClick={handleCloseAll} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List component="nav">
            {modalNav.map((item) => (
              <ListItemButton key={item.label} onClick={item.onClick} sx={{ borderRadius: 2, mb: 1 }}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                <ChevronRightIcon />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Change Password Submodal */}
      <Dialog open={showChangePassword} onClose={() => setShowChangePassword(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Change Password
          <IconButton onClick={() => setShowChangePassword(false)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Assuming ChangePasswordForm handles its own content and actions */}
          <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
        </DialogContent>
      </Dialog>

      {/* 2FA Submodal */}
      <Dialog open={show2FA} onClose={() => setShow2FA(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Two-Factor Authentication
          <IconButton onClick={() => setShow2FA(false)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <FormControlLabel
              control={<Switch checked={twoFAEnabled} onChange={e => setTwoFAEnabled(e.target.checked)} />}
              label="Enable 2FA"
            />
            <Alert severity={twoFAEnabled ? "success" : "warning"}>
              {twoFAEnabled
                ? "2FA enabled via Authenticator App."
                : "2FA is currently turned off. We strongly recommend enabling it."}
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShow2FA(false)} color="inherit">Cancel</Button>
          <Button onClick={() => setShow2FA(false)} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Login Activity Submodal */}
      <Dialog open={showLoginActivity} onClose={() => setShowLoginActivity(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Login Activity
          <IconButton onClick={() => setShowLoginActivity(false)} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            {loginActivity.length > 0 ? (
              loginActivity.map((item, idx) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                  <Typography variant="body2">
                    <b>Device:</b> {item.device}
                  </Typography>
                  <Typography variant="body2">
                    <b>Browser:</b> {item.browser}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.timestamp}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Alert severity="info">You are not logged in on any other devices.</Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            disabled={loggingOut || loginActivity.length === 0}
            onClick={handleLogoutAll}
            startIcon={loggingOut ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loggingOut ? 'Logging out...' : 'Log out of all devices'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecurityModal;
