
import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { ChangePasswordForm } from './PreferencesSection';

interface LoginActivity {
  device: string;
  browser: string;
  timestamp: string;
}

interface SecurityModalProps {
  open: boolean;
  onClose: () => void;
}

const SecurityModal: React.FC<SecurityModalProps> = ({ open, onClose }) => {
  // Submodal states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  // Login activity (mock data)
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([
    { device: 'iPhone 13', browser: 'Safari', timestamp: '2025-10-18 09:12' },
    { device: 'Windows PC', browser: 'Chrome', timestamp: '2025-10-17 21:44' },
    { device: 'MacBook Pro', browser: 'Edge', timestamp: '2025-10-16 15:30' },
  ]);
  const [loggingOut, setLoggingOut] = useState(false);

  // Modal navigation items
  const modalNav = [
    {
      label: 'Change Password',
      icon: 'fas fa-key',
      onClick: () => setShowChangePassword(true),
    },
    {
      label: 'Two-Factor Authentication (2FA)',
      icon: 'fas fa-shield-alt',
      onClick: () => setShow2FA(true),
    },
    {
      label: 'Login Activity',
      icon: 'fas fa-history',
      onClick: () => setShowLoginActivity(true),
    },
  ];

  return (
    <>
      {/* Main Security Modal */}
      <BaseModal open={open && !showChangePassword && !show2FA && !showLoginActivity} onClose={onClose} title="Security">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {modalNav.map((item, idx) => (
            <button key={item.label} type="button" onClick={item.onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', background: 'rgba(41,128,185,0.08)', border: 'none', borderRadius: 10, padding: '0.8rem 1.1rem', fontSize: '1.01rem', color: '#232946', fontWeight: 600, gap: 12, cursor: 'pointer', transition: 'background 0.18s' }}>
              <i className={item.icon} aria-hidden style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', color: '#2980b9' }}></i>
              <span>{item.label}</span>
              <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', color: '#232946', fontSize: '1.08rem' }}></i>
            </button>
          ))}
        </div>
      </BaseModal>

      {/* Change Password Submodal */}
      <BaseModal open={showChangePassword} onClose={() => setShowChangePassword(false)} title="Change Password">
        <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
      </BaseModal>

      {/* 2FA Submodal */}
      <BaseModal open={show2FA} onClose={() => setShow2FA(false)} title="Two-Factor Authentication (2FA)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, fontSize: '1rem', marginBottom: 8 }}>
            <input type="checkbox" checked={twoFAEnabled} onChange={e => setTwoFAEnabled(e.target.checked)} style={{ accentColor: '#2980b9', width: 22, height: 22 }} />
            Enable 2FA
          </label>
          {twoFAEnabled ? (
            <div style={{ fontSize: '0.98rem', color: '#232946', background: '#f7f7f7', borderRadius: 8, padding: '0.7rem 1rem', marginTop: 6 }}>
              2FA enabled via Authenticator App.
            </div>
          ) : (
            <div style={{ fontSize: '0.98rem', color: '#7f8c8d', background: '#f7f7f7', borderRadius: 8, padding: '0.7rem 1rem', marginTop: 6 }}>
              2FA is currently turned off.
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" style={{ background: '#232946', color: '#fff', border: 'none', borderRadius: 10, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => setShow2FA(false)}>Save Changes</button>
            <button type="button" style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 10, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => setShow2FA(false)}>Cancel</button>
          </div>
        </div>
      </BaseModal>

      {/* Login Activity Submodal */}
      <BaseModal open={showLoginActivity} onClose={() => setShowLoginActivity(false)} title="Login Activity">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loginActivity.map((item, idx) => (
            <div key={idx} style={{ background: '#f7f7f7', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.98rem', color: '#232946', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span><b>Device:</b> {item.device}</span>
              <span><b>Browser:</b> {item.browser}</span>
              <span><b>Time:</b> {item.timestamp}</span>
            </div>
          ))}
        </div>
        <button type="button" style={{ marginTop: 14, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.1rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', width: '100%' }} disabled={loggingOut} onClick={() => { setLoggingOut(true); setTimeout(() => { setLoginActivity([]); setLoggingOut(false); }, 1200); }}>
          {loggingOut ? 'Logging out...' : 'Log out of all devices'}
        </button>
      </BaseModal>
    </>
  );
};

export default SecurityModal;
