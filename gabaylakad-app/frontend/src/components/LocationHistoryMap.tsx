import React from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { Paper, Typography, Box } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface LocationHistoryMapProps {
  locations: { lat: number; lng: number; timestamp: string }[];
}

const LocationHistoryMap: React.FC<LocationHistoryMapProps> = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <Paper sx={{ p: 2, height: 400, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography>No location data available for the selected range.</Typography>
      </Paper>
    );
  }

  const position: [number, number] = [locations[0].lat, locations[0].lng];
  const polylinePositions: [number, number][] = locations.map(loc => [loc.lat, loc.lng]);

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3, height: '100%' }}>
      <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
        Location History
      </Typography>
      <Box sx={{ height: 'calc(100% - 48px)', borderRadius: 2, overflow: 'hidden' }}>
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline positions={polylinePositions} color="blue" />
          {locations.map((loc, index) => (
            <Marker key={index} position={[loc.lat, loc.lng]}>
              <Popup>{loc.timestamp}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Paper>
  );
};

export default LocationHistoryMap;
