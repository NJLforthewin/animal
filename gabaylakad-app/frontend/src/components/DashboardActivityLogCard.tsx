import React, { useState, useEffect } from 'react';
import { Maximize2, X } from 'lucide-react';
// Simple spinner component
const Spinner: React.FC = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2,
    background: 'rgba(255,255,255,0.5)',
    backdropFilter: 'blur(2px)',
  }}>
    <div style={{
      width: 36,
      height: 36,
      border: '4px solid #8e44ad',
      borderTop: '4px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const fetchActivityLog = async () => {
  const res = await fetch('/api/dashboard/activitylog', {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
  });
  return await res.json();
};

const DashboardActivityLogCard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  // const [loading, setLoading] = useState(true); // No longer needed
  const [cardLogs, setCardLogs] = useState<any[] | null>(null); // Cache logs for main card
  const [modalOpen, setModalOpen] = useState(false); // Modal state
  const [modalLogs, setModalLogs] = useState<any[] | null>(null); // Cache logs for modal

  useEffect(() => {
    let mounted = true;
    let lastData: any = null;
    const fetchAndUpdate = () => {
  // setLoading(true); // No longer needed
      fetchActivityLog().then(res => {
        if (mounted) {
          // Accept both { logs: [...] } and { data: [...] } from backend
          let logs = Array.isArray(res?.logs) ? res.logs : Array.isArray(res?.data) ? res.data : [];
          if (logs.length > 0) {
            setData({ logs });
            setCardLogs(logs); // update cache for card
            lastData = { logs };
          } else if (lastData) {
            setData(lastData);
          }
          // setLoading(false); // No longer needed
        }
      }).catch(() => {
        if (mounted && lastData) {
          setData(lastData);
          // setLoading(false); // No longer needed
        }
      });
    };
    fetchAndUpdate();
    const interval = setInterval(fetchAndUpdate, 5000);
    return () => { mounted = false; clearInterval(interval); };
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

      {/* Header with expand icon */}
      <div style={{display: 'flex', alignItems: 'center', marginBottom: '2.2rem', width: '100%', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <i className="fas fa-clock" style={{fontSize: '1.7rem', color: '#2991d6', marginRight: 14}}></i>
          <span style={{fontWeight: 800, fontSize: '1.45rem', color: '#232946', letterSpacing: 0.2}}>Real-time Activity Log</span>
        </div>
        {/* Expand icon for modal */}
        <button
          aria-label="Expand activity log"
          onClick={() => {
            // Cache the current logs for modal display
            setModalLogs(Array.isArray(data?.logs) ? data.logs : null);
            setModalOpen(true);
          }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 8, display: 'flex', alignItems: 'center' }}
        >
          <Maximize2 size={22} />
        </button>
      </div>
      <div
        style={{
          width: '100%',
          minHeight: 90,
          maxHeight: 'min(16vh, 200px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'relative', // For spinner overlay
        }}
      >
        {/* Spinner overlay only when reloading after first load */}
        {cardLogs !== null && data === null && <Spinner />}
        {cardLogs === null ? (
          <span style={{color: '#8e44ad', fontWeight: 600}}>Loading...</span>
        ) : cardLogs.length > 0 ? (
          <div style={{width: '100%'}}>
            {cardLogs.map((log: any, idx: number) => {
              const action = log.event_type ?? log.action ?? log.activity_type ?? 'Unknown';
              const date = log.timestamp ?? log.date ?? '';
              const steps = log.payload?.steps;
              return (
                <div key={idx} style={{background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px rgba(44,62,80,0.06)', marginBottom: 14, padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', borderLeft: '4px solid #8e44ad', gap: 16, flexWrap: 'wrap'}}>
                  <span style={{fontWeight: 600, color: '#232946', fontSize: '1.08rem'}}>{action}</span>
                  {steps !== undefined && (
                    <span style={{marginLeft: 12, color: '#555', fontSize: '0.98rem'}}>Steps: {steps}</span>
                  )}
                  <span style={{marginLeft: 18, color: '#7f8c8d', fontSize: '0.98rem'}}>{date}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <span style={{color: '#b0b8c1', fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 500, letterSpacing: 0.1, textAlign: 'center'}}>No activity detected</span>
        )}
      </div>

      {/* Modal for expanded log view */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.25)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              width: '90vw',
              maxWidth: 540,
              maxHeight: '80vh',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Modal header with close icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1em 1.5em 0.5em 1.5em' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#232946', letterSpacing: 0.2 }}>Real-time Activity Log</span>
              <button
                aria-label="Close activity log modal"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 8, display: 'flex', alignItems: 'center' }}
              >
                <X size={22} />
              </button>
            </div>
            {/* Modal log list with scroll */}
            <div
              style={{
                overflowY: 'auto',
                flex: 1,
                padding: '0 1.5em 1em 1.5em',
                minHeight: 200, // Ensures modal doesn't shrink on loading
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
              }}
            >
              {modalLogs === null ? (
                <span style={{color: '#8e44ad', fontWeight: 600}}>Loading...</span>
              ) : modalLogs.length > 0 ? (
                <div style={{width: '100%'}}>
                  {modalLogs.map((log: any, idx: number) => {
                    const action = log.event_type ?? log.action ?? log.activity_type ?? 'Unknown';
                    const date = log.timestamp ?? log.date ?? '';
                    const steps = log.payload?.steps;
                    return (
                      <div key={idx} style={{background: '#fff', borderRadius: '1rem', boxShadow: '0 1px 6px rgba(44,62,80,0.06)', marginBottom: 14, padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', borderLeft: '4px solid #8e44ad', gap: 16, flexWrap: 'wrap'}}>
                        <span style={{fontWeight: 600, color: '#232946', fontSize: '1.08rem'}}>{action}</span>
                        {steps !== undefined && (
                          <span style={{marginLeft: 12, color: '#555', fontSize: '0.98rem'}}>Steps: {steps}</span>
                        )}
                        <span style={{marginLeft: 18, color: '#7f8c8d', fontSize: '0.98rem'}}>{date}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span style={{color: '#b0b8c1', fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 500, letterSpacing: 0.1, textAlign: 'center'}}>No activity detected</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardActivityLogCard;
