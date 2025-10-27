import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  // Grid, // Removed Grid
} from '@mui/material';

// Import a relevant icon
import PersonIcon from '@mui/icons-material/Person'; // Icon for user info

// Define a simple interface for the profile prop
interface Profile {
  blind_full_name?: string;
  blind_phone_number?: string;
  blind_age?: number | string;
  impairment_level?: string;
  serial_number?: string;
}

const PatientInformationPanel: React.FC<{ profile: Profile }> = ({ profile }) => {
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
          Patient Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View details for the registered patient.
        </Typography>
      </Stack>

      {/* Main stack for all settings cards */}
      <Stack spacing={4}>

        {/* SECTION: Patient Details */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <PersonIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Patient Details
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              This information is managed by your account administrator.
            </Typography>

            {/* Use Stack for the 2-column layout */}
            <Stack spacing={2}>
              {/* Row 1 */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Full Name"
                  value={profile.blind_full_name || 'Not available'}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Phone Number"
                  value={profile.blind_phone_number || 'Not available'}
                  disabled
                  fullWidth
                />
              </Stack>

              {/* Row 2 */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Age"
                  value={profile.blind_age || 'Not available'}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Impairment Level"
                  value={profile.impairment_level || 'Not available'}
                  disabled
                  fullWidth
                />
              </Stack>

              {/* Row 3: Serial Number */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Smart Stick Serial Number"
                  value={profile.serial_number || 'Not available'}
                  disabled
                  fullWidth
                />
              </Stack>
            </Stack>
          </Stack>
        </Paper>

      </Stack>
    </Box>
  );
};

export default PatientInformationPanel;

