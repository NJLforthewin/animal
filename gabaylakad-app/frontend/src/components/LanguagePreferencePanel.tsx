import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent, // Import SelectChangeEvent for TypeScript
} from '@mui/material';

// Import a relevant icon
import LanguageIcon from '@mui/icons-material/Language';

const LanguagePreferencePanel: React.FC = () => {
  // Add state to control the select component
  const [language, setLanguage] = React.useState('en');

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
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
          Language & Region
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your language and regional format preferences.
        </Typography>
      </Stack>

      {/* Main stack for all settings cards */}
      <Stack spacing={4}>

        {/* SECTION: Language Preference */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
          <Stack spacing={2}>
            {/* Section Header */}
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <LanguageIcon color="action" />
              <Typography variant="h6" component="h2" fontWeight="600">
                Language Preference
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Choose the language you prefer for your account interface.
            </Typography>

            {/* Use MUI FormControl and Select for consistency */}
            <FormControl sx={{ maxWidth: 300 }}>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                id="language-select"
                value={language}
                label="Language"
                onChange={handleChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="fil">Filipino</MenuItem>
                <MenuItem value="ceb">Cebuano</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

      </Stack>
    </Box>
  );
};

export default LanguagePreferencePanel;
