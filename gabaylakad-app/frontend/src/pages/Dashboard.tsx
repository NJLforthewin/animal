import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
import HeaderDesktop from '../components/headerDesktop';
// import Header from '../components/Header';
import DashboardMobile from './DashboardMobile';

import '../styles/dashboard-main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import ExportButtons from '../components/ExportButtons';
import DashboardLocationCard from '../components/DashboardLocationCard';
import DashboardBatteryCard from '../components/DashboardBatteryCard';
import DashboardActivityCard from '../components/DashboardActivityCard';
import DashboardEmergencyCard from '../components/DashboardEmergencyCard';
import DashboardNightReflectorCard from '../components/DashboardNightReflectorCard';
import DashboardActivityLogCard from '../components/DashboardActivityLogCard';
import { fetchDashboardData } from '../utils/fetchDashboardData';
import { usePolling } from '../hooks/usePolling';



interface DashboardProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}



const Dashboard: React.FC<DashboardProps> = ({ sidebarExpanded, setSidebarExpanded }) => {
  // Location modal removed
  const [data, setData] = useState<any>(null);
  const [inactiveTimeoutId, setInactiveTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes (can adjust to 15*60*1000 for 15 mins)
  const isMobile = useIsMobile();
  // const navigate = useNavigate();
  // Removed unused sidebarOpen state
  // User menu dropdown for mobile
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click (mobile only)
  useEffect(() => {
    if (!userMenuOpen || !isMobile) return;
    function handleClick(e: MouseEvent) {
      if (
        userMenuDropdownRef.current &&
        !userMenuDropdownRef.current.contains(e.target as Node) &&
        userMenuBtnRef.current &&
        !userMenuBtnRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen, isMobile]);

  const fetchData = () => {
    fetchDashboardData()
      .then((result: any) => {
        // If backend says token expired, force logout
        if (result && (result.error === 'Unable to load dashboard. Please try again.' || result.error === 'Unauthorized' || result.error?.name === 'TokenExpiredError')) {
          sessionStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setData(result);
        }
      })
      .catch((err: any) => {
        setData({ error: 'Unable to load dashboard. Please try again.' });
      });
  };

  useEffect(() => {
    // Check token validity on mount
    const token = sessionStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetchData();
  }, []);

  usePolling(fetchData, 5000);

  useEffect(() => {
    const resetInactivityTimer = () => {
      if (inactiveTimeoutId) clearTimeout(inactiveTimeoutId);
      const timeoutId = setTimeout(() => {
        // On inactivity, remove token and force logout
        sessionStorage.removeItem('token');
        setData('INACTIVE_LOGOUT');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }, INACTIVITY_LIMIT);
      setInactiveTimeoutId(timeoutId);
    };
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      if (inactiveTimeoutId) clearTimeout(inactiveTimeoutId);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Deep loading: show loading spinner for any error or unauthorized state
  if (!data || (data.message && (!data.user || data.message === 'Unauthorized')) || data.error || data === 'INACTIVE_DEEP_LOADING') {
    // If error is due to inactivity deep loading, show spinner for 4 seconds
    if (data === 'INACTIVE_DEEP_LOADING') {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh'}}>
          <div className="deep-loading-spinner" style={{marginBottom: 24}}>
            <div style={{
              width: 60,
              height: 60,
              border: '6px solid #e0e0e0',
              borderTop: '6px solid #2a9fd6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
          <div style={{fontWeight: 600, color: '#e74c3c', fontSize: 20}}>Checking session for activity...</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }
    // If error is due to inactivity logout, show message and redirect
    if (data === 'INACTIVE_LOGOUT' || (data && data.error && data.error.name === 'TokenExpiredError')) {
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh'}}>
          <div className="deep-loading-spinner" style={{marginBottom: 24}}>
            <div style={{
              width: 60,
              height: 60,
              border: '6px solid #e0e0e0',
              borderTop: '6px solid #2a9fd6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
          <div style={{fontWeight: 600, color: '#e74c3c', fontSize: 20}}>You are logout due to inactiveness, please relogin.</div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh'}}>
        <div className="deep-loading-spinner" style={{marginBottom: 24}}>
          <div style={{
            width: 60,
            height: 60,
            border: '6px solid #e0e0e0',
            borderTop: '6px solid #2a9fd6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
        </div>
        <div style={{fontWeight: 600, color: '#232946', fontSize: 20}}>Loading dashboard...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Use only actual data fields from backend
  const { user } = data;

  if (isMobile) {
    return <DashboardMobile user={user} data={data} />;
  }
  return (
    <div className="dashboard-container">
      <HeaderDesktop user={user} />
      <main className="main-content-expanded" style={{ paddingTop: 128 }}>
        {/* Desktop Profile Card Section */}
        <div className="dashboard-profile-card" style={{ display: 'flex', alignItems: 'flex-start', background: 'linear-gradient(to right, #2a9fd6, #8e44ad)', borderRadius: '2rem', boxShadow: '0 8px 32px rgba(44,62,80,0.18)', padding: '2.5rem 2.5rem 2.5rem 2rem', minHeight: '190px', position: 'relative', flexWrap: 'wrap', fontFamily: 'Segoe UI, Open Sans, Roboto, Arial, sans-serif' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(52, 152, 219, 0.85)', boxShadow: '0 0 10px rgba(95, 111, 255, 0.6), 0 20px 30px rgba(155, 89, 182, 0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '2.5rem', color: '#fff', marginRight: '2.2rem', marginBottom: '0.5rem', flexShrink: 0 }}>
            <span>{(user?.blind_full_name || '').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', color: '#fff', flex: 1, minWidth: 180, width: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: '2.2rem', letterSpacing: 0.5, color: '#fff' }}>
                  {user?.blind_full_name || <span style={{ fontStyle: 'italic', color: '#e0e0e0' }}>Name pending</span>}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.18)', borderRadius: '1rem', padding: '0.2rem 0.9rem', fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                  <i className="fas fa-eye" style={{ marginRight: 7, color: '#f1c40f' }}></i>
                  {user?.impairment_level || '-'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 600, fontSize: '1.1rem', color: '#fff' }}>
                  <i className="fas fa-birthday-cake" style={{ marginRight: 6 }}></i>
                  {user?.blind_age || <span style={{ fontStyle: 'italic', color: '#e0e0e0' }}>Age pending</span>}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
                  <i className="fas fa-phone" style={{ marginRight: 6 }}></i>
                  {user?.blind_phone_number || '-'}
                </span>
              </div>
              <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', color: '#fff' }}>
                {/* Removed email display for patient section as requested */}
              </div>
              <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '999px', padding: '0.5rem 1.5rem', fontSize: '1rem', color: '#fff', fontWeight: 600, boxShadow: '0 2px 8px rgba(44,62,80,0.10)', letterSpacing: 0.2, minWidth: 220 }}>
                <i className="fas fa-person-walking-with-cane" style={{ marginRight: 10, fontSize: '1.2em' }}></i>
                Smart Stick #{user?.device_serial_number || '--'} - Connected
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 0, minWidth: 120, marginLeft: '2.5rem', height: '100%', position: 'relative' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', background: user?.device_active ? 'linear-gradient(90deg, #43cea2 0%, #2ecc71 100%)' : 'linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)', borderRadius: '999px', padding: '0.5rem 1.2rem', fontSize: '1.1rem', color: '#fff', fontWeight: 700, boxShadow: '0 2px 8px rgba(44,62,80,0.10)', letterSpacing: 0.2, minWidth: 120, justifyContent: 'center', marginBottom: 8 }}>
                <i className={user?.device_active ? 'fas fa-circle' : 'fas fa-circle-notch'} style={{marginRight: 10, color: user?.device_active ? '#2ecc71' : '#e74c3c'}}></i>
                {user?.device_active ? 'ONLINE' : 'OFFLINE'}
              </span>
              <span style={{fontSize: '0.98rem', color: '#fff', fontWeight: 500, marginTop: 2, opacity: 0.8, textAlign: 'center'}}>
                Last sync: {data.locationUpdate || 'N/A'}
              </span>
            </div>
          </div>
        </div>
        <hr className="section-divider" />
        {/* Cards Grid */}
        <div className="dashboard-cards-grid">
          <DashboardLocationCard
            deviceId={user?.device_serial_number || ''}
          />
          <DashboardBatteryCard />
          <DashboardActivityCard />
          <DashboardEmergencyCard />
          <DashboardNightReflectorCard />
        </div>
        {/* Activity Log - moved up and aligned right */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', width: '100%', margin: '0.05rem 0 0 0.05rem',}}>
          <DashboardActivityLogCard />
        </div>
      </main>
    </div>
  );
}

export default Dashboard;