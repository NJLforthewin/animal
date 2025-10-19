import React, { useState, useEffect } from 'react';
import DashboardCardBoundary from './DashboardCardBoundary';
import useIsMobile from './useIsMobile';

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
  const status = refl?.status ?? refl?.reflector_status ?? (loading ? 'Loading...' : 'ACTIVE');
  return (
    <DashboardCardBoundary>
      {isMobile ? (
        <div className="dashboard-mobile-card">
          <div className="dashboard-mobile-card-inner">
            <div style={{fontWeight:700,fontSize:'1.08rem',color:'#f1c40f',marginBottom:12,letterSpacing:0.2}}>NIGHT REFLECTOR</div>
            <div style={{background:'transparent',borderRadius:12,padding:'10px 0',display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8,minHeight:48,width:'100%'}}>
              <i className="fas fa-lightbulb" style={{fontSize:'2rem',color:'#f1c40f',marginLeft:12}}></i>
              <span style={{fontSize:'0.95rem',color:'#f1c40f',fontWeight:600,whiteSpace:'nowrap',marginRight:12}}>{status}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-card dashboard-nightreflector-card">
          <div className="dashboard-mobile-card-row">
            <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start'}}>
              <div style={{fontWeight:700,fontSize:'1.08rem',color:'#f1c40f',marginBottom:12,letterSpacing:0.2}}>NIGHT REFLECTOR</div>
              <div style={{fontWeight:800,fontSize:'1.35rem',color:'#f1c40f',marginBottom:8}}>{status}</div>
              <div style={{fontSize:'0.98rem',color:'#f1c40f',fontWeight:600,marginBottom:2,display:'flex',alignItems:'center',gap:6}}>
                <i className="fas fa-lightbulb" style={{fontSize:'1rem',color:'#f1c40f'}}></i>
                Auto-activates in low light
              </div>
            </div>
            <div style={{background:'#fffbe9',borderRadius:12,padding:10,display:'flex',alignItems:'center',justifyContent:'center',marginLeft:10}}>
              <i className="fas fa-lightbulb" style={{fontSize:'1.5rem',color:'#f1c40f'}}></i>
            </div>
          </div>
        </div>
      )}
    </DashboardCardBoundary>
  );
};

export default DashboardNightReflectorCard;
