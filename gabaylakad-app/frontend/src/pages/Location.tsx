

import React, { useEffect, useRef, useState, useCallback } from 'react';
import DeviceInfoModal, { DeviceInfo } from '../components/DeviceInfoModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import { UserType } from './Profile';
import LocationHeaderResponsive from '../components/LocationHeaderResponsive';

// Device marker icon (reuse dashboard style or default Leaflet icon)
const deviceIcon = new L.Icon({
  iconUrl: '/avatars/device-marker.png', // Update path if needed
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface DeviceLocation {
  device_id: string;
  serial_number: string;
  device_name: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const fetchAllLocations = async (): Promise<DeviceLocation[]> => {
  const res = await fetch('/api/dashboard/location');
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
};



const LocationPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceLocation[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<DeviceInfo | null>(null);

  // Fetch all locations (REST fallback)
  const loadLocations = useCallback(async () => {
    const locs = await fetchAllLocations();
    setDevices(locs);
  }, []);

  // Socket.IO setup
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.on('connect', () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    });
    socket.on('disconnect', () => {
      // Fallback to polling every 10s
      if (!pollingRef.current) {
        pollingRef.current = setInterval(loadLocations, 10000);
      }
    });
    socket.on('location_update', (data: DeviceLocation) => {
      setDevices((prev) => {
        const idx = prev.findIndex((d) => d.device_id === data.device_id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], ...data };
          return updated;
        } else {
          return [...prev, data];
        }
      });
    });
    return () => {
      socket.disconnect();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadLocations]);

  // Initial load
  useEffect(() => {
    loadLocations();
  }, [loadLocations]);

  // Manual refresh
  const handleRefresh = () => loadLocations();

  // Show device info modal for a device
  const handleInfoClick = async (deviceId: string) => {
    try {
      const res = await fetch(`/api/dashboard/device/${deviceId}`);
      const raw = await res.json();
      // Map backend response to DeviceInfo interface
      const info: DeviceInfo = {
        latitude: raw.latitude ?? null,
        longitude: raw.longitude ?? null,
        timestamp: raw.location_timestamp ?? raw.timestamp ?? null,
        battery_level: raw.battery_level ?? null,
        signal_strength: raw.signal_strength ?? null,
        speed: raw.speed ?? null,
        altitude: raw.altitude ?? null,
        accuracy: raw.accuracy ?? null,
        isOnline: true, // or infer from other fields
        street_name: raw.street_name ?? null,
        city_name: raw.city_name ?? null,
        place_name: raw.place_name ?? null,
        context_tag: raw.context_tag ?? null,
        poi_name: raw.poi_name ?? null,
        poi_type: raw.poi_type ?? null,
        poi_lat: raw.poi_lat ?? null,
        poi_lon: raw.poi_lon ?? null,
        poi_distance_km: raw.poi_distance_km ?? null,
        poi_distance_m: raw.poi_distance_m ?? null
      };
      setModalInfo(info);
      setModalOpen(true);
    } catch (err) {
      setModalInfo(null);
      setModalOpen(false);
    }
  };

  const [profile, setProfile] = useState<UserType | null>(null); // Kept profile state

  // Fetch user profile for header/avatar
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
    }
    fetchProfile();
  }, []);
  // UI: Overlay header (responsive on all devices)
  // Cebu City coordinates: 10.3157, 123.8854
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* Always show overlay header, responsive for both desktop and mobile */}
      <LocationHeaderResponsive user={profile} />
      {/* Device Info button above zoom/unzoom controls (absolute position) */}
      <button
        onClick={async () => {
          if (devices.length > 0) {
            // Zoom and center map on first device
            const map = mapRef.current;
            if (map) {
              map.setView([devices[0].latitude, devices[0].longitude], 18, { animate: true });
            }
            await handleInfoClick(devices[0].device_id);
          } else {
            setModalInfo(null);
            setModalOpen(true);
          }
        }}
        title="Device Info"
        style={{
          position: 'absolute',
          right: 24,
          bottom: 170, // above zoom/unzoom and reload
          zIndex: 1200,
          background: '#fff',
          color: '#2a9fd6',
          border: '2px solid #2a9fd6',
          borderRadius: '50%',
          width: 52,
          height: 52,
          fontSize: 26,
          boxShadow: '0 2px 8px #0002',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.18s',
        }}
      >
        <i className="fas fa-info-circle" style={{fontSize:'2rem'}}></i>
      </button>
      <MapContainer
        ref={mapRef}
        style={{ height: '100vh', width: '100vw', zIndex: 1 }}
        center={[10.3157, 123.8854]} // Cebu City
        zoom={13}
        minZoom={12}
        maxZoom={17}
        maxBounds={[[10.245, 123.80], [10.39, 123.98]]} // Cebu City island bounds
        maxBoundsViscosity={1.0}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {devices.map((d) => (
          <Marker
            key={d.device_id}
            position={[d.latitude, d.longitude]}
            icon={deviceIcon}
          >
            <Popup autoPan>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 600 }}>Serial: {d.serial_number || '--'}</div>
                <div style={{ fontSize: 13 }}>{d.device_name || d.device_id}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{new Date(d.timestamp).toLocaleString()}</div>
                <div style={{ fontSize: 13 }}>Lat: {d.latitude.toFixed(5)}<br />Lng: {d.longitude.toFixed(5)}</div>
                <button
                  style={{ marginTop: 8, padding: '4px 10px', background: '#2a9fd6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}
                  title="Device Info"
                  onClick={() => handleInfoClick(d.device_id)}
                >ℹ️ Device Info</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* Reload button floating at bottom right */}
      <button
        onClick={handleRefresh}
        title="Reload locations"
        style={{
          position: 'absolute',
          right: 24,
          bottom: 24,
          zIndex: 1100,
          background: '#2a9fd6',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 52,
          height: 52,
          fontSize: 26,
          boxShadow: '0 2px 8px #0002',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background 0.18s',
        }}
      >
        🔄
      </button>

      {/* Device Info Modal */}
      <DeviceInfoModal open={modalOpen} onClose={() => setModalOpen(false)} info={modalInfo} />
    </div>
  );
};

export default LocationPage;
