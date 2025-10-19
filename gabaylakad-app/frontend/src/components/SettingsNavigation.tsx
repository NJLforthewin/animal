import React from 'react';

const navItems = [
  { icon: 'fas fa-shield-alt', label: 'Security', key: 'security' },
  { icon: 'fas fa-bell', label: 'Notifications', key: 'notifications' },
  { icon: 'fas fa-mobile-alt', label: 'Device Management', key: 'deviceManagement' },
];

const SettingsNavigation: React.FC<{ onSelect: (key: string) => void }> = ({ onSelect }) => (
  <div className="bg-transparent">
    {navItems.map(item => (
      <div
        key={item.key}
        className="flex items-center justify-between px-5 py-4 border-b border-gray-100 font-semibold text-base text-gray-900 cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => onSelect(item.key)}
        role="button"
        tabIndex={0}
      >
        <span className="flex items-center gap-3">
          <i className={`${item.icon} text-lg text-primary`} aria-hidden></i>
          {item.label}
        </span>
        <i className="fas fa-chevron-right text-lg text-gray-400" aria-hidden></i>
      </div>
    ))}
  </div>
);

export default SettingsNavigation;
