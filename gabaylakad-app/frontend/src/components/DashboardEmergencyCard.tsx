import React, { useState, useEffect } from 'react';
import useIsMobile from './useIsMobile';

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
    setLoading(true);
    fetchEmergency().then(res => {
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
          <div style={{fontWeight:700,fontSize:'1.08rem',color:'#c0392b',marginBottom:12,letterSpacing:0.2}}>EMERGENCY SYSTEM</div>
          <div style={{background:'transparent',borderRadius:12,padding:'10px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,minHeight:48,width:'100%'}}>
            <i className="fas fa-exclamation-triangle" style={{fontSize:'2rem',color:'#c0392b',marginLeft:12}}></i>
            <span style={{fontSize:'0.95rem',color:'#c0392b',fontWeight:600,whiteSpace:'nowrap',marginRight:12}}>{loading ? 'N/A' : (data?.status || 'READY')}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="dashboard-card dashboard-emergency-card">
      <div className="dashboard-mobile-card-row">
        <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
          <div style={{fontWeight:700,fontSize:'1.08rem',color:'#c0392b',marginBottom:12,letterSpacing:0.2}}>EMERGENCY SYSTEM</div>
          <div style={{fontWeight:800,fontSize:'1.35rem',color:'#232946',marginBottom:8}}>{loading ? 'N/A' : (data.status || 'READY')}</div>
          <div style={{fontSize:'0.98rem',color:'#43ce7b',fontWeight:600,marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
            <i className="fas fa-mobile-alt" style={{fontSize:'1rem',color:'#43ce7b'}}></i>
            SMS alerts via GSM network
          </div>
        </div>
        <div style={{background:'#fdeaea',borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10}}>
          <i className="fas fa-exclamation-triangle" style={{fontSize:'1.5rem',color:'#c0392b'}}></i>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmergencyCard;
