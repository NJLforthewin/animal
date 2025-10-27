import React from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Paper, // Import Paper for visual grouping
  Stack,   // Import Stack for easier spacing
  Chip,    // Import Chip for clear status
  Alert,   // Import Alert for a more prominent status
} from '@mui/material';

// Import icons to add visual cues
import LockResetIcon from '@mui/icons-material/LockReset';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

const SecuritySettingsPanel: React.FC = () => {
  const passwordLastChangedDays = 42;
  const is2FAEnabled = false;

  // Function to determine the password status
  const getPasswordStatus = (): {
    color: 'error' | 'warning' | 'success';
    icon: React.ReactElement;
    text: string;
  } => {
    if (passwordLastChangedDays > 90) {
      return { 
        color: 'error', 
        icon: <ErrorIcon fontSize="small" />, 
        text: `Password Last Changed: ${passwordLastChangedDays} days ago. Please update your password.` 
      };
    }
    if (passwordLastChangedDays > 60) {
      return { 
        color: 'warning', 
        icon: <WarningIcon fontSize="small" />, 
        text: `Password Last Changed: ${passwordLastChangedDays} days ago. Consider updating it soon.` 
      };
    }
    return { 
      color: 'success', 
      icon: <CheckCircleIcon fontSize="small" />, 
      text: `Password Last Changed: ${passwordLastChangedDays} days ago.` 
    };
  };

  const passwordStatus = getPasswordStatus();

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 800, // Constrain width for better readability on large screens
      mx: 'auto',     // Center the container
      p: { xs: 2, md: 3 } 
    }}>
      
      {/* MAIN HEADING */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600">
          Security Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account's security controls to keep your data safe.
        </Typography>
      </Stack>
      
      {/* Use a Stack to manage the spacing between setting cards */}
      <Stack spacing={4}>

        {/* SECTION: Change Password */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <LockResetIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Password
              </Typography>
            </Stack>
            
            <Typography variant="body2" color="text.secondary" id="password-desc">
              Update your password regularly to protect your account. Your new password must be at least 8 characters long.
            </Typography>

            <Button 
              variant="contained" 
              color="primary" 
              sx={{ alignSelf: 'flex-start' }}
              aria-describedby="password-desc" // Accessibility improvement
            >
              Change Password
            </Button>
            
            {/* User-friendly status chip */}
            <Chip 
              icon={passwordStatus.icon}
              label={passwordStatus.text}
              color={passwordStatus.color}
              variant="outlined"
              sx={{ alignSelf: 'flex-start', p: 1, height: 'auto', '& .MuiChip-label': { whiteSpace: 'normal' } }}
            />
          </Stack>
        </Paper>

        {/* SECTION: Two-Factor Authentication (2FA) */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header with Status Chip */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 2 }} 
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SecurityIcon color="action" />
                <Typography variant="h6" component="h2" fontWeight="600">
                  Two-Factor Authentication
                </Typography>
              </Stack>
              
              {/* This chip is a much clearer status indicator */}
              <Chip
                icon={is2FAEnabled ? <CheckCircleIcon /> : <WarningIcon />}
                label={is2FAEnabled ? 'Enabled' : 'Disabled'}
                color={is2FAEnabled ? 'success' : 'warning'}
                sx={{ alignSelf: 'flex-start' }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" id="2fa-desc">
              Adds an extra layer of protection. You'll be required to enter a unique code from your mobile device each time you log in.
            </Typography>

            <Button 
              variant="contained" 
              color={is2FAEnabled ? 'error' : 'primary'} // Use 'error' for a destructive action like 'Disable'
              sx={{ alignSelf: 'flex-start' }}
              aria-describedby="2fa-desc" // Accessibility improvement
            >
              {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>

            {/* This Alert is more prominent than the caption text */}
            {!is2FAEnabled && (
              <Alert severity="warning" variant="outlined" icon={<WarningIcon fontSize="inherit" />}>
                We strongly recommend enabling 2FA to protect your account from unauthorized access.
              </Alert>
            )}
          </Stack>
        </Paper>
        
      </Stack>
    </Box>
  );
};

export default SecuritySettingsPanel;