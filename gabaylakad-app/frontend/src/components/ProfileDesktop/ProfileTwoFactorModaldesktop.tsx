import React from 'react';
import BaseModal from '../BaseModal';

interface Props {
  open: boolean;
  onClose: () => void;
}


const ProfileTwoFactorModaldesktop: React.FC<Props> = ({ open, onClose }) => {
  const [enabled, setEnabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleToggle = () => {
    setLoading(true);
    setTimeout(() => {
      setEnabled(e => !e);
      setLoading(false);
    }, 800);
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Two-Factor Authentication" zIndex={11000}>
      <div style={{ minWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ fontWeight: 600, fontSize: '1.08rem', color: enabled ? '#2980b9' : '#e74c3c' }}>
          {enabled ? 'Two-Factor Authentication is ENABLED' : 'Two-Factor Authentication is DISABLED'}
        </div>
        <div style={{ fontSize: '0.98rem', color: '#232946' }}>
          {enabled
            ? 'Your account is protected with an extra layer of security. You will be asked for a code when logging in.'
            : 'Enable two-factor authentication to add an extra layer of security to your account.'}
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          style={{ background: enabled ? '#e74c3c' : '#2980b9', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', marginTop: 8 }}
        >
          {loading ? (enabled ? 'Disabling...' : 'Enabling...') : (enabled ? 'Disable 2FA' : 'Enable 2FA')}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', marginTop: 4 }}
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
};

export default ProfileTwoFactorModaldesktop;
