import React from 'react';
import BaseModal from '../BaseModal';

interface Props {
  open: boolean;
  onClose: () => void;
}


const ProfileChangePasswordModaldesktop: React.FC<Props> = ({ open, onClose }) => {
  const [current, setCurrent] = React.useState('');
  const [next, setNext] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!current || !next || !confirm) {
      setError('All fields are required.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Change Password" zIndex={11000}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 320 }}>
        <div>
          <label style={{ fontWeight: 600, fontSize: '1.08rem' }}>Current Password</label>
          <input type="password" value={current} onChange={e => setCurrent(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', marginTop: 4 }} autoFocus />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: '1.08rem' }}>New Password</label>
          <input type="password" value={next} onChange={e => setNext(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', marginTop: 4 }} />
        </div>
        <div>
          <label style={{ fontWeight: 600, fontSize: '1.08rem' }}>Confirm New Password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', marginTop: 4 }} />
        </div>
        {error && <div style={{ color: '#e74c3c', fontSize: '0.98rem' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button type="submit" disabled={loading} style={{ background: '#232946', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 700, fontSize: '1.08rem', flex: 1, cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} disabled={loading} style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 8, padding: '0.7rem 0', fontWeight: 700, fontSize: '1.08rem', flex: 1, cursor: 'pointer' }}>Cancel</button>
        </div>
      </form>
    </BaseModal>
  );
};

export default ProfileChangePasswordModaldesktop;
