import { useSocketLocation } from '../hooks/useSocketLocation';
  import React, { useState, useEffect, useMemo } from 'react';
  import { DeviceInfo } from './DeviceInfoModal';
  import DashboardCardBoundary from './DashboardCardBoundary';
  import useIsMobile from './useIsMobile';
  import MobileView from './MobileView';
  import MobileLocation from './MobileLocation';
  import LoadingValue from './LoadingValue';
  // import '../styles/dashboard-desktop-card.css'; // Removed
  import { Paper, Stack, Typography } from '@mui/material';
  import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icon for location


const fetchLocation = async (deviceId: string) => {
  const token = sessionStorage.getItem('token');
  const res = await fetch(`/api/dashboard/device/${deviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch device location');
  return await res.json();
};

interface DashboardLocationCardProps {
  deviceId: string;
}


const DashboardLocationCard: React.FC<DashboardLocationCardProps> = ({ deviceId }) => {
  const { location: socketLocation } = useSocketLocation(deviceId);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchLocation(deviceId).then(res => {
        // DEBUG: Log backend response
        console.log('[DashboardLocationCard] fetchLocation response:', res);
        if (mounted) {
          setLoading(false);
          if (res && Object.keys(res).length > 0) {
            setData(res);
            lastData = res;
          } else if (lastData) {
            setData(lastData);
          }
        }
      }).catch(() => {
        setLoading(false);
        if (mounted && lastData) {
          setData(lastData);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, [deviceId]);

  const isMobile = useIsMobile();
  // Accept both object and array response, map correct backend fields
  const info: DeviceInfo | null = useMemo(() => {
    let lat, lng, ts;
    if (socketLocation) {
      lat = socketLocation.latitude;
      lng = socketLocation.longitude;
      ts = socketLocation.timestamp;
      return {
        latitude: lat,
        longitude: lng,
        timestamp: ts,
        battery_level: socketLocation.battery_level ?? null,
        signal_strength: socketLocation.signal_strength ?? null,
        speed: socketLocation.speed ?? null,
        altitude: socketLocation.altitude ?? null,
        accuracy: socketLocation.accuracy ?? null,
        street_name: socketLocation.street_name ?? null,
        city_name: socketLocation.city_name ?? null,
        place_name: socketLocation.place_name ?? null,
        context_tag: socketLocation.context_tag ?? null,
        poi_name: socketLocation.poi_name ?? null,
        poi_type: socketLocation.poi_type ?? null,
        poi_lat: socketLocation.poi_lat ?? null,
        poi_lon: socketLocation.poi_lon ?? null,
        poi_distance_km: socketLocation.poi_distance_km ?? null,
        poi_distance_m: socketLocation.poi_distance_m ?? null
      };
    } else {
      // For /api/dashboard/device/:id, the response is a flat object
      const loc = data;
      lat = loc?.latitude;
      lng = loc?.longitude;
      ts = loc?.timestamp || loc?.location_timestamp;
      return lat !== undefined ? {
        latitude: lat,
        longitude: lng,
        timestamp: ts,
        battery_level: loc?.battery_level ?? null,
        signal_strength: loc?.signal_strength ?? null,
        speed: loc?.speed ?? null,
        altitude: loc?.altitude ?? null,
        accuracy: loc?.accuracy ?? null,
        street_name: loc?.street_name ?? null,
        city_name: loc?.city_name ?? null,
        place_name: loc?.place_name ?? null,
        context_tag: loc?.context_tag ?? null,
        poi_name: loc?.poi_name ?? null,
        poi_type: loc?.poi_type ?? null,
        poi_lat: loc?.poi_lat ?? null,
        poi_lon: loc?.poi_lon ?? null,
        poi_distance_km: loc?.poi_distance_km ?? null,
        poi_distance_m: loc?.poi_distance_m ?? null
      } : null;
    }
  }, [socketLocation, data]);

  // Modal removed: no-op handler
  // const handleViewClick = () => {};
  const displayStreet = !loading && info && info.street_name && String(info.street_name).trim()
    ? info.street_name
    : '';
  const displayPlace = !loading && info && info.place_name && String(info.place_name).trim()
    ? info.place_name
    : '';

  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileLocation locationLabel={displayStreet} lastSeen={displayPlace} loading={loading} />
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
              LOCATION
            </Typography>
            <LocationOnIcon color="primary" />
          </Stack>
          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              Street
            </Typography>
              <Typography variant="h6" fontWeight="600" noWrap title={String(displayStreet)} component="span">
                <LoadingValue loading={loading} value={displayStreet} />
              </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Place
            </Typography>
              <Typography variant="body2" noWrap title={String(displayPlace)} component="span">
                <LoadingValue loading={loading} value={displayPlace} />
              </Typography>
          </Stack>
        </Paper>
      )}
    </DashboardCardBoundary>
  );

};

export default DashboardLocationCard;
