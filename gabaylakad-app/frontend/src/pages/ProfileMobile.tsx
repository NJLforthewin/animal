import React, { useState } from 'react';
import '../styles/profile-mobile.css';
import AvatarCircle from '../components/AvatarCircle';
import BaseModal from '../components/BaseModal';
import SecurityModal from '../components/SecurityModal';
import ProfileModal from '../components/ProfileModal';


interface ProfileMobileProps {
  profile: any;
  editMode: boolean;
  mobileForm: any;
  loading: boolean;
  errorMsg: string;
  avatarPreview: string | null;
  showAvatarPicker: boolean;
  defaultAvatars: string[];
  setEditMode: (edit: boolean) => void;
  setMobileForm: (form: any) => void;
  setAvatarPreview: (url: string) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onUpdate: (e: React.FormEvent, closeModal?: () => void) => Promise<void>;
  originalAvatar: string | null;
  fetchProfile: () => Promise<void>; // <-- add this
}


const ProfileMobile: React.FC<ProfileMobileProps> = ({
  profile,
  editMode,
  mobileForm,
  loading,
  errorMsg,
  avatarPreview,
  showAvatarPicker,
  defaultAvatars,
  setEditMode,
  setMobileForm,
  setAvatarPreview,
  setShowAvatarPicker,
  onUpdate,
  originalAvatar,
  fetchProfile
}) => {
  // Modal state
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);

  // Local avatar state for ProfileModal preview
  const [profileModalAvatar, setProfileModalAvatar] = useState<string | null>(null);

  // Navigation items
  const navItems = [
    { label: 'Account', isLabel: true },
    { label: 'Profile', icon: 'fas fa-user-edit', onClick: () => {
      setProfileModalAvatar(avatarPreview || profile?.avatar || defaultAvatars[0]);
      setShowProfileModal(true);
    } },
    { label: 'Patient Information', icon: 'fas fa-user-injured', onClick: () => {
      setShowPatientModal(true);
    } },
    { label: 'Preferences', isLabel: true },
    { label: 'Language', icon: 'fas fa-language', onClick: () => {/* language logic */} },
    { label: 'Dark Mode', icon: 'fas fa-moon', onClick: () => {/* dark mode logic */}, isToggle: true },
    { label: 'Settings', isLabel: true },
    { label: 'Security', icon: 'fas fa-lock', onClick: () => {
      setShowSecurityModal(true);
    } },
    { label: 'Notifications', icon: 'fas fa-bell', onClick: () => {/* notifications logic */} },
    { label: 'Device Information', icon: 'fas fa-microchip', onClick: () => {
      setShowDeviceModal(true);
    } },
  ];


  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Avatar section */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <AvatarCircle src={avatarPreview || profile?.avatar || defaultAvatars[0]} size={100} />
          {editMode && (
            <button type="button" aria-label="Change Avatar" style={{ position: 'absolute', top: 4, right: 4, background: '#fff', border: '1.5px solid #2980b9', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', cursor: 'pointer', zIndex: 2 }} onClick={() => setShowAvatarPicker(true)}>
              <i className="fas fa-pencil-alt" style={{ color: '#2980b9', fontSize: '1.35rem' }}></i>
            </button>
          )}
        </div>
        {showAvatarPicker && (
          <BaseModal open={showAvatarPicker} onClose={() => setShowAvatarPicker(false)} title="Choose Your Avatar" zIndex={10001}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
              {/* Preview Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: '0.95rem', color: '#232946', marginBottom: 6 }}>Preview</div>
                <img src={profileModalAvatar || avatarPreview || defaultAvatars[0]} alt="Avatar Preview" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid #2980b9', objectFit: 'cover', marginBottom: 8 }} />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                {defaultAvatars.map((url, idx) => (
                  <img key={idx} src={url} alt={`Avatar ${idx+1}`} style={{ width: 64, height: 64, borderRadius: '50%', border: (profileModalAvatar || avatarPreview) === url ? '3px solid #2980b9' : '2px solid #e0e0e0', cursor: 'pointer', objectFit: 'cover', transition: 'border 0.2s' }} onClick={() => { setAvatarPreview(url); setProfileModalAvatar(url); }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => setShowAvatarPicker(false)}>Confirm</button>
                <button style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 8, padding: '0.7rem 2.2rem', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }} onClick={() => { setShowAvatarPicker(false); setAvatarPreview(originalAvatar || profile?.avatar || null); setProfileModalAvatar(originalAvatar || profile?.avatar || null); }}>Cancel</button>
              </div>
            </div>
          </BaseModal>
        )}
      </div>

      {/* Navigation */}
      <div style={{ width: '100%', maxWidth: 340, margin: '0 auto', background: '#fff', borderRadius: 12, boxShadow: '0 6px 20px rgba(44,62,80,0.08)', padding: 18 }}>
        {navItems.map((item, idx) => (
          item.isLabel ? (
            <div key={item.label} style={{ fontWeight: 700, fontSize: '1.08rem', color: '#232946', margin: '1.1rem 0 0.7rem 0', pointerEvents: 'none' }}>{item.label}</div>
          ) : (
            <button key={item.label} type="button" onClick={item.onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', background: 'rgba(41,128,185,0.08)', border: 'none', borderRadius: 10, padding: '0.8rem 1.1rem', fontSize: '1.01rem', color: '#232946', fontWeight: 600, gap: 12, cursor: 'pointer', transition: 'background 0.18s', marginBottom: 6 }}>
              <i className={item.icon} aria-hidden style={{ fontSize: '1.1rem', width: 24, textAlign: 'center', color: '#2980b9' }}></i>
              <span>{item.label}</span>
              {item.isToggle && (
                <input type="checkbox" style={{ marginLeft: 'auto', accentColor: '#232946' }} />
              )}
            </button>
          )
        ))}
      </div>

      {/* Profile Modal (view/edit toggle, avatar, consistent modal design) */}
      <ProfileModal
        open={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setProfileEditMode(false);
          setProfileModalAvatar(null);
        }}
        profile={profile}
        avatar={profileModalAvatar || avatarPreview || profile?.avatar || defaultAvatars[0]}
        onAvatarClick={() => setShowAvatarPicker(true)}
        isEditing={profileEditMode}
        onEditToggle={() => {
  if (profileEditMode) {
    // If cancelling edit, reset form to original profile values
    setMobileForm({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      phone: profile?.phone_number || '',
    });
  }
  setProfileEditMode((v) => !v);
}}
        form={mobileForm}
        setForm={setMobileForm}
        loading={loading}
        errorMsg={errorMsg}
        onUpdate={async (e, closeModal) => {
          await onUpdate(e, closeModal);
          setProfileEditMode(false);
          setProfileModalAvatar(null);
        }}
        zIndex={9999}
      />

      {/* Patient Information Modal */}
      <BaseModal open={showPatientModal} onClose={() => setShowPatientModal(false)} title="Patient Information">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
            <div>
              <label className="profile-info-label">Full Name</label>
              <input className="profile-info-value" type="text" value={profile?.blind_full_name || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
            <div>
              <label className="profile-info-label">Phone Number</label>
              <input className="profile-info-value" type="text" value={profile?.blind_phone_number || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
            <div>
              <label className="profile-info-label">Age</label>
              <input className="profile-info-value" type="text" value={profile?.blind_age || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
            <div>
              <label className="profile-info-label">Impairment Level</label>
              <input className="profile-info-value" type="text" value={profile?.impairment_level || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
          </div>
        </div>
      </BaseModal>

      {/* Device Information Modal */}
      <BaseModal open={showDeviceModal} onClose={() => setShowDeviceModal(false)} title="Device Information">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem' }}>
            <div>
              <label className="profile-info-label">Relationship</label>
              <input className="profile-info-value" type="text" value={profile?.relationship || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
            <div>
              <label className="profile-info-label">Device Serial Number</label>
              <input className="profile-info-value" type="text" value={profile?.device_id || '-'} disabled style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
            </div>
          </div>
        </div>
      </BaseModal>
      {/* Security Modal (Change Password, 2FA, Login Activity) */}
      <SecurityModal open={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
    </div>
  );
};

export default ProfileMobile;
