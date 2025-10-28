import React from 'react';
import { IconButton, Menu, Box, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

export interface EmergencyAlert {
  alert_type?: string;
  status?: string;
  trigger_type?: string;
  timestamp?: string;
}

interface NotificationBellProps {
  alerts: EmergencyAlert[];
  loading: boolean;
  onBellClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: null | HTMLElement;
  open: boolean;
  onMenuClose: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  alerts,
  loading,
  onBellClick,
  anchorEl,
  open,
  onMenuClose,
}) => {
  return (
    <>
      <IconButton color="inherit" onClick={onBellClick} sx={{ position: 'relative' }}>
        <NotificationsIcon />
        {alerts.length > 0 && (
          <Box sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            bgcolor: 'error.main',
            borderRadius: '50%',
          }} />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 320,
            borderRadius: 2,
            bgcolor: 'grey.100',
            boxShadow: 3,
            p: 0,
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" fontWeight={600} color="error.main" sx={{ mb: 1 }}>
            Emergency Alerts
          </Typography>
          {loading ? (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          ) : alerts.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No emergency alerts</Typography>
          ) : (
            alerts.map((alert, idx) => (
              <Box key={idx} sx={{ mb: 1.5, p: 1.2, borderRadius: 2, bgcolor: 'error.light', boxShadow: 1 }}>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  {alert.alert_type ?? alert.status ?? 'Emergency'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {alert.trigger_type ? `Trigger: ${alert.trigger_type}` : ''}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {alert.timestamp ? new Date(alert.timestamp).toLocaleString() : ''}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Menu>
    </>
  );
};

export default NotificationBell;
