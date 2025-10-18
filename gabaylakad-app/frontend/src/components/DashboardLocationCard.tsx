import React, { useState, useEffect } from 'react';
import useIsMobile from './useIsMobile';

const fetchLocation = async () => {
  const res = await fetch('/api/dashboard/location', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardLocationCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchLocation().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const isMobile = useIsMobile();
  return isMobile ? (
    <div className="dashboard-mobile-card">
      <div className="dashboard-mobile-card-inner">
        <div style={{fontWeight:700,fontSize:'1.08rem',color:'#2a9fd6',marginBottom:12,letterSpacing:0.2}}>CURRENT LOCATION</div>
        <div style={{background:'transparent',borderRadius:12,padding:'10px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,minHeight:48,width:'100%'}}>
          <i className="fas fa-map-marker-alt" style={{fontSize:'2rem',color:'#2a9fd6',marginLeft:12}}></i>
          <span style={{fontSize:'0.95rem',color:'#232946',fontWeight:600,whiteSpace:'nowrap',marginRight:12}}>{loading ? 'N/A' : (data?.currentLocation || 'N/A')}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className="dashboard-card dashboard-location-card">
      <div className="dashboard-mobile-card-row">
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
          <div style={{fontWeight:700,fontSize:'1.08rem',color:'#2a9fd6',marginBottom:12,letterSpacing:0.2}}>CURRENT LOCATION</div>
          <div style={{fontWeight:800,fontSize:'1.35rem',color:'#232946',marginBottom:8}}>{loading ? 'N/A' : (data.currentLocation || 'N/A')}</div>
          <div style={{fontSize:'0.98rem',color:'#43ce7b',fontWeight:600,marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
            <i className="fas fa-clock" style={{fontSize:'1rem',color:'#43ce7b'}}></i>
            Updated {loading ? 'N/A' : (data.locationUpdate || 'N/A')}
          </div>
        </div>
        <div style={{background:'#eaf6fb',borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10}}>
          <i className="fas fa-map-marker-alt" style={{fontSize:'1.5rem',color:'#2a9fd6'}}></i>
        </div>
      </div>
    </div>
  );
  
};

export default DashboardLocationCard;
