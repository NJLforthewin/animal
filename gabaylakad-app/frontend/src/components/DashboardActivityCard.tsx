import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';

const fetchActivity = async () => {
  const res = await fetch('/api/dashboard/activity', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
      setLoading(true);
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
  const act = Array.isArray(data?.data) ? data.data[0] : Array.isArray(data) ? data[0] : data;
  const activity = act?.event_type ?? act?.last_activity ?? act?.activity_type ?? act?.activity ?? (loading ? 'Loading...' : 'N/A');
  const steps = act?.payload?.steps ?? 'N/A';
  return (
    <DashboardCardBoundary>
      {isMobile ? (
        <div className="dashboard-mobile-card">
          <div className="dashboard-mobile-card-inner">
            <div style={{fontWeight:700,fontSize:'1.08rem',color:'#8e44ad',marginBottom:12,letterSpacing:0.2}}>ACTIVITY STATUS</div>
            <div style={{background:'transparent',borderRadius:12,padding:'10px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,minHeight:48,width:'100%'}}>
              <i className="fas fa-walking" style={{fontSize:'2rem',color:'#8e44ad',marginLeft:12}}></i>
              <span style={{fontSize:'0.95rem',color:'#8e44ad',fontWeight:600,whiteSpace:'nowrap',marginRight:12}}>{activity}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card dashboard-activity-card">
          <div className="dashboard-mobile-card-row">
            <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
              <div style={{fontWeight:700,fontSize:'1.08rem',color:'#8e44ad',marginBottom:12,letterSpacing:0.2}}>ACTIVITY STATUS</div>
              <div style={{fontWeight:800,fontSize:'1.35rem',color:'#8e44ad',marginBottom:8}}>{activity}</div>
              <div style={{fontSize:'0.98rem',color:'#2a9fd6',fontWeight:600,marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                <i className="fas fa-walking" style={{fontSize:'1rem',color:'#2a9fd6'}}></i>
                {steps} steps today
              </div>
            </div>
            <div style={{background:'#f3eafd',borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10}}>
              <i className="fas fa-walking" style={{fontSize:'1.5rem',color:'#8e44ad'}}></i>
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardActivityCard;
