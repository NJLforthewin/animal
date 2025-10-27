import React, { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { Maximize2, X } from 'lucide-react'; 


import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';

// Assuming LoadingSpinner is a custom component
import LoadingSpinner from './LoadingSpinner';

const fetchActivityLog = async () => {
  const res = await fetch('/api/dashboard/activitylog', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityLogCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [cardLogs, setCardLogs] = useState<any[] | null>(null); // Cache logs for main card
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [modalLogs, setModalLogs] = useState<any[] | null>(null); // Cache logs for modal

  // Detect mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      fetchActivityLog().then(res => {
        if (mounted) {
          let logs = Array.isArray(res?.logs) ? res.logs : Array.isArray(res?.data) ? res.data : [];
          if (logs.length > 0) {
            setData({ logs });
            setCardLogs(logs);
            lastData = { logs };
          } else if (lastData) {
            setData(lastData);
          }
        }
      }).catch(() => {
        if (mounted && lastData) {
          setData(lastData);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const renderLogItem = (log: any, idx: number) => {
    const action = log.event_type ?? log.action ?? log.activity_type ?? 'Unknown';
    const date = log.timestamp ?? log.date ?? '';
    const steps = log.payload?.steps;

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
        <ListItemIcon sx={{ minWidth: 40 }}>
          <NotesIcon color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight="600">
              {action}
              {steps !== undefined && (
                <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1.5 }}>
                  (Steps: {steps})
                </Typography>
              )}
            </Typography>
          }
          secondary={date}
        />
      </ListItem>
    );
  };

  // On mobile, always show expanded log (no modal)
  if (isMobile) {
    // Limit to 10 logs before enabling scroll
    const enableScroll = cardLogs && cardLogs.length > 5;
    // Estimate height per log card: ~72px
    const logCardHeight = 72;
    const maxHeight = enableScroll ? `${logCardHeight * 5 + 10}px` : 'none';

    return (
      <Paper 
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          width: '100%',
          mt: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
          <AccessTimeIcon color="primary" sx={{ fontSize: '1.7rem' }} />
          <Typography variant="h6" fontWeight="600" color="text.secondary">
            Real-time Activity Log
          </Typography>
        </Stack>
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
          {cardLogs === null ? (
            <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 90 }}>
              <CircularProgress />
            </Stack>
          ) : cardLogs.length > 0 ? (
            <List sx={{ p: 0 }}>
              {(cardLogs || []).map(renderLogItem)}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center" sx={{ p: 2 }}>
              No activity detected
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  // Desktop: keep modal expand
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
      {/* Header with expand icon */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AccessTimeIcon color="primary" sx={{ fontSize: '1.7rem' }} />
          <Typography variant="h6" fontWeight="600" color="text.secondary">
            Real-time Activity Log
          </Typography>
        </Stack>
        <IconButton
          aria-label="Expand activity log"
          onClick={() => {
            setModalLogs(Array.isArray(data?.logs) ? data.logs : null);
            setModalOpen(true);
          }}
        >
          <Maximize2 size={22} />
        </IconButton>
      </Stack>
      <Box
        sx={{
          width: '100%',
          flex: 1, // Make it grow
          minHeight: 90,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        {cardLogs === null ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 90 }}>
            <CircularProgress />
          </Stack>
        ) : cardLogs.length > 0 ? (
          <List sx={{ p: 0 }}>
            {cardLogs.map(renderLogItem)}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center" sx={{ p: 2 }}>
            No activity detected
          </Typography>
        )}
      </Box>

      {/* Modal for expanded log view */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="600" color="text.secondary">
            Real-time Activity Log
          </Typography>
          <IconButton aria-label="Close activity log modal" onClick={() => setModalOpen(false)}>
            <X size={22} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ minHeight: '50vh', maxHeight: '70vh', overflowY: 'auto' }}>
            {modalLogs === null ? (
              <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
                <CircularProgress />
              </Stack>
            ) : modalLogs.length > 0 ? (
              <List sx={{ p: 0 }}>
                {modalLogs.map(renderLogItem)}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic" textAlign="center" sx={{ p: 2 }}>
                No activity detected
              </Typography>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default DashboardActivityLogCard;
