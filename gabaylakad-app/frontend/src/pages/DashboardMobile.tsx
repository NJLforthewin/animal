import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Stack,
  Avatar,
  Typography,
  Chip,
  Divider,
  // Grid, // Removed Grid
} from '@mui/material';

// Import MUI Icons
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// Using a specific icon for a walking stick/cane if available, or a fallback.
// 'Blind' or 'Accessibility' icons might also work. Let's use a sensor icon for the "Smart Stick".
import SensorsIcon from '@mui/icons-material/Sensors'; 

// Import all the dashboard cards
import ExportButtons from '../components/ExportButtons';
import DashboardLocationCard from '../components/DashboardLocationCard';
import DashboardBatteryCard from '../components/DashboardBatteryCard';
import DashboardActivityCard from '../components/DashboardActivityCard';
import DashboardEmergencyCard from '../components/DashboardEmergencyCard';
import DashboardNightReflectorCard from '../components/DashboardNightReflectorCard';
import DashboardActivityLogCard from '../components/DashboardActivityLogCard';
import DashboardSensorCard from '../components/DashboardSensorCard';
// import '../styles/dashboard-main.css'; // Removed
// import '../styles/dashboard-mobile.css'; // Removed

interface DashboardMobileProps {
  user: any;
  data: any;
}

const DashboardMobile: React.FC<DashboardMobileProps> = ({ user, data }) => {
  const safeUser = user || {};
  const [lastSerial, setLastSerial] = useState<string>(() => sessionStorage.getItem('lastSerial') || '');
  useEffect(() => {
    if (safeUser?.serial_number) {
      setLastSerial(safeUser.serial_number);
      sessionStorage.setItem('lastSerial', safeUser.serial_number);
    }
  }, [safeUser?.serial_number]);
  const isOnline = safeUser?.isOnline;
  const initials = (safeUser?.blind_full_name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'grey.50' }}>
      {/* Header is provided by MainLayout */}
      <main>
        {/* Profile Card Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 1.5 
          }}
        >
          {/* Avatar */}
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              fontSize: '2.5rem', 
              bgcolor: 'primary.main',
              color: 'primary.contrastText' 
            }}
          >
            {initials}
          </Avatar>
          
          {/* Online/Offline Status */}
          <Chip
            icon={<FiberManualRecordIcon />}
            label={isOnline ? 'Online' : 'Offline'}
            color={isOnline ? 'success' : 'error'}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          
          {/* Device status */}
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              fontWeight: 500 
            }}
          >
            <SensorsIcon sx={{ fontSize: '1.2rem' }} />
            Smart Stick #{safeUser?.serial_number || lastSerial || '--'} - Connected
          </Typography>
        </Paper>

        <Divider sx={{ my: 3 }} />

        {/* ----- FIX: Replaced Grid with Stack ----- */}
        {/* Cards Stack - 2 columns */}
        <Stack spacing={2}>
          {/* Row 1 */}
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ width: '50%', minWidth: 0 }}>
              <Paper elevation={2} sx={{ height: 180, minHeight: 180, maxHeight: 180, overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                {/* Removed deviceId prop, only use serialNumber */}
                  <DashboardLocationCard serialNumber={safeUser?.serial_number || lastSerial || ''} />
              </Paper>
            </Box>
            <Box sx={{ width: '50%', minWidth: 0 }}>
              <Paper elevation={2} sx={{ height: 180, minHeight: 180, maxHeight: 180, overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                <DashboardBatteryCard />
              </Paper>
            </Box>
          </Stack>
          {/* Row 2 */}
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Box sx={{ width: '50%', minWidth: 0 }}>
              <Paper elevation={2} sx={{ height: 180, minHeight: 180, maxHeight: 180, overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                <DashboardActivityCard />
              </Paper>
            </Box>
            <Box sx={{ width: '50%', minWidth: 0 }}>
              <Paper elevation={2} sx={{ height: 180, minHeight: 180, maxHeight: 180, overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
                <DashboardEmergencyCard />
              </Paper>
            </Box>
          </Stack>
          {/* Row 3 (Full width) */}
          <Box sx={{ width: '100%', minWidth: 0 }}>
            <Paper elevation={2} sx={{ height: 180, minHeight: 180, maxHeight: 180, overflow: 'hidden', borderRadius: 3, display: 'flex', flexDirection: 'column' }}>
              <DashboardNightReflectorCard />
            </Paper>
          </Box>
        </Stack>
        {/* ----- END FIX ----- */}

        {/* Export Buttons */}
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center" 
          sx={{ my: 3 }}
        >
          <ExportButtons activityLog={data?.activityLog || []} />
        </Stack>

        {/* Activity Log */}
        <Box>
          <DashboardActivityLogCard />
        </Box>
      </main>
    </Box>
  );
};

export default DashboardMobile;