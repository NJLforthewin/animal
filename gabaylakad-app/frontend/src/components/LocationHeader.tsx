import React, { useState, useRef, useEffect } from 'react';

interface LocationHeaderProps {
  user: any;
}

const navTabs = [
  { key: 'dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { key: 'profile', label: 'Account', icon: 'fas fa-user' },
  { key: 'history', label: 'History', icon: 'fas fa-history' },
  { key: 'location', label: 'Location Tracking', icon: 'fas fa-map-marker-alt' },
  { key: 'sensor', label: 'Sensor Data', icon: 'fas fa-microchip' },
];

const LocationHeader: React.FC<LocationHeaderProps> = ({ user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuBtnRef = useRef<HTMLButtonElement |  null>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null);

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
  <div className="dashboard-header w-full fixed top-0 left-0 z-50 min-h-[64px] flex items-center justify-between px-10 py-6" style={{background: 'transparent', boxShadow: 'none'}}>
      <div className="flex items-center">
        <div className="w-20 h-20 flex items-center justify-center">
          <img src="/Logo.png" alt="Logo" className="h-full w-auto max-w-full m-0 block" />
        </div>
      </div>
      <div className="flex items-center gap-7 pr-6">
        {/* Alerts & Safety Icon with Tooltip */}
        <div className="relative inline-block mr-3">
          <i className="fas fa-bell text-2xl text-primary cursor-pointer" />
        </div>
        {/* User profile avatar and dropbar menu */}
        <div className="relative inline-flex items-center mr-2">
          <button
            ref={userMenuBtnRef}
            className="desktop-profile-avatar-btn focus:ring-2 focus:ring-primary"
            aria-label="Open user menu"
            onClick={() => setUserMenuOpen((open) => !open)}
          >
            <img src={user?.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent((user?.first_name || '') + ' ' + (user?.last_name || ''))}&background=8e44ad&color=fff`} alt="Avatar" className="desktop-profile-avatar w-10 h-10 rounded-full object-cover shadow-md border-2 border-white" />
          </button>
          {/* Dropdown menu */}
          {userMenuOpen && (
            <div
              ref={userMenuDropdownRef}
              className="desktop-profile-dropdown absolute right-0 top-full min-w-[360px] bg-white rounded-xl shadow-lg z-50 px-6 py-4 text-gray-900 border border-gray-200 animate-fade-in"
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
                        onClick={() => {
                          setUserMenuOpen(false);
                          if (tab.key === 'profile') {
                            if (window && window.dispatchEvent) {
                              window.dispatchEvent(new CustomEvent('openProfileDesktopModal'));
                            }
                          } else {
                            window.location.href = `/${tab.key}`;
                          }
                        }}
                      >
                        <i className={`${tab.icon} text-lg w-6 text-primary`} aria-hidden></i>
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      className="w-full flex items-center bg-red-50 text-red-600 hover:bg-red-100 border-none rounded-lg px-4 py-3 text-base font-medium gap-3 transition-colors focus:outline-none"
                      aria-label="Logout"
                      onClick={() => { setUserMenuOpen(false); sessionStorage.clear(); window.location.href = '/login'; }}
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
  );
};

export default LocationHeader;
