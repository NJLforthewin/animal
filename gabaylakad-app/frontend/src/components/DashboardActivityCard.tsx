import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import LoadingValue from './LoadingValue';
// import '../styles/dashboard-desktop-card.css'; // Removed
import { Paper, Stack, Typography } from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline'; // Icon for activity

const fetchActivity = async () => {
  const res = await fetch('/api/dashboard/activity', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      setError(null);
      fetchActivity().then(res => {
        if (mounted) {
          if (res && Object.keys(res).length > 0) {
            setData(res);
            lastData = res;
          } else if (lastData) {
            setData(lastData);
          }
          setLoading(false);
        }
      }).catch((err) => {
        if (mounted) {
          setError('Failed to fetch activity data. Check network/API.');
          console.error('[DashboardActivityCard] Fetch error:', err);
          if (lastData) {
            setData(lastData);
          }
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
  const act = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const activity =
    !loading && act && (act.event_type || act.last_activity || act.activity_type || act.activity)
      ? act.event_type ?? act.last_activity ?? act.activity_type ?? act.activity
      : loading
        ? ''
        : 'Missing';
  const steps =
    !loading && act && act.payload && typeof act.payload.steps !== 'undefined' && act.payload.steps !== null && String(act.payload.steps).trim()
      ? act.payload.steps
      : loading
        ? ''
        : 'Missing';

  // Shared content layout for both mobile and desktop
  const cardContent = (
    // ----- FIX: Added React.Fragment wrapper -----
    <>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          Status
        </Typography>
        <Typography variant="h6" fontWeight="600" noWrap title={activity} component="span">
          <LoadingValue loading={loading} value={activity} />
        </Typography>
      </Stack>
      <Stack spacing={0.5} sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          Steps
        </Typography>
        <Typography variant="body2" noWrap title={steps ? `${steps} steps today` : ''} component="span">
          <LoadingValue loading={loading} value={steps ? `${steps} steps today` : ''} />
        </Typography>
      </Stack>
    </>
    // ----- END FIX -----
  );

  return (
    <DashboardCardBoundary>
      {error && (
        <Typography color="error" sx={{ mb: 1, fontWeight: 'bold' }}>{error}</Typography>
      )}
      <MobileView>
        {/* Refactored Mobile View */}
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
              ACTIVITY STATUS
            </Typography>
            <TimelineIcon color="action" />
          </Stack>
          {cardContent}
        </Paper>
      </MobileView>
      {isMobile ? null : (
        /* Refactored Desktop View */
        <Paper 
          elevation={2} 
          sx={{ 
            p: 2, 
            borderRadius: 3, 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between' 
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="600" color="text.secondary">
              ACTIVITY
            </Typography>
            <TimelineIcon color="action" />
          </Stack>
          {cardContent}
        </Paper>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardActivityCard;

