import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline'; // Icon for activity
import LoadingValue from './LoadingValue'; // Assuming this component is compatible

const MobileActivity: React.FC<{ activity: string; steps: string | number; loading?: boolean }> = ({ activity, steps, loading = false }) => {
  const status = activity && String(activity).trim() ? activity : '';
  const stepsText = steps !== undefined && steps !== null && String(steps).trim() ? `${steps}` : '';

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
          ACTIVITY
        </Typography>
        <TimelineIcon color="action" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Status
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={status} component="span">
          <LoadingValue loading={loading} value={status} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Steps
        </Typography>
        <Typography variant="body2" noWrap title={stepsText ? `${stepsText} steps today` : ''} component="span">
          <LoadingValue loading={loading} value={stepsText ? `${stepsText} steps today` : ''} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileActivity;
