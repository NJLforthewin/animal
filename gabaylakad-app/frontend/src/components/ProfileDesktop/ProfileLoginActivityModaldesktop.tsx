import React from 'react';
import BaseModal from '../BaseModal';

interface Props {
  open: boolean;
  onClose: () => void;
}


const mockLogins = [
  { device: 'iPhone 13', browser: 'Safari', timestamp: '2025-10-18 09:12' },
  { device: 'Windows PC', browser: 'Chrome', timestamp: '2025-10-17 21:44' },
  { device: 'MacBook Pro', browser: 'Edge', timestamp: '2025-10-16 15:30' },
];

const ProfileLoginActivityModaldesktop: React.FC<Props> = ({ open, onClose }) => {
  return (
    <BaseModal open={open} onClose={onClose} title="Login Activity" zIndex={11000}>
      <div style={{ minWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {mockLogins.map((item, idx) => (
          <div key={idx} style={{ background: '#f7f7f7', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.98rem', color: '#232946', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span><b>Device:</b> {item.device}</span>
            <span><b>Browser:</b> {item.browser}</span>
            <span><b>Time:</b> {item.timestamp}</span>
          </div>
        ))}
        <button
          type="button"
          onClick={onClose}
          style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer', marginTop: 8 }}
        >
          Close
        </button>
      </div>
    </BaseModal>
  );
};

export default ProfileLoginActivityModaldesktop;
