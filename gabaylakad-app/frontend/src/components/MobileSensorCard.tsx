
import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import LoadingValue from './LoadingValue';

interface MobileSensorCardProps {
  heartRate: string | number;
  oxygenLevel: string | number;
  loading: boolean;
}

const MobileSensorCard: React.FC<MobileSensorCardProps> = ({ heartRate, oxygenLevel, loading }) => {
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
          SENSOR DATA
        </Typography>
        <SensorsIcon color="action" />
      </Stack>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Heart Rate
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={String(heartRate)} component="span">
          <LoadingValue loading={loading} value={heartRate} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Oxygen Level
        </Typography>
        <Typography variant="body2" noWrap title={oxygenLevel ? `${oxygenLevel}%` : ''} component="span">
          <LoadingValue loading={loading} value={oxygenLevel ? `${oxygenLevel}%` : ''} />
        </Typography>
      </Stack>
    </Paper>
  );
};

export default MobileSensorCard;
