import React from 'react';
import { CircularProgress, Box } from '@mui/material'; // Import MUI components

// Remove the import for './loading.css'

const LoadingSpinner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const size = compact ? 20 : 40; // Adjust sizes as needed

  return (
    // Use Box for layout and centering
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      // Add padding or adjust size based on 'compact' if needed
      sx={compact ? { p: 1 } : { p: 2 }} 
      role="status" 
      aria-label="loading"
    >
      <CircularProgress size={size} aria-hidden="true" />
    </Box>
  );
};

export default LoadingSpinner;