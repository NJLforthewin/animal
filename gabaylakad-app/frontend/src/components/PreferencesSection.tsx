import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import SecuritySection from './SecuritySection';
import SettingsNavigation from './SettingsNavigation';

// ✅ Move ChangePasswordForm ABOVE PreferencesSection
export const ChangePasswordForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  setMessage('');
  setCurrentPasswordError(false);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match.');
      return;
    }
    const token = sessionStorage.getItem('token');
    if (!token) {
      setMessage('Session expired. Please log in again.');
      return;
    }
    // Debug log: print token and request body
    console.log('[ChangePasswordForm] Token:', token);
    console.log('[ChangePasswordForm] Request body:', { currentPassword, newPassword });
    setLoading(true);
    try {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Password changed successfully!');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (res.status === 401 && data.message === 'Current password is incorrect') {
          setCurrentPasswordError(true);
          setMessage('Current password is incorrect.');
        } else {
          setMessage(data.message || 'Failed to change password.');
        }
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6, display: 'block' }}>
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 8,
            borderRadius: 6,
            border: currentPasswordError ? '2px solid #c0392b' : '1px solid #e0e6ed',
            background: currentPasswordError ? '#ffeaea' : undefined,
          }}
        />
        {currentPasswordError && (
          <span style={{ color: '#c0392b', fontWeight: 500, fontSize: '0.97rem', marginTop: 4, display: 'block' }}>
            Incorrect current password.
          </span>
        )}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6, display: 'block' }}>
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e0e6ed' }}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6, display: 'block' }}>
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #e0e6ed' }}
        />
      </div>
      {message && (
        <div
          style={{
            color: message.includes('success') ? '#2980b9' : '#c0392b',
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          {message}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button
          type="button"
          style={{
            background: '#e0e6ed',
            color: '#232946',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            background: '#2980b9',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

interface PreferencesSectionProps {
  setEditMode: (edit: boolean) => void;
  setMobileForm: (form: any) => void;
  profile: any;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ setEditMode, setMobileForm, profile }) => {
  const [showSecurityPanel, setShowSecurityPanel] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setMobileForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone_number || '',
    });
  };

  return (
    <div
      style={{
        background: '#fff',
        width: '100%',
        maxWidth: 360,
        borderRadius: 12,
        padding: 18,
        boxShadow: '0 6px 20px rgba(44,62,80,0.08)',
      }}
    >
      {/* Account Section Header for Mobile */}
      <div
        style={{
          borderBottom: '1px solid #f7f7f7',
          padding: '0.7rem 0.5rem',
          fontWeight: 700,
          color: '#232946',
          fontSize: '1.08rem',
          textAlign: 'left',
        }}
      >
        Account
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.2rem',
          borderBottom: '1px solid #f7f7f7',
          fontWeight: 600,
          color: '#232946',
          fontSize: '1.08rem',
          cursor: 'pointer',
        }}
        onClick={handleEditProfile}
        tabIndex={0}
        role="button"
        aria-label="Edit Profile"
        onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') handleEditProfile(); }}
      >
        <span>
          <i className="fas fa-pencil-alt" style={{ marginRight: 12, color: '#232946' }}></i>
          Edit Profile
        </span>
      </div>
      
      {/* Preferences Header */}
      <div
        style={{
          borderBottom: '1px solid #f7f7f7',
          padding: '0.7rem 0.5rem',
          fontWeight: 700,
          color: '#232946',
          fontSize: '1.08rem',
          textAlign: 'left',
        }}
      >
        Preferences
      </div>
      

      {/* Language and Darkmode */}
      <div style={{ background: 'transparent' }}>
        <LanguageSelector />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.1rem 1.2rem',
            borderBottom: '1px solid #f7f7f7',
            fontWeight: 600,
            color: '#232946',
            fontSize: '1.08rem',
          }}
        >
          <span>
            <i className="fas fa-moon" style={{ marginRight: 12, color: '#232946' }}></i>Darkmode
          </span>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" style={{ display: 'none' }} checked={false} onChange={() => {}} />
            <span
              style={{
                width: 38,
                height: 22,
                background: '#e0e6ed',
                borderRadius: 12,
                position: 'relative',
                transition: 'background 0.2s',
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: 2,
                  top: 2,
                  width: 18,
                  height: 18,
                  background: '#232946',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                }}
              ></span>
            </span>
          </label>
        </div>
      </div>

      {/* Settings Section */}
      <div
        style={{
          borderTop: '8px solid #f7f7f7',
          borderBottom: '1px solid #f7f7f7',
          padding: '0.7rem 0.5rem',
          fontWeight: 700,
          color: '#232946',
          fontSize: '1.08rem',
          textAlign: 'left',
        }}
      >
        Settings
      </div>

      <SettingsNavigation
        onSelect={key => {
          if (key === 'security') setShowSecurityPanel(true);
        }}
      />

      {/* Security Modal */}
      {showSecurityPanel && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(44,62,80,0.18)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(44,62,80,0.18)',
              padding: 32,
              minWidth: 320,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 18 }}>Security</h2>
            <SecuritySection onChangePassword={handleChangePassword} />
            <button
              type="button"
              style={{
                marginTop: 18,
                background: '#e0e6ed',
                color: '#232946',
                border: 'none',
                borderRadius: 6,
                padding: '8px 18px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              onClick={() => setShowSecurityPanel(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(44,62,80,0.18)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              boxShadow: '0 6px 20px rgba(44,62,80,0.18)',
              padding: 32,
              minWidth: 320,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 18 }}>Change Password</h2>
            <ChangePasswordForm onClose={() => setShowChangePassword(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesSection;
