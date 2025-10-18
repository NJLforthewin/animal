import React from 'react';

const securityOptions = [
  { icon: 'fas fa-key', label: 'Change Password', action: 'changePassword' },
  { icon: 'fas fa-shield-alt', label: 'Two-Factor Authentication (2FA)', action: 'setup2FA' },
  { icon: 'fas fa-history', label: 'Login Activity', action: 'loginActivity' },
  { icon: 'fas fa-bell', label: 'Security Alerts', action: 'securityAlerts' },
];

const SecuritySection: React.FC<{ onChangePassword?: () => void }> = ({ onChangePassword }) => {
  return (
    <div style={{ background: 'transparent' }}>
      {securityOptions.map(option => (
        <div
          key={option.action}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.2rem', borderBottom: '1px solid #f7f7f7', fontWeight: 600,
            color: '#232946', fontSize: '1.08rem', cursor: 'pointer',
          }}
          onClick={option.action === 'changePassword' && onChangePassword ? onChangePassword : undefined}
        >
          <span><i className={option.icon} style={{ marginRight: 12, color: '#232946' }}></i>{option.label}</span>
          <i className="fas fa-chevron-right" style={{ color: '#232946', fontSize: '1.1rem' }}></i>
        </div>
      ))}
    </div>
  );
};

export default SecuritySection;
