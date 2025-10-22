import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';
import MobileView from './MobileView';
import MobileBattery from './MobileBattery';
import LoadingValue from './LoadingValue';
import '../styles/dashboard-desktop-card.css';

const fetchBattery = async () => {
  const res = await fetch('/api/dashboard/battery', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardBatteryCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();

  useEffect(() => {
    let mounted = true;
  let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
      fetchBattery().then(res => {
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

  // Accept both object and array response, map correct backend fields
  const batt = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const level = !loading && batt && (typeof batt.level !== 'undefined' || typeof batt.battery_level !== 'undefined') && String(batt.level ?? batt.battery_level).trim()
    ? batt.level ?? batt.battery_level
    : '';
  const updatedAt = !loading && batt && (typeof batt.updated_at !== 'undefined' || typeof batt.timestamp !== 'undefined') && String(batt.updated_at ?? batt.timestamp).trim()
    ? batt.updated_at ?? batt.timestamp
    : '';

  return (
    <DashboardCardBoundary>
      <MobileView>
        <MobileBattery batteryLevel={level} chargingStatus={updatedAt} loading={loading} />
      </MobileView>
      {isMobile ? null : (
        <div className="dashboard-desktop-card desktop-card-pos">
          <div>
            <div className="card-title-row">
              <div className="card-title">BATTERY</div>
              <div className="card-icon" aria-hidden>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 4v2H8V4H6v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-1V4h-2zm3 16H5V8h14v12z"/></svg>
              </div>
            </div>
            <div className="field-row">
              <div className="field-label">Status</div>
              <LoadingValue loading={loading} value={level} className="field-value" title={String(level)} />
            </div>
            <div className="field-row">
              <div className="field-label">Timestamp</div>
              <LoadingValue loading={loading} value={updatedAt} className="field-value" title={String(updatedAt)} />
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardBatteryCard;


// BatteryModal removed: mobile view no longer shows an inline modal
