import React, { useState, useEffect, useMemo } from 'react';
import { Stack, Box, Typography, Paper, CircularProgress, Icon } from '@mui/material';
import SensorLog from '../components/SensorLog'; // Assuming this component handles the list view
import { Warning, PhoneInTalk, AccessibilityNew, SettingsRemote } from '@mui/icons-material';

// --- Interface for Log Data (Highly Recommended for type safety) ---
interface SensorLogEntry {
  event_type: 'obstacle' | 'button_press' | 'vibration' | 'gsm_status' | 'battery' | 'location';
  timestamp: string;
  data: {
    // Structure for obstacle events
    distance?: number; 
    severity?: 'low' | 'high';
    // Structure for GSM events
    signal_strength?: number; // RSSI or a scale 0-31
    connected?: boolean;
    // Structure for button_press events
    action?: 'press' | 'release';
    // Structure for vibration events
    pattern?: number;
    duration?: number;
    // Structure for general status like battery
    value?: number; 
  };
}

// --- Helper Component for Status Cards ---
interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  color: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, color }) => (
  // Use a flex value to make the cards take up equal space in the horizontal Stack
  <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', minHeight: '80px', flex: 1 }}>
    <Icon sx={{ color: color, fontSize: 40, mr: 2 }}>{icon}</Icon>
    <Box>
      <Typography variant="caption" color="text.secondary">{title}</Typography>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Box>
  </Paper>
);

// --- Sensor Fetch Function (unchanged) ---
const fetchSensorData = async (): Promise<{ data: SensorLogEntry[] }> => {
  // NOTE: Assuming the API returns an object with a 'data' array of SensorLogEntry
  const res = await fetch('/api/dashboard/sensor', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

// --- Main Component ---
const Sensor: React.FC = () => {
  const [data, setData] = useState<SensorLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Logic (unchanged) ---
  useEffect(() => {
    let mounted = true;
    const fetchAndUpdate = () => {
      fetchSensorData().then(res => {
        if (mounted) {
          const newLogs = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          if (newLogs.length > 0) {
            // Reverse the array so the latest log is at index 0 for easy lookup
            setData(newLogs.reverse()); 
          }
          setLoading(false);
        }
      }).catch(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Only show relevant smart cane sensor events
  const filteredLogs = useMemo(() => {
    const relevantEvents = ['obstacle', 'button_press', 'vibration', 'gsm_status', 'battery', 'location'];
    return Array.isArray(data)
      ? data.filter(log => relevantEvents.includes(log.event_type))
      : [];
  }, [data]);

  // --- LOGIC TO DETERMINE CARD STATUS ---
  // Finds the latest log entry for a specific event type
  const getStatus = (eventType: SensorLogEntry['event_type']) => 
    filteredLogs.find(log => log.event_type === eventType);

  const obstacleLog = getStatus('obstacle');
  const gsmLog = getStatus('gsm_status');
  const buttonLog = getStatus('button_press');
  const vibrationLog = getStatus('vibration');

  const obstacleStatus = obstacleLog 
  ? `${obstacleLog.data?.distance !== undefined ? obstacleLog.data?.distance + ' cm' : 'No Data'} (${obstacleLog.data?.severity || 'Normal'})`
  : 'No Data';

  const gsmStatus = gsmLog 
  ? gsmLog.data?.connected ? `Connected (Sig: ${gsmLog.data?.signal_strength}/31)` : 'Disconnected'
  : 'Checking...';

  const buttonStatus = buttonLog 
  ? `Last Action: ${buttonLog.data?.action === 'press' ? 'PRESSED' : 'RELEASED'}`
  : 'Idle';

  const vibrationStatus = vibrationLog
  ? `Patt ${vibrationLog.data?.pattern} (${vibrationLog.data?.duration} ms)`
  : 'Idle';
    
  // --- END LOGIC ---

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>Sensor Data</Typography>
      
      {loading && data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
          </Box>
      ) : (
          <Stack direction="column" spacing={3} sx={{ flex: 1 }}>
            
            {/* 1. REAL-TIME STATUS CARDS (Using horizontal Stack) */}
            <Typography variant="h6" component="h2" sx={{ mb: 1, fontWeight: 'medium' }}>Real-time Status</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap>
        <StatusCard 
          title="Obstacle Distance" 
          value={obstacleStatus} 
          icon={<Warning />} 
          color={obstacleLog && typeof obstacleLog.data?.distance === 'number' && obstacleLog.data?.distance < 20 ? 'error.main' : 'success.main'}
        />
                <StatusCard 
                    title="GSM Connectivity" 
                    value={gsmStatus} 
                    icon={<PhoneInTalk />} 
                    color={gsmLog?.data?.connected ? 'success.main' : 'warning.main'}
                />
                <StatusCard 
                    title="Emergency Button" 
                    value={buttonStatus} 
                    icon={<AccessibilityNew />} 
                    color={buttonLog?.data?.action === 'press' ? 'error.main' : 'text.secondary'}
                />
                <StatusCard 
                    title="Vibration Feedback" 
                    value={vibrationStatus} 
                    icon={<SettingsRemote />} 
                    color={vibrationLog ? 'info.main' : 'text.secondary'}
                />
            </Stack>

            {/* 2. SENSOR LOG */}
            <Typography variant="h6" component="h2" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>Sensor Log</Typography>
            <Box sx={{ flex: 1, minHeight: 0 }}>
                {/* Ensure your SensorLog component is updated to handle the new data structure */}
                <SensorLog logs={filteredLogs} loading={loading} />
            </Box>

          </Stack>
      )}
    </Box>
  );
};

export default Sensor;