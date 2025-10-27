import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  ListItemIcon,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface SensorLogProps {
  logs: any[];
  loading: boolean;
}

const SensorLog: React.FC<SensorLogProps> = ({ logs, loading }) => {
  // Render log item for new smart cane sensor events
  const renderLogItem = (log: any, idx: number) => {
    const timestamp = log.timestamp ?? '';
    let primary = '';
    let secondary = '';
    let icon = null;
    switch (log.event_type) {
      case 'obstacle':
        primary = `Obstacle detected (${log.direction ?? '?'})`;
        secondary = `Distance: ${log.distance ?? '?'} cm`;
        icon = <FavoriteIcon color="primary" />;
        break;
      case 'button_press':
        primary = `Button Pressed: ${log.button ?? '?'}`;
        icon = <FavoriteIcon color="primary" />;
        break;
      case 'vibration':
        primary = `Vibration`;
        secondary = `Pattern: ${log.pattern ?? '?'} | Duration: ${log.duration_ms ?? '?'} ms`;
        icon = <FavoriteIcon color="primary" />;
        break;
      case 'gsm_status':
        primary = `GSM Status`;
        secondary = `Signal: ${log.signal_strength ?? '?'} | Connected: ${log.connected ? 'Yes' : 'No'}`;
        icon = <FavoriteIcon color="primary" />;
        break;
      default:
        primary = log.event_type || 'Unknown Event';
        icon = <FavoriteIcon color="primary" />;
    }
    return (
      <ListItem
        key={idx}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 2,
          mb: 1.5,
          boxShadow: 1,
          borderLeft: '4px solid',
          borderColor: 'primary.main',
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
  const enableScroll = filteredLogs.length > 5;
  const logCardHeight = 72;
  const maxHeight = enableScroll ? `${logCardHeight * 5 + 10}px` : 'none';

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, width: '100%', mt: 2 }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Sensor Log
      </Typography>
      <Box
        sx={{
          width: '100%',
          minHeight: 90,
          maxHeight: maxHeight,
          overflowY: enableScroll ? 'auto' : 'visible',
          position: 'relative',
          transition: 'max-height 0.2s',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
            <CircularProgress />
          </Box>
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

export default SensorLog;
