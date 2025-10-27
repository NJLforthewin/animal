import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

interface CurrentValueCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  loading: boolean;
}

const CurrentValueCard: React.FC<CurrentValueCardProps> = ({ title, value, unit, icon, loading }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {icon}
        <Typography variant="h6" component="h2" sx={{ ml: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography variant="h2" component="p" sx={{ fontWeight: 'bold' }}>
            {value} <Typography variant="h4" component="span">{unit}</Typography>
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default CurrentValueCard;
