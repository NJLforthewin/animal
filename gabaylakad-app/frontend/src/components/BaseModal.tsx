import React from 'react';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  zIndex?: number;
}

const BaseModal: React.FC<BaseModalProps> = ({ open, onClose, children, title, zIndex }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(44,62,80,0.18)', backdropFilter: 'blur(2px)', zIndex: zIndex ?? 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="modal-content" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.15)', padding: 24, minWidth: 300, maxWidth: 340, width: '90%', position: 'relative' }} onClick={e => e.stopPropagation()}>
        {title && <div style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 12 }}>{title}</div>}
        {children}
        <button aria-label="Close" onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#232946', cursor: 'pointer' }}>&times;</button>
      </div>
    </div>
  );
};

export default BaseModal;
