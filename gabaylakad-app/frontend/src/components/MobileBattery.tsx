import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import BatteryStdIcon from '@mui/icons-material/BatteryStd'; // Icon for battery
import LoadingValue from './LoadingValue'; // Assuming this component is compatible

const MobileBattery: React.FC<{ batteryLevel?: string | number; chargingStatus?: string; loading?: boolean }> = ({ batteryLevel, chargingStatus, loading = false }) => {
  const level = batteryLevel !== undefined && String(batteryLevel).trim() ? batteryLevel : '';
  const status = chargingStatus && chargingStatus.trim() ? chargingStatus : '';

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
          BATTERY
        </Typography>
        <BatteryStdIcon color="action" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Status
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={String(level)} component="span">
          <LoadingValue loading={loading} value={level} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Timestamp
        </Typography>
        <Typography variant="body2" noWrap title={String(status)} component="span">
          <LoadingValue loading={loading} value={status} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileBattery;
