import React, { useState, useContext } from 'react';
import '../styles/dashboard-main.css';
import '../styles/profile.css';
import AvatarCircle from '../components/AvatarCircle';
import SecurityModal from '../components/SecurityModal';

// Theme context for dark mode
const ThemeContext = React.createContext({ dark: false, toggle: () => {} });

interface ProfileDesktopProps {
  profile: any;
  editMode: boolean;
  form: any;
  loading: boolean;
  errorMsg: string;
  avatarPreview: string | null;
  showAvatarPicker: boolean;
  defaultAvatars: string[];
  setEditMode: (edit: boolean) => void;
  setForm: (form: any) => void;
  setAvatarPreview: (url: string) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onSave: () => Promise<void>;
}

const languageOptions = ['English', 'Filipino', 'Cebuano'];

const ProfileDesktop: React.FC<ProfileDesktopProps> = ({
  profile,
  form,
  loading,
  errorMsg,
  avatarPreview,
  defaultAvatars,
  setEditMode,
  setForm,
  setAvatarPreview,
  setShowAvatarPicker,
  onSave
}) => {
  // Sidebar selection: 'profile' | 'patient' | 'language' | 'notifications' | 'device'
  const [activePanel, setActivePanel] = useState<'profile' | 'patient' | 'language' | 'notifications' | 'device'>('profile');
  // Security modal state
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const { dark, toggle } = useContext(ThemeContext);
  // Removed unused infoEditable state
  const [editMode, setEditModeState] = useState(false);
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);

  // Color palette and style variables (ProfileMobile inspired)
  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    background: 'linear-gradient(135deg, #e3f0ff 0%, #b6cfff 100%)',
    card: '#fff', // unified to white
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };
  const fontFamily = 'Segoe UI, Open Sans, Roboto, Arial, sans-serif';
  return (
    <div
      className={dark ? 'profile-desktop dark-mode' : 'profile-desktop'}
      style={{
        minHeight: '100vh',
        background: palette.background,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '340px 1fr',
          width: '100%',
          maxWidth: 1100,
          background: 'transparent',
          borderRadius: 18,
          boxShadow: '0 6px 20px rgba(44,62,80,0.08)',
          overflow: 'hidden',
          alignItems: 'start', // ensures left and right panels are independent vertically
        }}
      >
        {/* Left column: avatar, email, menu */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '1.5rem 0.8rem',
            gap: '1.1rem',
            background: palette.card,
            borderRadius: '16px 0 0 16px',
            boxShadow: '0 6px 20px rgba(44,62,80,0.08)',
            minHeight: '100%',
            borderRight: 'none',
          }}
        >
          {/* Avatar & Email */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}>
            <div style={{ marginBottom: 0 }}>
              {/* Left panel avatar uses only the global avatar, never the local preview */}
              <AvatarCircle src={profile?.avatar} size={100} />
            </div>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 0, textAlign: 'center' }}>
              {profile?.email || '-'}
            </div>
          </div>
          {/* Account Section */}
          <div style={{ width: '100%', marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: 8 }}>Account</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: activePanel === 'profile' ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: activePanel === 'profile' ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 6,
                  transition: 'background 0.2s',
                  textAlign: 'left',
                }}
                onClick={() => setActivePanel('profile')}
              >
                Profile
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: activePanel === 'patient' ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: activePanel === 'patient' ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  marginBottom: 6,
                  transition: 'background 0.2s',
                  textAlign: 'left',
                }}
                onClick={() => setActivePanel('patient')}
              >
                Patient Information
              </div>
            </div>
          </div>
          {/* Preferences Section */}
          <div style={{ width: '100%', marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: 8 }}>Preferences</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: activePanel === 'language' ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: activePanel === 'language' ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setActivePanel('language')}
              >
                Language
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.2rem', borderRadius: 8, background: 'transparent' }}>
                <span style={{ color: palette.primary, fontWeight: 600, fontSize: '1.08rem' }}>Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" checked={dark} onChange={toggle} />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
          {/* Settings Section */}
          <div style={{ width: '100%', marginTop: 18 }}>
            <div style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: 8 }}>Settings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div
                style={{
                  fontWeight: 600,
                  color: showSecurityModal ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: showSecurityModal ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setShowSecurityModal(true)}
              >
                Security
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: activePanel === 'notifications' ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: activePanel === 'notifications' ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setActivePanel('notifications')}
              >
                Notifications
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: activePanel === 'device' ? palette.accent : palette.primary,
                  fontSize: '1.08rem',
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  background: activePanel === 'device' ? palette.secondary : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => setActivePanel('device')}
              >
                Device Management
              </div>
            </div>
          </div>
        </div>
        {/* Right column: dynamic content */}
        {/*
          RIGHT PANEL CONTAINER: Adjust minHeight, minWidth, padding, margin, etc. here to change only the right panel.
          The left panel will NOT be affected by changes below.
        */}
        <div style={{
          padding: '1.5rem 0.8rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'transparent',
          minHeight: 650,
          minWidth: 340,
          maxWidth: 900,
          margin: 0,
          height: 'auto',
        }}>
          <div style={{ width: '100%', maxWidth: 900, minHeight: 650 }}>
            {activePanel === 'profile' && (
              <div style={{ background: palette.card, borderRadius: 16, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: '1.5rem 1.2rem', fontFamily, minHeight: 650, maxWidth: 900, width: '100%' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: '1.1rem' }}>Profile</h2>
                {/* Avatar and change icon */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                  <div style={{ position: 'relative', width: 110, height: 110 }}>
                    <div style={{
                      background: '#fff',
                      border: '2.5px solid #2980b9',
                      boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      {/* Right panel avatar uses the local preview (avatarPreview prop) */}
                      <AvatarCircle src={avatarPreview || undefined} size={100} />
                    </div>
                    {editMode && (
                      <button
                        type="button"
                        aria-label="Change Avatar"
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: '#fff',
                          border: '1.5px solid #2980b9',
                          borderRadius: '50%',
                          width: 30,
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                          cursor: 'pointer',
                          zIndex: 2
                        }}
                        onClick={() => setShowAvatarPicker(true)}
                      >
                        <i className="fas fa-pencil-alt" style={{ color: '#2980b9', fontSize: '1.35rem' }}></i>
                      </button>
                    )}
                  </div>
                </div>
                {/* Caregiver Info */}
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: palette.accent, marginBottom: '1.0rem' }}>Caregiver Information</h3>
                <form onSubmit={e => e.preventDefault()} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>First Name</label>
                    <input className="profile-info-value" type="text" value={form.first_name ?? ''} onChange={e => setForm((f: any) => ({ ...f, first_name: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, marginBottom: 0 }} disabled={!editMode} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Last Name</label>
                    <input className="profile-info-value" type="text" value={form.last_name ?? ''} onChange={e => setForm((f: any) => ({ ...f, last_name: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, marginBottom: 0 }} disabled={!editMode} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Phone Number</label>
                    <input className="profile-info-value" type="text" value={form.phone_number ?? ''} onChange={e => setForm((f: any) => ({ ...f, phone_number: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, marginBottom: 0 }} disabled={!editMode} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Email</label>
                    <input className="profile-info-value" type="email" value={form.email ?? ''} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, marginBottom: 0 }} disabled={!editMode} />
                  </div>
                </form>
                {/* Patient Info */}
                <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: palette.accent, margin: '1.0rem 0 1.0rem 0' }}>Patient Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Name</label>
                    <input className="profile-info-value" type="text" value={profile?.blind_full_name || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Phone</label>
                    <input className="profile-info-value" type="text" value={profile?.blind_phone_number || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Age</label>
                    <input className="profile-info-value" type="text" value={profile?.blind_age || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Impairment</label>
                    <input className="profile-info-value" type="text" value={profile?.impairment_level || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                </div>
                {/* Relationship & Device Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Relationship</label>
                    <input className="profile-info-value" type="text" value={profile?.relationship || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Device ID</label>
                    <input className="profile-info-value" type="text" value={profile?.device_id || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
                  </div>
                </div>
                {/* Save/Cancel or Edit Profile button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                  {!editMode ? (
                    <button
                      className="profile-edit-btn"
                      style={{ background: palette.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', transition: 'background 0.2s' }}
                      onClick={() => {
                        setEditModeState(true);
                        setOriginalAvatar(avatarPreview || profile?.avatar || null);
                      }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        className="profile-edit-btn"
                        style={{ background: palette.primary, color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', transition: 'background 0.2s', marginRight: 10 }}
                        onClick={async () => {
                          await onSave();
                          setEditModeState(false);
                          setOriginalAvatar(null);
                        }}
                        disabled={loading}
                      >
                        Save
                      </button>
                      <button
                        className="profile-edit-btn"
                        style={{ background: palette.secondary, color: palette.primary, border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1.08rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', transition: 'background 0.2s' }}
                        onClick={() => {
                          setEditModeState(false);
                          setAvatarPreview(originalAvatar || '');
                          setOriginalAvatar(null);
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
                {errorMsg && <div style={{ color: palette.error, marginTop: 8 }}>{errorMsg}</div>}
              </div>
            )}
            {activePanel === 'patient' && (
              <div style={{ background: palette.card, borderRadius: 16, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: '1.5rem 1.2rem', fontFamily, minHeight: 650, maxWidth: 900, width: '100%' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: '1.1rem' }}>Patient Information</h2>
                {/* Patient info fields, can be expanded as needed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><strong>Name:</strong> {profile?.blind_full_name || '-'}</div>
                  <div><strong>Phone:</strong> {profile?.blind_phone_number || '-'}</div>
                  <div><strong>Age:</strong> {profile?.blind_age || '-'}</div>
                  <div><strong>Impairment:</strong> {profile?.impairment_level || '-'}</div>
                  <div><strong>Relationship:</strong> {profile?.relationship || '-'}</div>
                  <div><strong>Device ID:</strong> {profile?.device_id || '-'}</div>
                </div>
              </div>
            )}
            {activePanel === 'notifications' && (
              <div style={{ background: palette.card, borderRadius: 16, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: '1.5rem 1.2rem', fontFamily, minHeight: 650, maxWidth: 900, width: '100%' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: '1.1rem' }}>Notifications</h2>
                <div style={{ color: palette.muted, fontSize: '1.08rem' }}>[Notification settings and history go here]</div>
              </div>
            )}
            {activePanel === 'device' && (
              <div style={{ background: palette.card, borderRadius: 16, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: '1.5rem 1.2rem', fontFamily, minHeight: 650, maxWidth: 900, width: '100%' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: '1.1rem' }}>Device Management</h2>
                <div style={{ color: palette.muted, fontSize: '1.08rem' }}>[Device management options go here]</div>
              </div>
            )}
            {activePanel === 'language' && (
              <div style={{ background: palette.card, borderRadius: 16, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: '1.5rem 1.2rem', fontFamily, minHeight: 650, maxWidth: 900, width: '100%' }}>
                <h2 style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.accent, marginBottom: '1.1rem' }}>Language Settings</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {languageOptions.map(lang => (
                    <button
                      key={lang}
                      style={{
                        background: palette.secondary,
                        color: palette.primary,
                        border: 'none',
                        borderRadius: 8,
                        padding: '0.7rem 2.2rem',
                        fontWeight: 600,
                        fontSize: '1.08rem',
                        cursor: 'pointer',
                        minWidth: 140,
                        boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
                        transition: 'background 0.2s',
                      }}
                      onMouseOver={e => (e.currentTarget.style.background = palette.accent)}
                      onMouseOut={e => (e.currentTarget.style.background = palette.secondary)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Security modal is handled separately, not as a right panel swap */}
          </div>
        </div>
      </div>
      {/* Security Modal (desktop) */}
      <SecurityModal open={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
    </div>
  );
};

export default ProfileDesktop;
