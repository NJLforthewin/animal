import React from 'react';

interface AvatarCircleProps {
  src?: string;
  initials?: string;
  size?: number; // px
  ring?: boolean;
  onChange?: () => void;
  showChangeButton?: boolean;
  changeButtonText?: string;
}

const AvatarCircle: React.FC<AvatarCircleProps> = ({ src, initials, size = 100, ring = true, onChange, showChangeButton = false, changeButtonText = 'Change Avatar' }) => {
  const border = ring ? '4px solid #fff' : 'none';
  const url = src;
  const bg = '#ff867c';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {url ? (
        <img src={url} alt="Avatar" style={{ width: size, height: size, borderRadius: '50%', border, objectFit: 'cover', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }} />
      ) : (
        <div style={{ width: size, height: size, borderRadius: '50%', border, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, color: '#fff', fontWeight: 700, fontSize: Math.round(size / 2.8) }}>{initials || ''}</div>
      )}

      {showChangeButton && (
        <button type="button" onClick={onChange} style={{ marginTop: 8, background: '#232946', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 1.6rem', fontWeight: 600, fontSize: '1.02rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.10)' }}>{changeButtonText}</button>
      )}
    </div>
  );
};

export default AvatarCircle;
