import React, { useState, useEffect } from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import DateRangePicker from '../components/DateRangePicker';
import LocationHistoryMap from '../components/LocationHistoryMap';
import SensorChart from '../components/SensorChart';
import EventLog from '../components/EventLog';


// Fetch history data for authenticated user's device
const fetchHistoryData = async (token: string) => {
  const res = await fetch('/api/dashboard/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { locations: [], sensorData: [], events: [] };
  return await res.json();
};

const HistoryPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [startDate, setStartDate] = useState('2025-10-26');
  const [endDate, setEndDate] = useState('2025-10-26');
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  // const { user } = useContext(UserContext); // Not used

  // Fetch history data for authenticated user's device
  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetchHistoryData(token).then(data => {
      setLocations(data.locations || []);
      setSensorData(data.sensorData || []);
      setEvents(data.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [startDate, endDate]);

  if (isMobile) {
    return (
      <Box sx={{ p: 2 }}>
        <Stack spacing={3}>
          <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
          <SensorChart title="Heart Rate History" data={sensorData} dataKey="heart_rate" unit="bpm" color="#8884d8" loading={loading} />
          <SensorChart title="Oxygen Level History" data={sensorData} dataKey="oxygen_level" unit="%" color="#82ca9d" loading={loading} />
          <EventLog events={events} loading={loading} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
      <Stack direction="row" spacing={3} sx={{ mt: 3, flex: 1, overflow: 'hidden' }}>
        <Stack direction="column" spacing={3} sx={{ flex: 3, height: '100%' }}>
          <Box sx={{ flex: 2 }}>
            <LocationHistoryMap locations={locations} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <EventLog events={events} loading={loading} />
          </Box>
        </Stack>
        <Stack direction="column" spacing={3} sx={{ flex: 1 }}>
          <SensorChart title="Heart Rate History" data={sensorData} dataKey="heart_rate" unit="bpm" color="#8884d8" loading={loading} />
          <SensorChart title="Oxygen Level History" data={sensorData} dataKey="oxygen_level" unit="%" color="#82ca9d" loading={loading} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default HistoryPage;
