import React, { useState, useRef, useEffect } from 'react';
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
  const [touched, setTouched] = useState<{[key:string]:boolean}>({});
  const [fadeIn, setFadeIn] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Validation logic
  const nameRegex = /^[A-Za-z\s-]+$/;
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  function validateName(name: string) {
    const trimmed = name.trim();
    if (trimmed.length < 2) return { valid: false, error: 'Minimum 2 characters required.' };
    if (trimmed.length > 50) return { valid: false, error: 'Maximum 50 characters allowed.' };
    if (!nameRegex.test(trimmed)) return { valid: false, error: 'Only letters, spaces, and hyphens allowed.' };
    return { valid: true, error: '' };
  }
  function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  function validateEmail(email: string) {
    let lower = email.trim().toLowerCase();
    // Auto-correct common typo
    lower = lower.replace(/\.con$/, '.com');
    // Prevent spaces and consecutive special chars
    if (/\s/.test(lower)) return { valid: false, error: 'Email cannot contain spaces.' };
    if (/([._-])\1+/.test(lower)) return { valid: false, error: 'No consecutive special characters.' };
    if (lower.length < 6) return { valid: false, error: 'Minimum 6 characters required.' };
    if (lower.length > 100) return { valid: false, error: 'Maximum 100 characters allowed.' };
    if (!lower.includes('@') || lower.lastIndexOf('.') < lower.indexOf('@')) return { valid: false, error: 'Please enter a valid email address (e.g., user@example.com).' };
    if (/^[._-]/.test(lower) || /[._-]$/.test(lower)) return { valid: false, error: 'Email cannot start or end with ".", "-", or "_".' };
    if (!emailRegex.test(lower)) return { valid: false, error: 'Please enter a valid email address (e.g., user@example.com).' };
    return { valid: true, error: 'Email looks good!' };
  }
  function validatePhone(phone: string) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 11) return { valid: false, error: `11 digits required (${digits.length}/11 entered).` };
    return { valid: true, error: '' };
  }
  function formatPhone(phone: string) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0,4)}-${digits.slice(4)}`;
    return `${digits.slice(0,4)}-${digits.slice(4,7)}-${digits.slice(7,11)}`;
  }

  // Validation results
  const firstNameValidation = validateName(form.first_name ?? '');
  const lastNameValidation = validateName(form.last_name ?? '');
  const emailValidation = validateEmail(form.email ?? '');
  const phoneValidation = validatePhone(form.phone_number ?? '');
  const allValid = firstNameValidation.valid && lastNameValidation.valid && emailValidation.valid && phoneValidation.valid;

  // Fade-in effect for edit mode
  useEffect(() => {
    if (editMode) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [editMode]);

  // Auto-scroll to first invalid field on save
  const handleSave = async () => {
    setTouched({ first_name: true, last_name: true, email: true, phone_number: true });
    if (!allValid) {
      if (!firstNameValidation.valid && firstNameRef.current) firstNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!lastNameValidation.valid && lastNameRef.current) lastNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!emailValidation.valid && emailRef.current) emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!phoneValidation.valid && phoneRef.current) phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    await onSave();
    setEditMode(false);
    setOriginalAvatar(null);
  };

  // Handlers for each field
  const handleNameChange = (field: 'first_name'|'last_name', value: string) => {
    let filtered = value.replace(/[^A-Za-z\s-]/g, '');
    filtered = capitalizeFirst(filtered);
    setForm((f: any) => ({ ...f, [field]: filtered }));
  };
  const handleEmailChange = (value: string) => {
    setForm((f: any) => ({ ...f, email: value.toLowerCase() }));
  };
  const handlePhoneChange = (value: string) => {
    let digits = value.replace(/\D/g, '');
    setForm((f: any) => ({ ...f, phone_number: formatPhone(digits) }));
  };
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
      <form
        onSubmit={e => e.preventDefault()}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.8rem',
          marginBottom: 5,
          ...(editMode
            ? { opacity: fadeIn ? 1 : 0, transition: 'opacity 0.3s' }
            : { opacity: 1, transition: undefined }),
        }}
      >
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>First Name</label>
          <input
            ref={firstNameRef}
            className="profile-info-value"
            type="text"
            value={form.first_name ?? ''}
            onChange={e => handleNameChange('first_name', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, first_name: true }))}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: firstNameValidation.valid || !touched.first_name ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
              fontSize: '1.08rem',
              fontWeight: 500,
              fontFamily,
              marginBottom: 0,
              boxShadow: editMode ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
              borderColor: editMode ? '#007bff' : undefined,
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
            disabled={!editMode}
            autoComplete="off"
          />
          {!firstNameValidation.valid && touched.first_name && (
            <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{firstNameValidation.error}</div>
          )}
        </div>
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Last Name</label>
          <input
            ref={lastNameRef}
            className="profile-info-value"
            type="text"
            value={form.last_name ?? ''}
            onChange={e => handleNameChange('last_name', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, last_name: true }))}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: lastNameValidation.valid || !touched.last_name ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
              fontSize: '1.08rem',
              fontWeight: 500,
              fontFamily,
              marginBottom: 0,
              boxShadow: editMode ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
              borderColor: editMode ? '#007bff' : undefined,
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
            disabled={!editMode}
            autoComplete="off"
          />
          {!lastNameValidation.valid && touched.last_name && (
            <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{lastNameValidation.error}</div>
          )}
        </div>
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Phone Number</label>
          <input
            ref={phoneRef}
            className="profile-info-value"
            type="text"
            value={form.phone_number ?? ''}
            onChange={e => handlePhoneChange(e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, phone_number: true }))}
            style={{
              width: '100%',
              padding: '0.7rem 1rem',
              borderRadius: 8,
              border: phoneValidation.valid || !touched.phone_number ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
              fontSize: '1.08rem',
              fontWeight: 500,
              fontFamily,
              marginBottom: 0,
              boxShadow: editMode ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
              borderColor: editMode ? '#007bff' : undefined,
              transition: 'box-shadow 0.25s, border-color 0.25s',
            }}
            disabled={!editMode}
            autoComplete="off"
            inputMode="numeric"
          />
          {editMode && (
            <div style={{ fontSize: '0.93rem', color: phoneValidation.valid ? '#2980b9' : '#e74c3c', marginTop: 2 }}>
              11 digits required ({(form.phone_number ?? '').replace(/\D/g, '').length}/11 entered)
            </div>
          )}
          {!phoneValidation.valid && touched.phone_number && (
            <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{phoneValidation.error}</div>
          )}
        </div>
        <div>
          <label className="profile-info-label" style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 6 }}>Email</label>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              ref={emailRef}
              className="profile-info-value"
              type="email"
              value={form.email ?? ''}
              onChange={e => handleEmailChange(e.target.value.replace(/\s/g, ''))}
              onBlur={e => {
                let val = e.target.value.trim().toLowerCase().replace(/\s/g, '');
                // Auto-correct common typo
                val = val.replace(/\.con$/, '.com');
                setForm((f: any) => ({ ...f, email: val }));
                setTouched(t => ({ ...t, email: true }));
              }}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: 8,
                border: touched.email ? (emailValidation.valid ? '1.5px solid #28a745' : '1.5px solid #e74c3c') : '1px solid #e0e0e0',
                fontSize: '1.08rem',
                fontWeight: 500,
                fontFamily,
                marginBottom: 0,
                boxShadow: editMode ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
                borderColor: editMode ? '#007bff' : undefined,
                transition: 'box-shadow 0.25s, border-color 0.25s, border 0.25s',
              }}
              disabled={!editMode}
              autoComplete="off"
              placeholder="example@domain.com"
              aria-describedby="email-helper"
            />
            {editMode && (
              <div id="email-helper" style={{ fontSize: '0.93rem', color: '#2980b9', marginTop: 2 }}>
                email must include ‘@’ and a domain like .com or .org.
              </div>
            )}
            {touched.email && (
              <div style={{ color: emailValidation.valid ? '#28a745' : '#e74c3c', fontSize: '0.95rem', marginTop: 2, transition: 'color 0.2s' }}>
                {emailValidation.valid ? emailValidation.error : emailValidation.error}
              </div>
            )}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 2, gap: 12, minHeight: 32 }}>
              {editMode ? (
                <>
                  <span
                    className="profile-save-label"
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: palette.primary,
                      cursor: !loading && allValid ? 'pointer' : 'not-allowed',
                      opacity: loading ? 0.6 : 1,
                      userSelect: 'none',
                      transition: 'color 0.2s, opacity 0.2s',
                      padding: '2px 0',
                      lineHeight: '1.8',
                      background: allValid ? undefined : '#e0e0e0',
                    }}
                    onClick={async () => {
                      if (loading || !allValid) return;
                      await handleSave();
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
      {/* Patient Info Card */}
      <div
        style={{
          background: '#f9fafc',
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(44,62,80,0.10)',
          padding: '1.5rem 1.5rem 1.1rem 1.5rem',
          marginBottom: 28,
          position: 'relative',
          pointerEvents: 'none',
          transition: 'box-shadow 0.25s, transform 0.25s',
          ...(typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
            ? { cursor: 'default' } : {}),
        }}
        className="patient-info-card"
        onMouseEnter={e => {
          if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(44,62,80,0.13)';
            (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={e => {
          if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
            (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(44,62,80,0.10)';
            (e.currentTarget as HTMLDivElement).style.transform = 'none';
          }
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h3 style={{ fontSize: '1.08rem', fontWeight: 600, color: palette.accent, margin: 0 }}>Patient Information</h3>
          <span style={{ fontSize: '0.98rem', color: '#888', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="16" height="16" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ marginLeft: 2 }}>View Only</span>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem 1.5rem', marginBottom: 8 }}>
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
              Name
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.blind_full_name || '-'}</span>
          </div>
          {/* Phone */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92V19a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h2.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.07.73 3.06a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l2.02-2.02a2 2 0 0 1 2.11-.45c.99.36 2.01.6 3.06.73A2 2 0 0 1 22 16.92z"/></svg>
              Phone
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.blind_phone_number || '-'}</span>
          </div>
          {/* Age */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              Age
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.blind_age || '-'}</span>
          </div>
          {/* Impairment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#2980b9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 21a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2z"/></svg>
              Impairment
              {/* Badge */}
              {profile?.impairment_level && (
                <span style={{
                  marginLeft: 8,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color:
                    profile.impairment_level.toLowerCase().includes('mild') ? '#27ae60' :
                    profile.impairment_level.toLowerCase().includes('moderate') ? '#e67e22' :
                    profile.impairment_level.toLowerCase().includes('severe') || profile.impairment_level.toLowerCase().includes('totally') ? '#e74c3c' : '#555',
                  background:
                    profile.impairment_level.toLowerCase().includes('mild') ? 'rgba(39,174,96,0.12)' :
                    profile.impairment_level.toLowerCase().includes('moderate') ? 'rgba(230,126,34,0.12)' :
                    profile.impairment_level.toLowerCase().includes('severe') || profile.impairment_level.toLowerCase().includes('totally') ? 'rgba(231,76,60,0.12)' : 'rgba(200,200,200,0.10)',
                  borderRadius: 8,
                  padding: '2px 10px',
                  marginRight: 2,
                  display: 'inline-block',
                }}>
                  {profile.impairment_level}
                </span>
              )}
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.impairment_level || '-'}</span>
          </div>
          {/* Relationship */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#e2557b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Relationship
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.relationship || '-'}</span>
          </div>
          {/* Device ID */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontWeight: 600, color: palette.primary, fontSize: '1.01rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="18" height="18" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4m-4 4h16"/></svg>
              Device ID
            </span>
            <span style={{ color: '#444', fontWeight: 500 }}>{profile?.device_id || '-'}</span>
          </div>
        </div>
        {/* Last Updated Timestamp */}
        {profile?.updated_at && (
          <div style={{ marginTop: 18, fontSize: '0.93rem', color: '#888', textAlign: 'right' }}>
            Last Updated: {new Date(profile.updated_at).toLocaleString()}
          </div>
        )}
      </div>
      {/* Save/Cancel buttons moved above */}
      {errorMsg && <div style={{ color: palette.error, marginTop: 8 }}>{errorMsg}</div>}
    </div>
  );
};

export default ProfileAccountSectiondesktop;
