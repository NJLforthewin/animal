import React from 'react';
// ...existing code...
import LoadingValue from './LoadingValue';
import '../styles/dashboard-mobile.css';

const MobileLocation: React.FC<{ locationLabel?: string | null; lastSeen?: string | null; loading?: boolean }> = ({ locationLabel, lastSeen, loading = false }) => {
     const street = locationLabel && locationLabel.trim() ? locationLabel : '';
     const place = lastSeen && lastSeen.trim() ? lastSeen : '';
  return (
    <div className="dashboard-mobile-card mobile-card-pos">
      <div className="card-title-row">
        <div className="card-title">LOCATION</div>
        <div className="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: 22, height: 22 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">Street</div>
           <LoadingValue loading={loading} value={street} className="field-value street primary" title={street} compact />
      </div>
      <div className="field-row">
        <div className="field-label">Place</div>
           <LoadingValue loading={loading} value={place} className="field-value" title={place} compact />
      </div>
    </div>
  );
};

export default MobileLocation;
