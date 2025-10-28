import React, { useEffect, useRef, useState, useCallback } from 'react';
import DeviceInfoModal, { DeviceInfo } from '../components/DeviceInfoModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
// import LocationHeaderResponsive from '../components/LocationHeaderResponsive'; // Removed
import Header from '../components/Header'; // Use the standard MUI Header
import { Box, Fab, Stack, Typography, Button } from '@mui/material'; // Import MUI components
import RefreshIcon from '@mui/icons-material/Refresh'; // Icon for refresh
import InfoIcon from '@mui/icons-material/Info'; // Icon for info

// Device marker icon (ensure path is correct)
const deviceIcon = new L.Icon({
  iconUrl: '/avatars/device-marker.png', // Update path if needed
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface DeviceLocation {
  device_id: number | string;
  serial_number?: string | null;
  device_name?: string | null;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const fetchAllLocations = async (): Promise<DeviceLocation[]> => {
  const token = sessionStorage.getItem('token');
  const res = await fetch('/api/dashboard/location', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  // Ensure we handle potential errors or empty responses gracefully
  if (!res.ok || !data) return [];
  return Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
};

interface DeviceLocationWithLastSeen extends DeviceLocation {
  lastSeen: number;
}

const LocationPage: React.FC = () => {
  const [devices, setDevices] = useState<DeviceLocationWithLastSeen[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<any>(null); // Keep type as any for Leaflet ref
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState<DeviceInfo | null>(null);
  // Get user from context instead of fetching locally
  // const { user, setUser } = useContext(UserContext); // Removed unused context variables

  // Fetch all locations (REST fallback)
  const loadLocations = useCallback(async () => {
    try {
      const locs = await fetchAllLocations();
  setDevices(Array.isArray(locs) ? locs.map(d => ({ ...d, lastSeen: Date.now() })) : []);
    } catch (error) {
      console.error("Failed to load locations:", error);
      // Handle error appropriately, maybe show a snackbar
    }
  }, []);

  // Socket.IO setup
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const socket = io(backendUrl, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected, falling back to polling');
      if (!pollingRef.current) {
        pollingRef.current = setInterval(loadLocations, 10000);
      }
    });

    socket.on('location_update', (data: DeviceLocation) => {
      // Basic validation: accept either device_id (preferred) or serial_number
      const id = (data as any).device_id ?? (data as any).serial_number ?? null;
      if (id && typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        setDevices((prev) => {
          const now = Date.now();
          const idx = prev.findIndex((d) => String(d.device_id) === String(id));
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], ...data, device_id: (data as any).device_id ?? updated[idx].device_id, lastSeen: now } as DeviceLocationWithLastSeen;
            return updated;
          } else {
            // Ensure device_id is present on new entry
            const entry = { ...data, device_id: (data as any).device_id ?? (data as any).serial_number, lastSeen: now } as DeviceLocationWithLastSeen;
            return [...prev, entry];
          }
        });
      } else {
        console.warn('Received invalid location update:', data);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Fallback to polling if connection fails initially
      if (!pollingRef.current) {
        pollingRef.current = setInterval(loadLocations, 10000);
      }
    });


    return () => {
      socket.disconnect();
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadLocations]);

  // Initial load via REST
  useEffect(() => {
    (async () => {
      const locs = await loadLocations();
      const now = Date.now();
      setDevices(Array.isArray(locs) ? locs.map(d => ({ ...d, lastSeen: now })) : []);
    })();
  }, [loadLocations]);

  // Manual refresh handler
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    loadLocations();
  };

  // Show device info modal for a specific device (use device_id)
  const handleInfoClick = async (deviceId: string | number) => {
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`/api/dashboard/device/${deviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch device info: ${res.statusText}`);
      const raw = await res.json();
      // Some backend endpoints return { success: true, data: [...] } or an array;
      // normalize to a single object payload so mapping below works for both shapes.
      let payload: any = raw;
      if (raw && raw.success && Array.isArray(raw.data)) {
        payload = raw.data[0] ?? null;
      } else if (Array.isArray(raw) && raw.length > 0) {
        payload = raw[0];
      }

      // Map backend response to DeviceInfo interface
      const info: DeviceInfo = {
  latitude: payload?.latitude ?? null,
  longitude: payload?.longitude ?? null,
        timestamp: payload?.location_timestamp ?? payload?.timestamp ?? null,
        battery_level: payload?.battery_level ?? null,
        signal_strength: payload?.signal_strength ?? null,
        speed: payload?.speed ?? null,
        altitude: payload?.altitude ?? null,
        accuracy: payload?.accuracy ?? null,
        isOnline: true, // TODO: Infer online status correctly if possible
        street_name: payload?.street_name ?? null,
        city_name: payload?.city_name ?? null,
        place_name: payload?.place_name ?? null,
        context_tag: payload?.context_tag ?? null,
        poi_name: payload?.poi_name ?? null,
        poi_type: payload?.poi_type ?? null,
        poi_lat: payload?.poi_lat ?? null,
        poi_lon: payload?.poi_lon ?? null,
        poi_distance_km: payload?.poi_distance_km ?? null,
        poi_distance_m: payload?.poi_distance_m ?? null
      };
      setModalInfo(info);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching device info:", err);
      setModalInfo(null); // Clear info on error
      setModalOpen(false); // Ensure modal is closed
      // TODO: Show an error message to the user (e.g., Snackbar)
    }
  };

  const handleFabInfoClick = async () => {
    if (devices.length > 0) {
      const firstDevice = devices[0];
      // Zoom and center map on the first device
      const map = mapRef.current;
      if (map && typeof firstDevice.latitude === 'number' && typeof firstDevice.longitude === 'number') {
        map.setView([firstDevice.latitude, firstDevice.longitude], 18, { animate: true });
      }
  // Show info for the first device (use device_id)
  await handleInfoClick(firstDevice.device_id);
    } else {
      // Handle case with no devices - maybe show a message?
      console.log("No devices available to show info for.");
      setModalInfo(null); // Ensure no old info is shown
      setModalOpen(true); // Open modal possibly showing "No device data"
    }
  };


  return (
    // Use Box for the main container
    <Box sx={{ height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      {/* ----- FIX: Use Standard Header with Transparent Background ----- */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 1100 }}>
        {/* Pass user from context */}
        {/* Apply transparency overrides directly to AppBar */}
        <Header sx={{ bgcolor: 'transparent', boxShadow: 'none' }} />
      </Box>
      {/* ----- END FIX ----- */}

      {/* Map Container */}
      <MapContainer
        ref={mapRef}
        style={{ height: '100%', width: '100%', zIndex: 1 }} // Keep map zIndex low
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
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {devices.filter(d => Date.now() - d.lastSeen < 60000).map((d) => (
          // Only show devices seen in the last 60 seconds
          (typeof d.latitude === 'number' && typeof d.longitude === 'number') && (
            <Marker
              key={d.device_id}
              position={[d.latitude, d.longitude]}
              icon={deviceIcon}
            >
              <Popup autoPan>
                {/* Use MUI components inside Popup */}
                <Stack spacing={0.5} sx={{ minWidth: 180 }}>
                  <Typography variant="subtitle2" fontWeight="600">
                    Serial: {d.serial_number ?? d.device_id ?? '--'}
                  </Typography>
                  <Typography variant="body2">
                    {d.device_name ?? d.serial_number ?? d.device_id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(d.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="caption">
                    Lat: {d.latitude.toFixed(5)}<br />Lng: {d.longitude.toFixed(5)}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => handleInfoClick(d.device_id)}
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                  >
                    Device Info
                  </Button>
                </Stack>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>

      {/* ----- FIX: Replaced buttons with MUI Fab ----- */}
      {/* Floating Action Buttons */}
      <Stack
        spacing={2}
        sx={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 1100, // Ensure FABs are above map but potentially below modal
        }}
      >
        <Fab color="primary" aria-label="device info" onClick={handleFabInfoClick} size="medium">
          <InfoIcon />
        </Fab>
        <Fab color="secondary" aria-label="reload" onClick={handleRefresh} size="medium">
          <RefreshIcon />
        </Fab>
      </Stack>
      {/* ----- END FIX ----- */}


      {/* Device Info Modal */}
      <DeviceInfoModal open={modalOpen} onClose={() => setModalOpen(false)} info={modalInfo} />
    </Box>
  );
};

export default LocationPage;
