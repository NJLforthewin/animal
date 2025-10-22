import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
// If TypeScript complains about missing types, install @types/leaflet

interface LocationMarkerProps {
  position: [number, number];
  popup?: React.ReactNode;
  speed?: number;
  accuracy?: number;
}

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, popup, speed, accuracy }) => (
  <Marker position={position} icon={defaultIcon as any}>
    <Popup>
      {popup}
      {speed != null && <div>Speed: {speed} m/s</div>}
      {accuracy != null && <div>Accuracy: {accuracy} m</div>}
    </Popup>
  </Marker>
);
export default LocationMarker;
