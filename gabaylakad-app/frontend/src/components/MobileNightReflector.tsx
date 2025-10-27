import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import HighlightIcon from '@mui/icons-material/Highlight'; // Icon for reflector
import LoadingValue from './LoadingValue'; // Assuming this component is compatible

const MobileNightReflector: React.FC<{ status?: string; lastChecked?: string; loading?: boolean }> = ({ status, lastChecked, loading = false }) => {
  const statusText = status && String(status).trim() ? status : '';
  const checkedText = lastChecked && String(lastChecked).trim() ? lastChecked : '';

  // map raw status to human-friendly On/Off
  let statusLabel = 'Unknown';
  if (statusText && statusText !== 'Missing') {
    const s = String(statusText).toLowerCase();
    if (s === 'on' || s === 'active') statusLabel = 'On';
    else if (s === 'off' || s === 'inactive') statusLabel = 'Off';
    else statusLabel = String(statusText);
  } else if (statusText === 'Missing') {
    statusLabel = 'Missing';
  }

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
          REFLECTOR
        </Typography>
        <HighlightIcon color="action" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Status
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={statusLabel} component="span">
          <LoadingValue loading={loading} value={statusLabel} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Last Checked
        </Typography>
        <Typography variant="body2" noWrap title={checkedText} component="span">
          <LoadingValue loading={loading} value={checkedText} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileNightReflector;
