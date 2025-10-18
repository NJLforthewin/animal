import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard-main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserContext, UserType } from '../pages/Profile';

const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { key: 'profile', label: 'Account', icon: 'fas fa-user' },
  { key: 'history', label: 'History', icon: 'fas fa-history' },
  { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
  { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const Header: React.FC = () => {
  const { user } = useContext(UserContext);
  const isMobile = useIsMobile();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  return (
  <div className="dashboard-header">
      {isMobile ? (
        <div className="dashboard-header-mobile" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', boxSizing: 'border-box', gap: '1.2rem', overflowX: 'hidden' }}>
          {/* Logo on leftmost */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo192.png" alt="Logo" className="dashboard-logo" style={{ marginRight: 10 }} />
          </div>
          {/* Bell icon before user menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <i 
              className="fas fa-bell" 
              style={{fontSize: '2rem', color: '#2c3e50', cursor: 'pointer'}} 
            ></i>
            {/* User avatar/profile button */}
            <div style={{position: 'relative', display: 'inline-flex', alignItems: 'center'}}>
              <button
                ref={userMenuBtnRef}
                className="mobile-profile-avatar-btn"
                aria-label="Open user menu"
                onClick={() => setUserMenuOpen((open) => !open)}
                style={{ background: 'none', border: '2px solid #8e44ad', padding: 0, borderRadius: '50%' }}
              >
                <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" className="mobile-profile-avatar" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }} />
              </button>
              {/* Dropdown menu */}
              {userMenuOpen && (
                <div
                  ref={userMenuDropdownRef}
                  className="mobile-profile-dropdown"
                >
                  {/* User info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.8rem 1.1rem', borderBottom: '1px solid #f0f0f0', background: 'rgba(41,128,185,0.07)' }}>
                    <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', marginRight: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '1.01rem', marginBottom: 2 }}>{(user?.first_name || '') + ' ' + (user?.last_name || '')}</div>
                      <div style={{ fontSize: '0.95rem', color: '#7f8c8d' }}>{user?.email || 'user@email.com'}</div>
                    </div>
                  </div>
                  {/* Menu: Navigation links and actions */}
                  <nav role="navigation" aria-label="User menu navigation" style={{ padding: '0.4rem 0.5rem' }}>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                      {navTabs.map(tab => (
                        <li key={tab.key}>
                          <button
                            className={isMobile ? "mobile-profile-menu-link" : "desktop-profile-menu-link"}
                            aria-label={tab.label}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', background: 'rgba(41,128,185,0.08)', border: 'none', borderRadius: 10, padding: '0.8rem 1.1rem', fontSize: '1.01rem', color: '#232946', fontWeight: 600, gap: 12, cursor: 'pointer', transition: 'background 0.18s', marginBottom: 6 }}
                            onClick={() => { setUserMenuOpen(false); navigate(`/${tab.key}`); }}
                          >
                            <i className={tab.icon} aria-hidden style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', color: '#2980b9' }}></i>
                            <span>{tab.label}</span>
                          </button>
                        </li>
                      ))}
                      <li>
                        <button className={isMobile ? "mobile-profile-menu-link" : "desktop-profile-menu-link"} aria-label="Logout" style={{ width: '100%', display: 'flex', alignItems: 'center', background: 'rgba(231,76,60,0.09)', border: 'none', borderRadius: 10, padding: '0.8rem 1.1rem', fontSize: '1.01rem', color: '#e74c3c', fontWeight: 600, gap: 12, cursor: 'pointer', transition: 'background 0.18s', marginBottom: 0 }} onClick={() => { setUserMenuOpen(false); sessionStorage.clear(); navigate('/login'); }}>
                          <i className="fas fa-sign-out-alt" aria-hidden style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', color: '#e74c3c' }}></i>
                          <span>Logout</span>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
