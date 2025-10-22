import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileEmergency from './MobileEmergency';
import LoadingValue from './LoadingValue';
import '../styles/dashboard-desktop-card.css';

const fetchEmergency = async () => {
  const res = await fetch('/api/dashboard/emergency', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardEmergencyCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchEmergency().then(res => {
        if (mounted) {
          if (res && Object.keys(res).length > 0) {
            setData(res);
            lastData = res;
          } else if (lastData) {
            setData(lastData);
          }
          setLoading(false);
        }
      }).catch(() => {
        if (mounted && lastData) {
          setData(lastData);
          setLoading(false);
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const isMobile = useIsMobile();
  // Accept both object and array response, map correct backend fields
  const emer = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const status = !loading && emer && (emer.alert_type || emer.status) && String(emer.alert_type ?? emer.status).trim()
    ? emer.alert_type ?? emer.status
    : '';
  // default trigger type value as requested
  const triggerType = !loading && emer && emer.trigger_type && String(emer.trigger_type).trim()
    ? emer.trigger_type
    : '';
  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileEmergency status={status} triggerType={triggerType} loading={loading} />
      </MobileView>
      {isMobile ? null : (
        <div className="dashboard-desktop-card desktop-card-pos">
          <div>
            <div className="card-title-row">
              <div className="card-title">EMERGENCY</div>
              <div className="card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L1 21h22L12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z"/></svg>
              </div>
            </div>
            <div className="field-row">
              <div className="field-label">Status</div>
              <LoadingValue loading={loading} value={status} className="field-value" title={String(status)} />
            </div>
            <div className="field-row">
              <div className="field-label">Trigger</div>
              <LoadingValue loading={loading} value={triggerType} className="field-value" title={String(triggerType)} />
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardEmergencyCard;

// EmergencyModal removed: mobile view no longer shows an inline modal
