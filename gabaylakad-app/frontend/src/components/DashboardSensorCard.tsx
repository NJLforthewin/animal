import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  ListItemIcon,
} from '@mui/material';
import SensorsIcon from '@mui/icons-material/Sensors';
import { orange, purple, teal } from '@mui/material/colors';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import PhonelinkRingIcon from '@mui/icons-material/PhonelinkRing';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

const fetchSensorData = async () => {
  const res = await fetch('/api/dashboard/sensor', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardSensorCard: React.FC = () => {
  const [logs, setLogs] = useState<any[] | null>(null);

  useEffect(() => {
    let mounted = true;
    let lastData: any[] = [];
    const fetchAndUpdate = () => {
      fetchSensorData().then(res => {
        if (mounted) {
          const newLogs = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          if (newLogs.length > 0) {
            lastData = newLogs;
            setLogs(newLogs);
          } else if (lastData.length > 0) {
            setLogs(lastData);
          }
        }
      }).catch(() => {
        if (mounted && lastData.length > 0) {
          setLogs(lastData);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Render log item for new smart cane sensor events
  const renderLogItem = (log: any, idx: number) => {
    const timestamp = log.timestamp ?? '';
    let primary = '';
    let secondary = '';
    let icon = null;
    let borderColor: string = teal[700]; // Default teal
    switch (log.event_type) {
      case 'obstacle':
        primary = `Obstacle detected (${log.direction ?? '?'})`;
        secondary = `Distance: ${log.distance ?? '?'} cm`;
        icon = <SettingsInputComponentIcon sx={{ color: orange[700] }} />;
        borderColor = orange[700];
        break;
      case 'button_press':
        primary = `Button Pressed: ${log.button ?? '?'}`;
        icon = <TouchAppIcon sx={{ color: purple[700] }} />;
        borderColor = purple[700];
        break;
      case 'vibration':
        primary = `Vibration`;
        secondary = `Pattern: ${log.pattern ?? '?'} | Duration: ${log.duration_ms ?? '?'} ms`;
        icon = <PhonelinkRingIcon sx={{ color: '#757575' }} />; // gray
        borderColor = '#757575';
        break;
      case 'gsm_status':
        primary = `GSM Status`;
        secondary = `Signal: ${log.signal_strength ?? '?'} | Connected: ${log.connected ? 'Yes' : 'No'}`;
        icon = <SignalCellularAltIcon sx={{ color: '#009688' }} />;
        borderColor = '#009688';
        break;
      default:
        // Optionally skip unknown events
        return null;
    }
    return (
      <ListItem
        key={idx}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 2,
          mb: 1.5,
          boxShadow: 1,
          borderLeft: `4px solid ${borderColor}`,
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
        <ListItemText
          primary={<Typography variant="body1" fontWeight="600">{primary}</Typography>}
          secondary={secondary}
        />
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          {timestamp}
        </Typography>
      </ListItem>
    );
  };

  // Only show relevant smart cane sensor events
  const relevantEvents = ['obstacle', 'button_press', 'vibration', 'gsm_status'];
  const filteredLogs = Array.isArray(logs)
    ? logs.filter(log => relevantEvents.includes(log.event_type))
    : [];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SensorsIcon color="secondary" sx={{ fontSize: '1.7rem' }} />
          <Typography variant="h6" fontWeight="600" color="text.secondary">
            Sensor Log
          </Typography>
        </Stack>
      </Stack>
      <Box
        sx={{
          width: '100%',
          flex: 1,
          minHeight: 90,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {logs === null ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 90 }}>
            <CircularProgress />
          </Stack>
        ) : filteredLogs.length > 0 ? (
          <List sx={{ p: 0 }}>
            {filteredLogs.map(renderLogItem)}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center" sx={{ p: 2 }}>
            No sensor data available
          </Typography>
        )}
      </Box>  
    </Paper>
  );
};

export default DashboardSensorCard;