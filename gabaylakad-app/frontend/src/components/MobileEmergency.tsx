import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; // Icon for emergency
import LoadingValue from './LoadingValue'; // Assuming this component is compatible

const MobileEmergency: React.FC<{ status: string; triggerType: string; loading?: boolean }> = ({ 
  status = 'READY',
  triggerType = 'Unknown',
  loading = false
}) => {
  const state = status && String(status).trim() ? status : '';
  const trigger = triggerType && String(triggerType).trim() ? triggerType : '';

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
          EMERGENCY
        </Typography>
        <WarningIcon color="error" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          State
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={state} component="span">
          <LoadingValue loading={loading} value={state} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Trigger
        </Typography>
        <Typography variant="body2" noWrap title={trigger} component="span">
          <LoadingValue loading={loading} value={trigger} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileEmergency;
