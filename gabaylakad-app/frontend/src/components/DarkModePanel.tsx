import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
} from '@mui/material';

// Import a relevant icon
import Brightness4Icon from '@mui/icons-material/Brightness4'; // A common icon for theme switching

const DarkModePanel: React.FC = () => {
  // Add state to control the dark mode switch
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDarkMode(event.target.checked);
    // In a real app, you would also call a function here
    // to update the global theme context.
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
          Appearance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize the look and feel of your interface.
        </Typography>
      </Stack>

      {/* Main stack for all settings cards */}
      <Stack spacing={4}>

        {/* SECTION: Dark Mode */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Brightness4Icon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Theme
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Toggle between light and dark mode.
            </Typography>

            {/* Use MUI FormControlLabel and Switch for consistency */}
            <FormControlLabel
              control={
                <Switch 
                  checked={isDarkMode} 
                  onChange={handleThemeChange} 
                />
              }
              label={isDarkMode ? "Dark Mode Enabled" : "Light Mode Enabled"}
            />
          </Stack>
        </Paper>

      </Stack>
    </Box>
  );
};

export default DarkModePanel;
