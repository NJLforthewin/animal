import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import LoadingValue from './LoadingValue';
import '../styles/dashboard-desktop-card.css';

const fetchActivity = async () => {
  const res = await fetch('/api/dashboard/activity', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      setError(null);
      fetchActivity().then(res => {
        if (mounted) {
          if (res && Object.keys(res).length > 0) {
            setData(res);
            lastData = res;
          } else if (lastData) {
            setData(lastData);
          }
          setLoading(false);
        }
      }).catch((err) => {
        if (mounted) {
          setError('Failed to fetch activity data. Check network/API.');
          console.error('[DashboardActivityCard] Fetch error:', err);
          if (lastData) {
            setData(lastData);
          }
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
  const act = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const activity =
    !loading && act && (act.event_type || act.last_activity || act.activity_type || act.activity)
      ? act.event_type ?? act.last_activity ?? act.activity_type ?? act.activity
      : loading
        ? ''
        : 'Missing';
  const steps =
    !loading && act && act.payload && typeof act.payload.steps !== 'undefined' && act.payload.steps !== null && String(act.payload.steps).trim()
      ? act.payload.steps
      : loading
        ? ''
        : 'Missing';
  return (
    <DashboardCardBoundary>
      {error && (
        <div style={{ color: 'red', marginBottom: 8, fontWeight: 'bold' }}>{error}</div>
      )}
      <MobileView>
        <div className="dashboard-mobile-card mobile-card-pos">
          <div className="card-title-row">
            <div className="card-title">ACTIVITY STATUS</div>
            <div className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                <path d="M13 2v8l5.5 2.5L13 15v7l9-5.5V7L13 2zM4 6v12l9 5.5V7L4 6z"/>
              </svg>
            </div>
          </div>
          <div className="field-row">
            <div className="field-label">Status</div>
            <LoadingValue loading={loading} value={activity} className="field-value" title={activity} />
          </div>
          <div className="field-row">
            <div className="field-label">Steps</div>
            <LoadingValue loading={loading} value={steps ? `${steps} steps today` : ''} className="field-value" title={steps ? `${steps} steps today` : ''} />
          </div>
        </div>
      </MobileView>
      {isMobile ? null : (
        <div className="dashboard-desktop-card desktop-card-pos">
          <div>
            <div className="card-title-row">
              <div className="card-title">ACTIVITY</div>
              <div className="card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13 2v8l5.5 2.5L13 15v7l9-5.5V7L13 2zM4 6v12l9 5.5V7L4 6z"/></svg>
              </div>
            </div>
            <div className="field-row">
              <div className="field-label">Status</div>
              <LoadingValue loading={loading} value={activity} className="field-value" title={activity} />
            </div>
            <div className="field-row">
              <div className="field-label">Steps</div>
              <LoadingValue loading={loading} value={steps ? `${steps} steps today` : ''} className="field-value" title={steps ? `${steps} steps today` : ''} />
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardActivityCard;

// ActivityModal removed: mobile view no longer shows an inline modal
