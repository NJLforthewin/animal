import React from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import LocationMarker from './LocationMarker';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp?: string;
  street_name?: string | null;
  city_name?: string | null;
  place_name?: string | null;
  context_tag?: string | null;
  [key: string]: any;
}

interface MapModalProps {
  deviceId: string;
  current?: LocationPoint;
  history: LocationPoint[];
  loading?: boolean;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({ deviceId, current, history, loading, onClose }) => {
  const center = current ? [current.latitude, current.longitude] : history.length > 0 ? [history[0].latitude, history[0].longitude] : [0, 0];
  return (
    <div className="modal-overlay modal-fullscreen">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>Close</button>
        <div style={{ position: 'relative', width: '100%', height: '80vh', minHeight: '80vh', maxHeight: '80vh' }}>
          {loading && (
            <div className="map-blur-overlay">
              <div className="spinner" />
            </div>
          )}
          <MapContainer
            center={center as [number, number]}
            zoom={15}
            minZoom={12}
            maxZoom={17}
            maxBounds={[[10.245, 123.80], [10.39, 123.98]]} // Cebu City island bounds
            maxBoundsViscosity={1.0}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {history.length > 0 && (
              <Polyline positions={history.map(p => [p.latitude, p.longitude])} color="blue" />
            )}
            {current && (
              <LocationMarker
                position={[current.latitude, current.longitude]}
                popup={
                  <div style={{animation:'fadeIn 0.5s'}}>
                    <div style={{fontWeight:700,fontSize:'1.08rem',color:'#34495e',marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                      <i className="fas fa-road" style={{fontSize:'1.1rem',color:'#34495e'}}></i> {current.street_name || 'Unknown Street'}
                    </div>
                    <div style={{fontWeight:500,fontSize:'1.02rem',color:'#2a9fd6',marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                      <i className="fas fa-info-circle" style={{fontSize:'1rem',color:'#2a9fd6'}}></i> {current.context_tag || 'Unknown Context'}
                    </div>
                    <div style={{fontSize:'0.85rem',color:'#43ce7b',marginBottom:2}}>
                      <i className="fas fa-clock" style={{fontSize:'1rem',color:'#43ce7b'}}></i> Updated: {current.timestamp ? new Date(current.timestamp).toLocaleString() : 'N/A'}
                    </div>
                    <button style={{background:'none',border:'none',color:'#2a9fd6',cursor:'pointer',fontSize:'0.95rem',marginTop:4}} title="Show Details" onClick={onClose}><i className="fas fa-info-circle"></i> Details</button>
                  </div>
                }
              />
            )}
            {history.map((p, i) => (
              <LocationMarker
                key={i}
                position={[p.latitude, p.longitude]}
                popup={
                  <div style={{animation:'fadeIn 0.5s'}}>
                    <div style={{fontWeight:700,fontSize:'1.08rem',color:'#34495e',marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                      <i className="fas fa-road" style={{fontSize:'1.1rem',color:'#34495e'}}></i> {p.street_name || 'Unknown Street'}
                    </div>
                    <div style={{fontWeight:500,fontSize:'1.02rem',color:'#2a9fd6',marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                      <i className="fas fa-info-circle" style={{fontSize:'1rem',color:'#2a9fd6'}}></i> {p.context_tag || 'Unknown Context'}
                    </div>
                    <div style={{fontSize:'0.85rem',color:'#43ce7b',marginBottom:2}}>
                      <i className="fas fa-clock" style={{fontSize:'1rem',color:'#43ce7b'}}></i> Updated: {p.timestamp ? new Date(p.timestamp).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                }
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
export default MapModal;
