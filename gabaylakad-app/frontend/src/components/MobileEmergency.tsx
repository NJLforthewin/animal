import React from 'react';
// ...existing code...
import LoadingValue from './LoadingValue';
import '../styles/dashboard-mobile.css';

const MobileEmergency: React.FC<{ status: string; triggerType: string; loading?: boolean }> = ({ 
  status = 'READY',
  triggerType = 'Unknown',
  loading = false
}) => {
  const state = status && String(status).trim() ? status : '';
  const trigger = triggerType && String(triggerType).trim() ? triggerType : '';
  return (
    <div className="dashboard-mobile-card mobile-card-pos">
      <div className="card-title-row">
        <div className="card-title">EMERGENCY</div>
        <div className="card-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path d="M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/>
          </svg>
        </div>
      </div>
      <div className="field-row">
        <div className="field-label">State</div>
        <LoadingValue loading={loading} value={state} className="field-value" title={state} compact />
      </div>
      <div className="field-row">
        <div className="field-label">Trigger</div>
        <LoadingValue loading={loading} value={trigger} className="field-value" title={trigger} compact />
      </div>
    </div>
  );
};

export default MobileEmergency;
