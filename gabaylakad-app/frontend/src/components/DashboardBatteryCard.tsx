import React, { useState, useEffect } from 'react';
import useIsMobile from './useIsMobile';

const fetchBattery = async () => {
  const res = await fetch('/api/dashboard/battery', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardBatteryCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchBattery().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const isMobile = useIsMobile();
  if (isMobile) {
    return (
      <div className="dashboard-mobile-card">
        <div className="dashboard-mobile-card-inner">
          <div style={{fontWeight:700,fontSize:'1.08rem',color:'#e67e22',marginBottom:12,letterSpacing:0.2}}>BATTERY LEVEL</div>
          <div style={{background:'transparent',borderRadius:12,padding:'10px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,minHeight:48,width:'100%'}}>
            <i className="fas fa-battery-three-quarters" style={{fontSize:'2rem',color:'#e67e22',marginLeft:12}}></i>
            <span style={{fontSize:'0.95rem',color:'#e67e22',fontWeight:600,whiteSpace:'nowrap',marginRight:12}}>{loading ? 'N/A' : (data?.batteryLevel || 'N/A')}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-card dashboard-battery-card">
      <div className="dashboard-mobile-card-row">
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
          <div style={{fontWeight:700,fontSize:'1.08rem',color:'#e67e22',marginBottom:12,letterSpacing:0.2}}>BATTERY LEVEL</div>
          <div style={{fontWeight:800,fontSize:'1.35rem',color:'#e67e22',marginBottom:8}}>{loading ? 'N/A' : (data.batteryLevel || 'N/A')}</div>
          <div style={{fontSize:'0.98rem',color:'#e67e22',fontWeight:600,marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
            <i className="fas fa-battery-three-quarters" style={{fontSize:'1rem',color:'#e67e22'}}></i>
            {loading ? 'N/A' : (data.batteryTime || 'N/A')}
          </div>
        </div>
        <div style={{background:'#fff6e9',borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10}}>
          <i className="fas fa-battery-three-quarters" style={{fontSize:'1.5rem',color:'#e67e22'}}></i>
        </div>
      </div>
    </div>
  );
};

export default DashboardBatteryCard;
