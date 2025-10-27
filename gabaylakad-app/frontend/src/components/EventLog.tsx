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
import NotesIcon from '@mui/icons-material/Notes';

interface EventLogProps {
  events: { event_type: string; timestamp: string }[];
  loading: boolean;
}

const EventLog: React.FC<EventLogProps> = ({ events, loading }) => {
  const renderLogItem = (event: any, idx: number) => {
    return (
      <ListItem
        key={idx}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 2,
          mb: 1.5,
          boxShadow: 1,
          borderLeft: '4px solid',
          borderColor: 'secondary.main',
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          <NotesIcon color="secondary" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight="600">
              {event.event_type}
            </Typography>
          }
          secondary={event.timestamp}
        />
      </ListItem>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Event Log
      </Typography>
      <Box sx={{ height: 'calc(100% - 48px)', overflowY: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : events && events.length > 0 ? (
          <List sx={{ p: 0 }}>
            {events.map(renderLogItem)}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center" sx={{ p: 2 }}>
            No events available for the selected range.
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default EventLog;
