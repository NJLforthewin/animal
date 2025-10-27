import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icon for location
import LoadingValue from './LoadingValue'; // Assuming this component is compatible

const MobileLocation: React.FC<{ locationLabel?: string | null; lastSeen?: string | null; loading?: boolean }> = ({ locationLabel, lastSeen, loading = false }) => {
     const street = locationLabel && locationLabel.trim() ? locationLabel : '';
     const place = lastSeen && lastSeen.trim() ? lastSeen : '';

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 3, 
        height: 180, 
        minHeight: 180, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between' 
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="600" color="text.secondary">
          LOCATION
        </Typography>
        <LocationOnIcon color="primary" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Street
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={street} component="span">
          <LoadingValue loading={loading} value={street} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Place
        </Typography>
        <Typography variant="body2" noWrap title={place} component="span">
          <LoadingValue loading={loading} value={place} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileLocation;
