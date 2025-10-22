import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard-main.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
// import { UserType } from '../pages/Profile';

const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { key: 'profile', label: 'Account', icon: 'fas fa-user' },
  { key: 'history', label: 'History', icon: 'fas fa-history' },
  { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
  { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
];




interface LocationHeaderMobileProps {
  user: any;
}

const LocationHeaderMobile: React.FC<LocationHeaderMobileProps> = ({ user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  return (
  <div className="location-header-mobile-wrapper" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', zIndex: 1101, background: 'transparent' }}>
  <div className="location-header-mobile overflow-x-hidden">
        {/* Small logo on left */}
  <img src="/logo192.png" alt="Logo" style={{ width: 65, height: 65}} />
        {/* Bell icon and avatar on right */}
  <div className="flex items-center gap-3">
  <i className="fas fa-bell text-primary cursor-pointer" style={{ width: 23.99,  height: 19, fontSize: 19, display: 'inline-block', textAlign: 'center' }} />
          <div className="relative inline-flex items-center">
            <button
              ref={userMenuBtnRef}
              className="mobile-profile-avatar-btn focus:ring-2 focus:ring-primary"
              aria-label="Open user menu"
              onClick={() => setUserMenuOpen((open) => !open)}
              style={{ padding: 0, background: 'none', border: 'none' }}
            >
              <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" className="mobile-profile-avatar w-10 h-10 rounded-full object-cover shadow-md border-2 border-white" />
            </button>
            {/* Dropdown menu */}
            {userMenuOpen && (
              <div
                ref={userMenuDropdownRef}
                className="mobile-profile-dropdown fixed top-16 right-8 min-w-[220px] max-w-[90vw] w-[85vw] bg-white rounded-xl shadow-lg z-50 p-2 text-gray-900 border border-gray-200 animate-fade-in"
                role="menu"
                aria-label="User menu"
              >
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" className="w-9 h-9 rounded-full object-cover mr-2" />
                  <div className="flex-1">
                    <div className="font-semibold text-base mb-0.5">{(user?.first_name || '') + ' ' + (user?.last_name || '')}</div>
                    <div className="text-sm text-gray-500">{user?.email || 'user@email.com'}</div>
                  </div>
                </div>
                {/* Divider */}
                <div className="border-b border-gray-100 my-2" />
                {/* Menu: Navigation links and actions */}
                <nav role="navigation" aria-label="User menu navigation">
                  <ul className="list-none m-0 p-0">
                    {navTabs.map(tab => (
                      <li key={tab.key}>
                        <button
                          className="w-full flex items-center bg-gray-50 hover:bg-primary/10 focus:bg-primary/20 border-none rounded-lg px-4 py-3 text-base font-medium text-gray-900 gap-3 transition-colors mb-1 focus:outline-none"
                          aria-label={tab.label}
                          onClick={() => { setUserMenuOpen(false); navigate(`/${tab.key}`); }}
                        >
                          <i className={`${tab.icon} text-lg w-6 text-primary`} aria-hidden></i>
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        className="w-full flex items-center bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-lg px-4 py-3 text-base font-medium gap-3 transition-colors focus:outline-none"
                        aria-label="Logout"
                        onClick={() => { setUserMenuOpen(false); sessionStorage.clear(); navigate('/login'); }}
                      >
                        <i className="fas fa-sign-out-alt text-lg w-6 text-red-600" aria-hidden></i>
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
    </div>
  );
};

export default LocationHeaderMobile;
