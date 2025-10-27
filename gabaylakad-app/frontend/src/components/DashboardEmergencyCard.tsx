import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileEmergency from './MobileEmergency';
import LoadingValue from './LoadingValue';
// import '../styles/dashboard-desktop-card.css'; // Removed
import { Paper, Stack, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning'; // Icon for emergency

const fetchEmergency = async () => {
  const res = await fetch('/api/dashboard/emergency', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardEmergencyCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchEmergency().then(res => {
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

  const isMobile = useIsMobile();
  // Accept both object and array response, map correct backend fields
  const emer = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const status = !loading && emer && (emer.alert_type || emer.status) && String(emer.alert_type ?? emer.status).trim()
    ? emer.alert_type ?? emer.status
    : '';
  // default trigger type value as requested
  const triggerType = !loading && emer && emer.trigger_type && String(emer.trigger_type).trim()
    ? emer.trigger_type
    : '';
  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileEmergency status={status} triggerType={triggerType} loading={loading} />
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
              EMERGENCY
            </Typography>
            <WarningIcon color="error" />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h6" fontWeight="600" noWrap title={String(status)} component="span">
              <LoadingValue loading={loading} value={status} />
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Trigger
            </Typography>
            <Typography variant="body2" noWrap title={String(triggerType)} component="span">
              <LoadingValue loading={loading} value={triggerType} />
            </Typography>
          </Stack>
        </Paper>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardEmergencyCard;
