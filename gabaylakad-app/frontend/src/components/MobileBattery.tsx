import React from 'react';
// ...existing code...
import '../styles/dashboard-mobile.css';
import LoadingValue from './LoadingValue';

const MobileBattery: React.FC<{ batteryLevel?: string | number; chargingStatus?: string; loading?: boolean }> = ({ batteryLevel, chargingStatus, loading = false }) => {
  const level = batteryLevel !== undefined && String(batteryLevel).trim() ? batteryLevel : '';
  const status = chargingStatus && chargingStatus.trim() ? chargingStatus : '';
  return (
    <div className="dashboard-mobile-card mobile-card-pos">
      <div className="card-title-row">
        <div className="card-title">BATTERY</div>
        <div className="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M15.67 4H14V2H10v2H8.33C7.6 4 7 4.6 7 5.33V20.67C7 21.4 7.6 22 8.33 22h7.34c.73 0 1.33-.6 1.33-1.33V5.33C17 4.6 16.4 4 15.67 4zM16 17H8V7h8v10z"/>
          </svg>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">Status</div>
        <LoadingValue loading={loading} value={level} className="field-value" title={String(level)} compact />
      </div>
      <div className="field-row">
        <div className="field-label">Timestamp</div>
        <LoadingValue loading={loading} value={status} className="field-value" title={String(status)} compact />
      </div>
    </div>
  );
};

export default MobileBattery;
