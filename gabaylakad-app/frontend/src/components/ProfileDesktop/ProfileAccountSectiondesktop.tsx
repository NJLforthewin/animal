import React, { useState } from 'react';
import AvatarCircle from '../AvatarCircle';

interface ProfileAccountSectiondesktopProps {
  profile: any;
  form: any;
  loading: boolean;
  errorMsg: string;
  avatarPreview: string | null;
  setForm: (form: any) => void;
  setAvatarPreview: (url: string) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onSave: () => Promise<void>;
  fetchProfile: () => Promise<void>; // <-- add this
}

const ProfileAccountSectiondesktop: React.FC<ProfileAccountSectiondesktopProps> = ({
  profile,
  form,
  loading,
  errorMsg,
  avatarPreview,
  setForm,
  setAvatarPreview,
  setShowAvatarPicker,
  onSave,
  fetchProfile // <-- add this
}) => {
  const [editMode, setEditMode] = useState(false);
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
  const [originalForm, setOriginalForm] = useState<any>(null);
  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    card: '#fff',
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };
  const fontFamily = 'Segoe UI, Open Sans, Roboto, Arial, sans-serif';

  return (
    <div style={{ width: '100%', maxWidth: 700, margin: '0 auto', fontFamily }}>
      {/* Avatar and edit icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 110, height: 110 }}>
          <AvatarCircle src={avatarPreview || profile?.avatar} size={100} />
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
      <form onSubmit={e => { e.preventDefault(); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: 5 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input className="profile-info-value" type="email" value={form.email ?? ''} onChange={e => setForm((f: any) => ({ ...f, email: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, marginBottom: 0 }} disabled={!editMode} />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2, gap: 12, minHeight: 32 }}>
              {editMode ? (
                <>
                  <span
                    className="profile-save-label"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: palette.primary,
                      cursor: !loading ? 'pointer' : 'default',
                      opacity: loading ? 0.6 : 1,
                      userSelect: 'none',
                      transition: 'color 0.2s, opacity 0.2s',
                      padding: '2px 0',
                      lineHeight: '1.8',
                    }}
                    onClick={async () => {
                      if (loading) return;
                      await onSave();
                      setEditMode(false);
                      setOriginalAvatar(null);
                    }}
                  >
                    Save
                  </span>
                  <span
                    className="profile-cancel-label"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: palette.accent,
                      cursor: !loading ? 'pointer' : 'default',
                      opacity: loading ? 0.6 : 1,
                      userSelect: 'none',
                      transition: 'color 0.2s, opacity 0.2s',
                      padding: '2px 0',
                      lineHeight: '1.8',
                    }}
                    onClick={async () => {
                      if (loading) return;
                      setEditMode(false);
                      await fetchProfile(); // robustly reload from backend
                      setOriginalAvatar(null);
                      setOriginalForm(null);
                    }}
                  >
                    Cancel
                  </span>
                </>
              ) : (
                <span
                  className="profile-edit-label"
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: palette.accent,
                    cursor: 'pointer',
                    padding: '2px 0',
                    userSelect: 'none',
                    transition: 'color 0.2s, opacity 0.2s',
                    lineHeight: '1.8',
                  }}
                  onClick={() => {
                    setEditMode(true);
                    setOriginalAvatar(avatarPreview || profile?.avatar || null);
                    setOriginalForm({ ...form });
                  }}
                >
                  Edit Profile
                </span>
              )}
            </div>
          </div>
        </div>
      </form>
      {/* Patient Info */}
      <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: palette.accent, margin: '0 0 1.0rem 0' }}>Patient Information</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: 24 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: 24 }}>
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Relationship</label>
          <input className="profile-info-value" type="text" value={profile?.relationship || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
        </div>
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Device ID</label>
          <input className="profile-info-value" type="text" value={profile?.device_id || '-'} disabled style={{ background: palette.secondary, color: palette.muted, borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, fontFamily, cursor: 'not-allowed' }} />
        </div>
      </div>
      {/* Save/Cancel buttons moved above */}
      {errorMsg && <div style={{ color: palette.error, marginTop: 8 }}>{errorMsg}</div>}
    </div>
  );
};

export default ProfileAccountSectiondesktop;
