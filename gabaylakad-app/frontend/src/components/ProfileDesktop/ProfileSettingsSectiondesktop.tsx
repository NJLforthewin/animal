

import React, { useState } from 'react';
import ProfileSecurityModaldesktop from './ProfileSecurityModaldesktop';

const ProfileSettingsSectiondesktop: React.FC = () => {
  const [showSecurityModal, setShowSecurityModal] = useState(false);

  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    card: '#fff',
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Security Button */}
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
        onClick={() => setShowSecurityModal(true)}
      >
        <i className="fas fa-lock" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
        Security
      </button>
      {/* Notifications Button */}
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
        // TODO: Add onClick for notifications modal
      >
        <i className="fas fa-bell" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
        Notifications
      </button>
      {/* Device Management Button */}
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
        // TODO: Add onClick for device management modal
      >
        <i className="fas fa-microchip" style={{ fontSize: '1.18rem', color: palette.accent }}></i>
        Device Management
      </button>

    {/* Security Modal */}
    <ProfileSecurityModaldesktop open={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
    </div>
  );
};

export default ProfileSettingsSectiondesktop;
