
import React, { useState } from 'react';

interface AvatarPickerProps {
  defaultAvatars: string[];
  avatarPreview: string | null;
  setAvatarPreview: (url: string) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onConfirm: () => void;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  defaultAvatars,
  avatarPreview,
  setAvatarPreview,
  setShowAvatarPicker,
  onConfirm
}) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 24px rgba(44,62,80,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 12 }}>Choose Your Avatar</div>
        {/* Preview Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontSize: '0.95rem', color: '#232946', marginBottom: 6 }}>Preview</div>
          <img
            src={avatarPreview || defaultAvatars[0]}
            alt="Avatar Preview"
            style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #2980b9', objectFit: 'cover', marginBottom: 8 }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {defaultAvatars.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Avatar ${idx+1}`}
              style={{ width: 64, height: 64, borderRadius: '50%', border: avatarPreview === url ? '3px solid #2980b9' : '2px solid #e0e0e0', cursor: 'pointer', objectFit: 'cover', transition: 'border 0.2s' }}
              onClick={() => setAvatarPreview(url)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <button
            style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            onClick={onConfirm}
          >Confirm</button>
          <button
            style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            onClick={() => setShowAvatarPicker(false)}
          >Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPicker;
