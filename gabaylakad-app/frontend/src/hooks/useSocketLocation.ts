import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface LocationUpdate {
  device_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  battery_level?: number | null;
  signal_strength?: number | null;
  speed?: number | null;
  altitude?: number | null;
  accuracy?: number | null;
  street_name?: string | null;
  city_name?: string | null;
  place_name?: string | null;
  context_tag?: string | null;
  poi_name?: string | null;
  poi_type?: string | null;
  poi_lat?: number | null;
  poi_lon?: number | null;
  poi_distance_km?: number | null;
  poi_distance_m?: number | null;
}

export function useSocketLocation(deviceId: string) {
  const [location, setLocation] = useState<LocationUpdate | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    const socket: Socket = io(backendUrl, { transports: ['websocket'] });
    socket.on('connect', () => {
      setConnected(true);
    });
    socket.on('disconnect', (reason) => {
      setConnected(false);
    });
    socket.on('connect_error', (err) => {
    });
    socket.on('error', (err) => {
    });
    socket.on('location_update', (data: LocationUpdate) => {
      if (data.device_id === deviceId) {
        setLocation(data);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [deviceId]);

  return { location, connected };
}
