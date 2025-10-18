import React, { useState, useEffect } from 'react';

const fetchActivityLog = async () => {
  const res = await fetch('/api/dashboard/activitylog', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityLogCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchActivityLog().then(res => {
      if (mounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{
  background: '#ffffffff',
  borderRadius: '22px',
  boxShadow: '0 8px 32px rgba(44,62,80,0.10), 0 0 10px rgba(95, 111, 255, 0.6), 0 20px 30px rgba(155, 89, 182, 0.4)',
  padding: '2.5rem',
  margin: '2.5rem 0 2rem 0',
  minHeight: 260,
  maxWidth: 540,
  width: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  fontFamily: 'Segoe UI, Open Sans, Roboto, Arial, sans-serif',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}}>

      {/* Header */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '2.2rem', width: '100%'}}>
        <i className="fas fa-clock" style={{fontSize: '1.7rem', color: '#2991d6', marginRight: 14}}></i>
        <span style={{fontWeight: 800, fontSize: '1.45rem', color: '#232946', letterSpacing: 0.2}}>Real-time Activity Log</span>
      </div>
      {/* Content Area */}
      <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 120}}>
        {loading ? (
          <span style={{color: '#8e44ad', fontWeight: 600}}>Loading...</span>
        ) : Array.isArray(data?.logs) && data.logs.length > 0 ? (
          <div style={{width: '100%'}}>
            {data.logs.map((log: any, idx: number) => (
              <div key={idx} style={{background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px rgba(44,62,80,0.06)', marginBottom: 14, padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', borderLeft: '4px solid #8e44ad', gap: 16}}>
                <span style={{fontWeight: 600, color: '#232946', fontSize: '1.08rem'}}>{log.action}</span>
                <span style={{marginLeft: 18, color: '#7f8c8d', fontSize: '0.98rem'}}>{log.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <span style={{color: '#b0b8c1', fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 500, letterSpacing: 0.1, textAlign: 'center'}}>No activity detected</span>
        )}
      </div>
    </div>
  );
};

export default DashboardActivityLogCard;
