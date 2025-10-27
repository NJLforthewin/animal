import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileBattery from './MobileBattery';
import LoadingValue from './LoadingValue';
// import '../styles/dashboard-desktop-card.css'; // Removed
import { Paper, Stack, Typography } from '@mui/material';
import BatteryStdIcon from '@mui/icons-material/BatteryStd'; // Icon for battery

const fetchBattery = async () => {
  const res = await fetch('/api/dashboard/battery', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardBatteryCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();

  useEffect(() => {
    let mounted = true;
  let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchBattery().then(res => {
        if (mounted) {
          if (res && Object.keys(res).length > 0) {
            setData(res);
            lastData = res;
          } else if (lastData) {
            setData(lastData);
          }
          setLoading(false);
        }
      }).catch(() => {
        if (mounted && lastData) {
          setData(lastData);
          setLoading(false);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Accept both object and array response, map correct backend fields
  const batt = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const level = !loading && batt && (typeof batt.level !== 'undefined' || typeof batt.battery_level !== 'undefined') && String(batt.level ?? batt.battery_level).trim()
    ? batt.level ?? batt.battery_level
    : '';
  const updatedAt = !loading && batt && (typeof batt.updated_at !== 'undefined' || typeof batt.timestamp !== 'undefined') && String(batt.updated_at ?? batt.timestamp).trim()
    ? batt.updated_at ?? batt.timestamp
    : '';

  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileBattery batteryLevel={level} chargingStatus={updatedAt} loading={loading} />
      </MobileView>
      {isMobile ? null : (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: 180, 
        minHeight: 180, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="600" color="text.secondary">
              BATTERY
            </Typography>
            <BatteryStdIcon color="action" />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h6" fontWeight="600" noWrap title={String(level)} component="span">
              <LoadingValue loading={loading} value={level} />
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Timestamp
            </Typography>
            <Typography variant="body2" noWrap title={String(updatedAt)} component="span">
              <LoadingValue loading={loading} value={updatedAt} />
            </Typography>
          </Stack>
        </Paper>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardBatteryCard;
