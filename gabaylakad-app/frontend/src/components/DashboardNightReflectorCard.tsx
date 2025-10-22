import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileNightReflector from './MobileNightReflector';
import LoadingValue from './LoadingValue';
import '../styles/dashboard-desktop-card.css';

const fetchNightReflector = async () => {
  const res = await fetch('/api/dashboard/nightreflector', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardNightReflectorCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchNightReflector().then(res => {
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
  const refl = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const status = !loading && refl && (refl.status || refl.reflector_status) && String(refl.status ?? refl.reflector_status).trim()
    ? refl.status ?? refl.reflector_status
    : '';
  // map raw status to human-friendly On/Off for desktop
  let statusLabel = 'Unknown';
  if (status === 'Loading...') {
    statusLabel = 'Loading...';
  } else if (status && status !== 'Missing') {
    const s = String(status).toLowerCase();
    if (s === 'on' || s === 'active') statusLabel = 'On';
    else if (s === 'off' || s === 'inactive') statusLabel = 'Off';
    else statusLabel = String(status);
  } else if (status === 'Missing') {
    statusLabel = 'Missing';
  }
  // show Light Sensor label on desktop as requested
  // (not displayed on mobile currently)
  const lastChecked = !loading && refl && refl.last_checked && String(refl.last_checked).trim()
    ? refl.last_checked
    : '';
  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileNightReflector status={status} lastChecked={lastChecked} loading={loading} />
      </MobileView>
      {isMobile ? null : (
        <div className="dashboard-desktop-card desktop-card-pos">
          <div>
            <div className="card-title-row">
              <div className="card-title">NIGHT REFLECTOR</div>
              <div className="card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>
              </div>
            </div>
            <div className="field-row">
              <div className="field-label">Status</div>
              <LoadingValue loading={loading} value={statusLabel} className="field-value" title={String(statusLabel)} />
            </div>
            <div className="field-row">
              <div className="field-label">Last Checked</div>
              <LoadingValue loading={loading} value={lastChecked} className="field-value" title={String(lastChecked)} />
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardNightReflectorCard;

// NightModal removed: mobile view no longer shows an inline modal
