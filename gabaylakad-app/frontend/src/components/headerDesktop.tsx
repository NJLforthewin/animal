import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderDesktopProps {
  user: any;
}

const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { key: 'profile', label: 'Account', icon: 'fas fa-user' },
  { key: 'history', label: 'History', icon: 'fas fa-history' },
  { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
  { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
];

const HeaderDesktop: React.FC<HeaderDesktopProps> = ({ user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuBtnRef = useRef<HTMLButtonElement |  null>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
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
  }, [userMenuOpen]);

  return (
    <div
      className="dashboard-header"
      style={{
        width: '100%',
        margin: 0,
        padding: '1.7rem 2.5rem 1.2rem 2.5rem',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'transparent',
        borderBottom: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 102,
        minHeight: 64,
        boxShadow: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/Logo.png"
            alt="Logo"
            style={{
              height: '100%',
              width: 'auto',
              maxWidth: '100%',
              margin: 0,
              display: 'block',
            }}
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2.8rem', paddingRight: '1.5rem' }}>
        {/* Alerts & Safety Icon with Tooltip */}
        <div style={{ position: 'relative', display: 'inline-block', marginRight: '1.2rem' }}>
          <i
            className="fas fa-bell"
            style={{ fontSize: '2rem', color: '#2c3e50', cursor: 'pointer' }}
            onMouseEnter={e => {
              const tooltip = e.currentTarget.nextSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '1';
            }}
            onMouseLeave={e => {
              const tooltip = e.currentTarget.nextSibling as HTMLElement;
              if (tooltip) tooltip.style.opacity = '0';
            }}
          ></i>
          <span
            style={{
              position: 'absolute',
              right: '110%',
              top: '50%',
              transform: 'translateY(-50%)',
              background: '#232946',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              opacity: 0,
              transition: 'opacity 0.2s',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            Alerts & Safety
          </span>
        </div>
        {/* User profile avatar and dropbar menu */}
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginRight: '0.5rem' }}>
          <button
            ref={userMenuBtnRef}
            className="desktop-profile-avatar-btn"
            aria-label="Open user menu"
            onClick={() => setUserMenuOpen((open) => !open)}
            style={{ background: 'none', border: '2px solid #8e44ad', padding: 0, borderRadius: '50%' }}
          >
            <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" className="desktop-profile-avatar" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }} />
          </button>
          {/* Dropdown menu */}
          {userMenuOpen && (
            <div
              ref={userMenuDropdownRef}
              className="desktop-profile-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                minWidth: 240,
                background: '#fff',
                border: '1px solid #f0f0f0',
                borderRadius: 12,
                boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
                zIndex: 200,
                padding: '0.5rem 0',
              }}
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
                        className="desktop-profile-menu-link"
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
                    <button className="desktop-profile-menu-link" aria-label="Logout" style={{ width: '100%', display: 'flex', alignItems: 'center', background: 'rgba(231,76,60,0.09)', border: 'none', borderRadius: 10, padding: '0.8rem 1.1rem', fontSize: '1.01rem', color: '#e74c3c', fontWeight: 600, gap: 12, cursor: 'pointer', transition: 'background 0.18s', marginBottom: 0 }} onClick={() => { setUserMenuOpen(false); sessionStorage.clear(); navigate('/login'); }}>
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
  );
};

export { HeaderDesktop };
export default HeaderDesktop;
