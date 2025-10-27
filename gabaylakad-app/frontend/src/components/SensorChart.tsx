// @ts-nocheck
import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SensorChartProps {
  title: string;
  data: any[];
  dataKey: string;
  unit: string;
  color: string;
  loading: boolean;
}

const SensorChart: React.FC<SensorChartProps> = ({ title, data, dataKey, unit, color, loading }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={dataKey} name={title} stroke={color} unit={unit} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};

export default SensorChart;