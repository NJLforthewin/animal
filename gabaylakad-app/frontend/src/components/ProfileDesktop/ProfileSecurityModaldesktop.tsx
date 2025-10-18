
import React, { useState } from 'react';
import BaseModal from '../BaseModal';
import ProfileChangePasswordModaldesktop from './ProfileChangePasswordModaldesktop';
import ProfileTwoFactorModaldesktop from './ProfileTwoFactorModaldesktop';
import ProfileLoginActivityModaldesktop from './ProfileLoginActivityModaldesktop';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ProfileSecurityModaldesktop: React.FC<Props> = ({ open, onClose }) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);

  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    card: '#fff',
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };

  return (
    <>
      {/* Main Security Modal */}
      <BaseModal open={open && !showChangePassword && !showTwoFactor && !showLoginActivity} onClose={onClose} title="Security" zIndex={10000}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 320 }}>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: palette.secondary,
              color: palette.primary,
              border: 'none',
              borderRadius: 8,
              padding: '1rem 1.2rem',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.18s',
            }}
            onClick={() => setShowChangePassword(true)}
          >
            <i className="fas fa-key" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
            Change Password
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: palette.secondary,
              color: palette.primary,
              border: 'none',
              borderRadius: 8,
              padding: '1rem 1.2rem',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.18s',
            }}
            onClick={() => setShowTwoFactor(true)}
          >
            <i className="fas fa-shield-alt" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
            Two-Factor Authentication
          </button>
          <button
            type="button"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: palette.secondary,
              color: palette.primary,
              border: 'none',
              borderRadius: 8,
              padding: '1rem 1.2rem',
              fontWeight: 600,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
              transition: 'background 0.18s',
            }}
            onClick={() => setShowLoginActivity(true)}
          >
            <i className="fas fa-history" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
            Login Activity
          </button>
        </div>
      </BaseModal>

      {/* Change Password Modal */}
      <ProfileChangePasswordModaldesktop open={showChangePassword} onClose={() => setShowChangePassword(false)} />
      {/* Two-Factor Modal */}
      <ProfileTwoFactorModaldesktop open={showTwoFactor} onClose={() => setShowTwoFactor(false)} />
      {/* Login Activity Modal */}
      <ProfileLoginActivityModaldesktop open={showLoginActivity} onClose={() => setShowLoginActivity(false)} />
    </>
  );
};

export default ProfileSecurityModaldesktop;
