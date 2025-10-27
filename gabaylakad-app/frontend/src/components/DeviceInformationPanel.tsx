import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
} from '@mui/material';

// Import a relevant icon
import PhonelinkIcon from '@mui/icons-material/Phonelink'; // Icon for devices

// Define a simple interface for the profile prop
interface Profile {
  serial_number?: string;
}

const DeviceInformationPanel: React.FC<{ profile: Profile }> = ({ profile }) => {
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
          Device Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View information about your connected devices.
        </Typography>
      </Stack>

      {/* Main stack for all settings cards */}
      <Stack spacing={4}>

        {/* SECTION: Device Details */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <PhonelinkIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Connected Device
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              This is the unique identifier for the device associated with your account.
            </Typography>

            {/* Use a disabled TextField to show read-only info */}
            <TextField
              label="Device Serial Number"
              value={profile.serial_number || 'Not available'}
              disabled
              fullWidth
            />
          </Stack>
        </Paper>

      </Stack>
    </Box>
  );
};

export default DeviceInformationPanel;
