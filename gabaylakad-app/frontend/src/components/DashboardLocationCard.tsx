import { useSocketLocation } from '../hooks/useSocketLocation';
  import React, { useState, useEffect, useMemo } from 'react';
  import { DeviceInfo } from './DeviceInfoModal';
  import DashboardCardBoundary from './DashboardCardBoundary';
  import useIsMobile from './useIsMobile';
  import MobileView from './MobileView';
  import MobileLocation from './MobileLocation';
  import LoadingValue from './LoadingValue';
  import '../styles/dashboard-desktop-card.css';

const fetchLocation = async () => {
  const res = await fetch('/api/dashboard/location', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
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
      fetchLocation().then(res => {
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
  }, []);

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
      const loc = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
      lat = loc?.latitude;
      lng = loc?.longitude;
      ts = loc?.timestamp;
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
        <div className="dashboard-desktop-card desktop-card-pos">
          <div>
            <div className="card-title-row">
              <div className="card-title">LOCATION</div>
              <div className="card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
              </div>
            </div>
            <div className="field-row">
              <div className="field-label">Street</div>
              <LoadingValue loading={loading} value={displayStreet} className="field-value street primary" title={String(displayStreet)} />
            </div>
            <div className="field-row">
              <div className="field-label">Place</div>
              <LoadingValue loading={loading} value={displayPlace} className="field-value" title={String(displayPlace)} />
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );

};

export default DashboardLocationCard;
