import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileNightReflector from './MobileNightReflector';
import LoadingValue from './LoadingValue';
// import '../styles/dashboard-desktop-card.css'; // Removed
import { Paper, Stack, Typography } from '@mui/material';
import HighlightIcon from '@mui/icons-material/Highlight'; // Icon for reflector

const fetchNightReflector = async () => {
  const res = await fetch('/api/dashboard/nightreflector', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardNightReflectorCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchNightReflector().then(res => {
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
  const refl = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const status = !loading && refl && (refl.status || refl.reflector_status) && String(refl.status ?? refl.reflector_status).trim()
    ? refl.status ?? refl.reflector_status
    : '';
  // map raw status to human-friendly On/Off for desktop
  let statusLabel = 'Unknown';
  if (status === 'Loading...') {
    statusLabel = 'Loading...';
  } else if (status && status !== 'Missing') {
    const s = String(status).toLowerCase();
    if (s === 'on' || s === 'active') statusLabel = 'On';
    else if (s === 'off' || s === 'inactive') statusLabel = 'Off';
    else statusLabel = String(status);
  } else if (status === 'Missing') {
    statusLabel = 'Missing';
  }
  // show Light Sensor label on desktop as requested
  // (not displayed on mobile currently)
  const lastChecked = !loading && refl && refl.last_checked && String(refl.last_checked).trim()
    ? refl.last_checked
    : '';
  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileNightReflector status={status} lastChecked={lastChecked} loading={loading} />
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
              NIGHT REFLECTOR
            </Typography>
            <HighlightIcon color="action" />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Status
            </Typography>
            <Typography variant="h6" fontWeight="600" noWrap title={String(statusLabel)} component="span">
              <LoadingValue loading={loading} value={statusLabel} />
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Last Checked
            </Typography>
            <Typography variant="body2" noWrap title={String(lastChecked)} component="span">
              <LoadingValue loading={loading} value={lastChecked} />
            </Typography>
          </Stack>
        </Paper>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardNightReflectorCard;
