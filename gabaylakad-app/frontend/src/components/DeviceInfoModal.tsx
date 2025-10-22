import React from 'react';

export interface DeviceInfo {
  latitude: number | null;
  longitude: number | null;
  timestamp: string | null;
  battery_level?: number | null;
  signal_strength?: number | null;
  speed?: number | null;
  altitude?: number | null;
  accuracy?: number | null;
  isOnline?: boolean;
  street_name?: string | null;
  city_name?: string | null;
  /**
   * Most specific available place info from backend: can be neighborhood, suburb, quarter, hamlet, residential, postcode, etc.
   */
  place_name?: string | null;
  context_tag?: string | null;
  /**
   * POI info from backend: name, type, coordinates, and distance in km/meters
   */
  poi_name?: string | null;
  poi_type?: string | null;
  poi_lat?: number | null;
  poi_lon?: number | null;
  poi_distance_km?: number | null;
  poi_distance_m?: number | null;
}

interface DeviceInfoModalProps {
  open: boolean;
  onClose: () => void;
  info: DeviceInfo | null;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ open, onClose, info }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 4px 24px #0002', position: 'relative', animation: 'fadeIn 0.5s' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, fontSize: 22, background: 'none', border: 'none', cursor: 'pointer' }}>&times;</button>
        <h2 style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <span style={{display:'flex',alignItems:'center',gap:10}}>
            <i className="fas fa-microchip" style={{ color: '#2a9fd6', fontSize: 22 }}></i>
            Device Info
          </span>
          <span style={{display:'flex',alignItems:'center',gap:8}}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: info?.isOnline ? '#43ce7b' : '#e74c3c',
                border: '2px solid #fff',
                boxShadow: '0 0 4px rgba(44,62,80,0.18)'
              }}
              title={info?.isOnline ? 'Online' : 'Offline'}
            ></span>
            <span style={{fontWeight:700, color: info?.isOnline ? '#43ce7b' : '#e74c3c'}}>{info?.isOnline ? 'Online' : 'Offline'}</span>
          </span>
        </h2>
        {/* Street Name */}
        <div style={{ fontSize: 18, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-road" style={{ color: '#34495e', fontSize: 20 }}></i>
          <span style={{fontWeight:700}}>{info?.street_name ?? 'Unknown Street'}</span>
        </div>
        {/* Place Name (most specific available: neighborhood, suburb, quarter, hamlet, residential, postcode, etc.) */}
        <div style={{ fontSize: 17, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-map-marker" style={{ color: '#e67e22', fontSize: 19 }}></i>
          <span style={{fontWeight:500}}>{info?.place_name ?? 'Unknown Place'}</span>
        </div>
        {/* Last Location (street and place name) */}
        <div style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-location-arrow" style={{ color: '#2a9fd6', fontSize: 18 }}></i>
          <b>Last Location:</b> {info?.street_name ?? 'Unknown Street'}{info?.place_name ? `, ${info.place_name}` : ''}
        </div>
        {/* POI Info or Distance (if available) */}
        {(info?.poi_name || typeof info?.poi_distance_m === 'number' || typeof info?.poi_distance_km === 'number') && (
          <div style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <i className="fas fa-map-pin" style={{ color: '#2ecc71', fontSize: 18 }}></i>
            {info.poi_name ? (
              <>
                <b>Most Accurate POI:</b> {info.poi_name}
                {info.poi_type && (
                  <span style={{ marginLeft: 6, color: '#888', fontStyle: 'italic' }}>
                    ({info.poi_type})
                  </span>
                )}
              </>
            ) : (
              <b>Distance to Nearest POI:</b>
            )}
            {typeof info?.poi_distance_m === 'number' && info.poi_distance_m < 1000 ? (
              <span style={{ marginLeft: 8, color: '#888' }}>
                {info.poi_distance_m} meters away
              </span>
            ) : typeof info?.poi_distance_km === 'number' ? (
              <span style={{ marginLeft: 8, color: '#888' }}>
                {info.poi_distance_km.toFixed(2)} km away
              </span>
            ) : null}
            {info?.poi_lat && info?.poi_lon && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${info.poi_lat}&mlon=${info.poi_lon}#map=19/${info.poi_lat}/${info.poi_lon}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 10, color: '#2a9fd6', textDecoration: 'underline', fontSize: 14 }}
              >
                View on Map
              </a>
            )}
          </div>
        )}
        {/* Battery Level */}
        <div style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-battery-three-quarters" style={{ color: '#f1c40f', fontSize: 18 }}></i>
          <b>Battery Level:</b> {info?.battery_level ?? 'N/A'}%
        </div>
        {/* Signal Strength */}
        <div style={{ fontSize: 16, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <i className="fas fa-signal" style={{ color: '#34495e', fontSize: 18 }}></i>
          <b>Signal Strength:</b> {info?.signal_strength ?? 'N/A'}
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoModal;
