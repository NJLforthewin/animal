import React from 'react';

const navItems = [
  { icon: 'fas fa-shield-alt', label: 'Security', key: 'security' },
  { icon: 'fas fa-bell', label: 'Notifications', key: 'notifications' },
  { icon: 'fas fa-mobile-alt', label: 'Device Management', key: 'deviceManagement' },
];

const SettingsNavigation: React.FC<{ onSelect: (key: string) => void }> = ({ onSelect }) => (
  <div style={{ background: 'transparent' }}>
    {navItems.map(item => (
      <div
        key={item.key}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.1rem 1.2rem', borderBottom: '1px solid #f7f7f7', fontWeight: 600,
          color: '#232946', fontSize: '1.08rem', cursor: 'pointer',
        }}
        onClick={() => onSelect(item.key)}
      >
        <span><i className={item.icon} style={{ marginRight: 12, color: '#232946' }}></i>{item.label}</span>
        <i className="fas fa-chevron-right" style={{ color: '#232946', fontSize: '1.1rem' }}></i>
      </div>
    ))}
  </div>
);

export default SettingsNavigation;
