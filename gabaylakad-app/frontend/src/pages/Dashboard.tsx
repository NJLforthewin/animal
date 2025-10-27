import React, { useState, useEffect, useContext } from 'react';

// import Header from '../components/Header';
import DashboardMobile from './DashboardMobile';
import DashboardLocationCard from '../components/DashboardLocationCard';
import DashboardBatteryCard from '../components/DashboardBatteryCard';
import DashboardActivityCard from '../components/DashboardActivityCard';
import DashboardEmergencyCard from '../components/DashboardEmergencyCard';
import DashboardNightReflectorCard from '../components/DashboardNightReflectorCard';
import DashboardActivityLogCard from '../components/DashboardActivityLogCard';
import DashboardSensorCard from '../components/DashboardSensorCard';
import { fetchDashboardData } from '../utils/fetchDashboardData';
import { usePolling } from '../hooks/usePolling';
import { UserContext } from './Profile';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  // Alert,
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SensorsIcon from '@mui/icons-material/Sensors';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';


interface DashboardProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}


const Dashboard: React.FC<DashboardProps> = ({ sidebarExpanded, setSidebarExpanded }) => {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isMobile) {
      document.body.style.overflow = 'clip';
      document.documentElement.style.overflow = 'clip';
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobile]);
  const [data, setData] = useState<any>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  // const [inactiveTimeoutId, setInactiveTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 10 * 60 * 1000;
  const { user: contextUser, setUser: setContextUser } = useContext(UserContext);

  const fetchData = React.useCallback(() => {
    setLoadingError(null);
    fetchDashboardData()
      .then((result: any) => {
        if (!result) {
            throw new Error("Received empty response from API");
        }
        if (result && (result.error === 'Unable to load dashboard. Please try again.' || result.error === 'Unauthorized' || result.error?.name === 'TokenExpiredError')) {
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setData(result);
          if (result.user) {
            setContextUser(result.user);
          }
        }
      })
      .catch((err: any) => {
        console.error("Dashboard fetch error:", err);
        setLoadingError('Unable to load dashboard. Please check your connection and try again.');
      });
  }, [setContextUser]);
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchData();
  }, [fetchData]);

  usePolling(fetchData, 5000);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        sessionStorage.removeItem('token');
        setData('INACTIVE_LOGOUT');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }, INACTIVITY_LIMIT);
    };

  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
  resetInactivityTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, [INACTIVITY_LIMIT]);


  const renderLoadingOrError = (message: string, isError: boolean = false) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center', p: 2 }}>
      {!isError && <CircularProgress sx={{ mb: 3 }} size={60} />}
      <Typography variant="h6" color={isError ? 'error' : 'text.primary'} fontWeight={600}>
        {message}
      </Typography>
    </Box>
  );


  // Keep last known serial number stable
  const [lastSerial, setLastSerial] = useState<string>('');
  const user = contextUser || data?.user || {};
  useEffect(() => {
    if (user?.serial_number) {
      setLastSerial(user.serial_number);
    }
  }, [user?.serial_number]);

  if (!data || data === 'INACTIVE_DEEP_LOADING') {
    return renderLoadingOrError('Loading dashboard...');
  }
  if (data === 'INACTIVE_LOGOUT' || (data?.error?.name === 'TokenExpiredError')) {
      return renderLoadingOrError('Session expired due to inactivity. Logging out...', true);
  }
   if (loadingError) {
     return renderLoadingOrError(loadingError, true);
   }
   if (data.error && typeof data.error === 'string') {
        return renderLoadingOrError(data.error, true);
   }
   if (!data.user && !contextUser) {
        return renderLoadingOrError('Loading user data...');
   }

  if (isMobile) {
    return <DashboardMobile user={user} data={data} />;
  }

  const initials = (user?.blind_full_name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const isOnline = user?.device_active;

  return (
  <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'grey.100', height: '100vh', overflow: 'clip' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 2, sm: 3 }, overflow: 'clip', maxHeight: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, md: 3 },
            overflow: 'clip',
            maxHeight: '100%',
            mb: 3,
            borderRadius: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 3,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Avatar
            sx={{
              width: { xs: 80, md: 100 },
              height: { xs: 80, md: 100 },
              fontSize: { xs: '2rem', md: '2.5rem' },
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              color: 'white',
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <Stack spacing={1} sx={{ flexGrow: 1, alignItems: { xs: 'center', md: 'flex-start' } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="h4" fontWeight={800} noWrap>
                {user?.blind_full_name || 'Name pending'}
              </Typography>
              <Chip
                icon={<VisibilityIcon fontSize="small" />}
                label={user?.impairment_level || '-'}
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.18)', color: 'white', fontWeight: 600 }}
              />
            </Stack>
            <Chip
              icon={<SensorsIcon />}
              label={`Smart Stick #${user?.serial_number || lastSerial || '--'} - Connected`}
              size="small"
              sx={{
                bgcolor: 'rgba(0,0,0, 0.3)',
                color: 'white',
                fontWeight: 600,
                mt: 1,
                maxWidth: 'fit-content'
              }}
            />
          </Stack>
          <Stack alignItems="center" spacing={0.5} sx={{ ml: { md: 3 }, mt: { xs: 2, md: 0 } }}>
             <Chip
                icon={<FiberManualRecordIcon fontSize="small" />}
                label={isOnline ? 'Online' : 'Offline'}
                color={isOnline ? 'success' : 'error'}
                sx={{
                  fontWeight: 700,
                  minWidth: 100,
                  color: 'white',
                  bgcolor: isOnline ? 'success.dark' : 'error.dark',
                }}
              />
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Last sync: {data?.locationUpdate || 'N/A'}
            </Typography>
          </Stack>
        </Paper>
        <Divider sx={{ my: 3 }} />
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Box sx={{ flex: 1 }}>
            <DashboardLocationCard serialNumber={user?.serial_number || ''} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardBatteryCard />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardActivityCard />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardEmergencyCard />
          </Box>
          <Box sx={{ flex: 1 }}>
            <DashboardNightReflectorCard />
          </Box>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ mt: 3 }}>
          <Box sx={{ flex: 1, height: 400 }}>
            <DashboardActivityLogCard />
          </Box>
          <Box sx={{ flex: 1, height: 400}}>
            <DashboardSensorCard />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

export default Dashboard;
