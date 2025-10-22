import React from 'react';
// ...existing code...
import LoadingValue from './LoadingValue';
import '../styles/dashboard-mobile.css';

const MobileNightReflector: React.FC<{ status?: string; lastChecked?: string; loading?: boolean }> = ({ status, lastChecked, loading = false }) => {
  const statusText = status && String(status).trim() ? status : '';
  const checkedText = lastChecked && String(lastChecked).trim() ? lastChecked : '';
  return (
    <div className="dashboard-mobile-card mobile-card-pos">
      <div className="card-title-row">
        <div className="card-title">REFLECTOR</div>
        <div className="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M12 3C8.13 3 5 6.13 5 10c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm-.5 10h-1v-4h1v4zm0 4h-1v-2h1v2z"/>
          </svg>
        </div>
      </div>
  <div className="field-row">
    <div className="field-label">Status</div>
  <LoadingValue loading={loading} value={statusText} className="field-value" title={statusText} />
  </div>
  <div className="field-row">
    <div className="field-label">Last Checked</div>
  <LoadingValue loading={loading} value={checkedText} className="field-value" title={checkedText} />
  </div>
    </div>
  );
};

export default MobileNightReflector;
