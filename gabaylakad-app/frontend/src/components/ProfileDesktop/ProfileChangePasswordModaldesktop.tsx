import React from 'react';
// import axios, { AxiosError } from 'axios';
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
  const [success, setSuccess] = React.useState(false);
  const [currentPasswordError, setCurrentPasswordError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setCurrentPasswordError(false);
    if (!current || !next || !confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (next !== confirm) {
      setError('New passwords do not match.');
      return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Session expired. Please log in again.');
      return;
    }
    setLoading(true);
    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setCurrent('');
        setNext('');
        setConfirm('');
      } else {
        if (res.status === 401 && data.message === 'Current password is incorrect') {
          setCurrentPasswordError(true);
          setError('Current password is incorrect.');
        } else {
          setError(data.message || 'Failed to change password.');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Change Password" zIndex={11000}>
      {success ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, minWidth: 320, padding: '2rem 0' }}>
          <div style={{ color: '#28a745', fontWeight: 700, fontSize: '1.13rem', marginBottom: 8 }}>
            Password changed successfully!
          </div>
          <button type="button" onClick={onClose} style={{ background: '#232946', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 700, fontSize: '1.08rem', cursor: 'pointer' }}>Close</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 320 }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: '1.08rem' }}>Current Password</label>
            <input type="password" value={current} onChange={e => setCurrent(e.target.value)} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: currentPasswordError ? '2px solid #c0392b' : '1px solid #e0e0e0', background: currentPasswordError ? '#ffeaea' : undefined, fontSize: '1.08rem', marginTop: 4 }} autoFocus />
            {currentPasswordError && (
              <span style={{ color: '#c0392b', fontWeight: 500, fontSize: '0.97rem', marginTop: 4, display: 'block' }}>
                Incorrect current password.
              </span>
            )}
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
      )}
    </BaseModal>
  );
};

export default ProfileChangePasswordModaldesktop;
