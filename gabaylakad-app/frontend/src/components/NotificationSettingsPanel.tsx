import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  TextField,
  // Removed Grid from here
} from '@mui/material';
// import Grid from '@mui/material/Grid'; // Removing Grid entirely to fix type errors
// import Grid2 from '@mui/material/Grid2'; // Removing Grid2 to fix import error

// Import icons for consistency
import ForumIcon from '@mui/icons-material/Forum';
import ChecklistIcon from '@mui/icons-material/Checklist';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';

const NotificationSettingsPanel: React.FC = () => {
  const [channels, setChannels] = React.useState({
    email: true,
    sms: false,
    push: true,
  });
  const [accountSecurity, setAccountSecurity] = React.useState({
    passwordChange: true,
    newDevice: false,
  });
  const [marketingActivity, setMarketingActivity] = React.useState({
    newFeatures: true,
    promoOffers: false,
  });
  const [mute, setMute] = React.useState(false);
  const [dndStart, setDndStart] = React.useState('22:00');
  const [dndEnd, setDndEnd] = React.useState('07:00');

  // Handler for all checkbox changes
  const handleChannelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChannels(c => ({ ...c, [event.target.name]: event.target.checked }));
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSecurity(a => ({ ...a, [event.target.name]: event.target.checked }));
  };

  const handleMarketingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarketingActivity(m => ({ ...m, [event.target.name]: event.target.checked }));
  };


  return (
    <Box sx={{
      width: '100%',
      maxWidth: 800, // Consistent max-width
      mx: 'auto',     // Consistent centering
      p: { xs: 2, md: 3 } // Consistent padding
    }}>
      
      {/* MAIN HEADING */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="600">
          Notification Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage how and when you receive updates about your account.
        </Typography>
      </Stack>

      {/* Main stack for all settings cards */}
      <Stack spacing={4}>

        {/* SECTION: Notification Channels */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <ForumIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Notification Channels
              </Typography>
            </Stack>
            
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={channels.email} onChange={handleChannelChange} name="email" />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Checkbox checked={channels.sms} onChange={handleChannelChange} name="sms" />}
                label="SMS notifications"
              />
              <FormControlLabel
                control={<Checkbox checked={channels.push} onChange={handleChannelChange} name="push" />}
                label="In-App & Push notifications"
              />
            </FormGroup>
          </Stack>
        </Paper>

        {/* SECTION: What to Notify Me About */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <ChecklistIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                What to Notify Me About
              </Typography>
            </Stack>

            {/* Use a nested stack for the subsections for clear hierarchy */}
            <Stack spacing={2} sx={{ pl: { xs: 1, md: 2 } }}>
              {/* Group 1: Account & Security */}
              <Box>
                <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                  Account & Security
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={accountSecurity.passwordChange} onChange={handleAccountChange} name="passwordChange" />}
                    label="Password change alerts"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={accountSecurity.newDevice} onChange={handleAccountChange} name="newDevice" />}
                    label="New device sign-in alerts"
                  />
                </FormGroup>
              </Box>

              {/* Group 2: Marketing & Activity */}
              <Box>
                <Typography variant="body1" fontWeight="500" sx={{ mb: 1 }}>
                  Marketing & Activity
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={marketingActivity.newFeatures} onChange={handleMarketingChange} name="newFeatures" />}
                    label="New features and product updates"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={marketingActivity.promoOffers} onChange={handleMarketingChange} name="promoOffers" />}
                    label="Promotional offers"
                  />
                </FormGroup>
              </Box>
            </Stack>
          </Stack>
        </Paper>

        {/* SECTION: Mute Notifications (Do Not Disturb) */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <NotificationsOffIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Mute Notifications
              </Typography>
            </Stack>

            <FormControlLabel
              control={<Switch checked={mute} onChange={e => setMute(e.target.checked)} />}
              label="Enable Do Not Disturb"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: -1.5 }}>
              Pause all notifications during a specific time.
            </Typography>

            {/* Use Stack for responsive layout to avoid Grid type errors */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }} // Stacks vertically on mobile, row on small screens up
              spacing={2} 
              sx={{ 
                opacity: mute ? 1 : 0.5, 
                transition: 'opacity 0.3s',
                pointerEvents: mute ? 'auto' : 'none' // Disable clicks when muted
              }}
            >
              <TextField
                label="Start Time"
                type="time"
                value={dndStart}
                onChange={e => setDndStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                fullWidth // This will be respected by Stack
                disabled={!mute}
              />
              <TextField
                label="End Time"
                type="time"
                value={dndEnd}
                onChange={e => setDndEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                fullWidth 
                disabled={!mute}
              />
            </Stack>
          </Stack>
        </Paper>

      </Stack>
    </Box> 
  );
};

export default NotificationSettingsPanel;

