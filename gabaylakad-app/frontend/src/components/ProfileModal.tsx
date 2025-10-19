import React, { useRef, useEffect, useState } from 'react';
import BaseModal from '../components/BaseModal';
import AvatarCircle from '../components/AvatarCircle';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  avatar: string;
  onAvatarClick: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
  form: any;
  setForm: (form: any) => void;
  loading: boolean;
  errorMsg: string;
  onUpdate: (e: React.FormEvent, closeModal?: () => void) => Promise<void>;
  zIndex?: number;
}

const nameRegex = /^[A-Za-z\s-]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const phoneRegex = /^\d{11}$/;

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
  lower = lower.replace(/\.con$/, '.com');
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

const ProfileModal: React.FC<ProfileModalProps> = ({
  open,
  onClose,
  profile,
  avatar,
  onAvatarClick,
  isEditing,
  onEditToggle,
  form,
  setForm,
  loading,
  errorMsg,
  onUpdate,
  zIndex
}) => {
  // Validation state
  const [touched, setTouched] = useState<{[key:string]:boolean}>({});
  const [fadeIn, setFadeIn] = useState(false);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // Validation results
  const firstNameValidation = validateName(form.first_name || '');
  const lastNameValidation = validateName(form.last_name || '');
  const emailValidation = validateEmail(form.email || '');
  const phoneValidation = validatePhone(form.phone || '');
  const allValid = firstNameValidation.valid && lastNameValidation.valid && emailValidation.valid && phoneValidation.valid;

  // Fade-in effect for edit mode
  useEffect(() => {
    if (isEditing) {
      setFadeIn(true);
    } else {
      setFadeIn(false);
    }
  }, [isEditing]);

  // Auto-scroll to first invalid field on submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ first_name: true, last_name: true, email: true, phone: true });
    if (!allValid) {
      if (!firstNameValidation.valid && firstNameRef.current) firstNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!lastNameValidation.valid && lastNameRef.current) lastNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!emailValidation.valid && emailRef.current) emailRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else if (!phoneValidation.valid && phoneRef.current) phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    await onUpdate(e);
  };

  // Handlers for each field
  const handleNameChange = (field: 'first_name'|'last_name', value: string) => {
    // Only allow valid chars, auto-capitalize first letter
    let filtered = value.replace(/[^A-Za-z\s-]/g, '');
    filtered = capitalizeFirst(filtered);
    setForm((m: any) => ({ ...m, [field]: filtered }));
  };
  const handleEmailChange = (value: string) => {
    setForm((m: any) => ({ ...m, email: value.toLowerCase() }));
  };
  const handlePhoneChange = (value: string) => {
    // Only allow digits, auto-format
    let digits = value.replace(/\D/g, '');
    setForm((m: any) => ({ ...m, phone: formatPhone(digits) }));
  };

  return (
    <BaseModal open={open} onClose={onClose} title="Profile" zIndex={zIndex}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, minWidth: 260, minHeight: 420 }}>
        {/* Avatar */}
        <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 8 }}>
          <AvatarCircle src={avatar} size={100} />
          {isEditing && (
            <button type="button" aria-label="Change Avatar" style={{ position: 'absolute', top: 4, right: 4, background: '#fff', border: '1.5px solid #2980b9', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(44,62,80,0.10)', cursor: 'pointer', zIndex: 2 }} onClick={onAvatarClick}>
              <i className="fas fa-pencil-alt" style={{ color: '#2980b9', fontSize: '1.35rem' }}></i>
            </button>
          )}
        </div>
        {/* Profile Details */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 280, justifyContent: 'space-between' }}>
          {isEditing ? (
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, flex: 1, opacity: fadeIn ? 1 : 0, transition: 'opacity 0.3s' }}>
              <div>
                <label className="profile-info-label">First Name</label>
                <input
                  ref={firstNameRef}
                  className="profile-info-value"
                  name="first_name"
                  value={form.first_name}
                  onChange={e => handleNameChange('first_name', e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, first_name: true }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: firstNameValidation.valid || !touched.first_name ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    background: isEditing ? '#fff' : '#f7f7f7',
                    color: '#232946',
                    boxShadow: isEditing ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
                    borderColor: isEditing ? '#007bff' : undefined,
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                  }}
                  disabled={!isEditing}
                  autoComplete="off"
                />
                {!firstNameValidation.valid && touched.first_name && (
                  <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{firstNameValidation.error}</div>
                )}
              </div>
              <div>
                <label className="profile-info-label">Last Name</label>
                <input
                  ref={lastNameRef}
                  className="profile-info-value"
                  name="last_name"
                  value={form.last_name}
                  onChange={e => handleNameChange('last_name', e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, last_name: true }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: lastNameValidation.valid || !touched.last_name ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    background: isEditing ? '#fff' : '#f7f7f7',
                    color: '#232946',
                    boxShadow: isEditing ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
                    borderColor: isEditing ? '#007bff' : undefined,
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                  }}
                  disabled={!isEditing}
                  autoComplete="off"
                />
                {!lastNameValidation.valid && touched.last_name && (
                  <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{lastNameValidation.error}</div>
                )}
              </div>
              <div>
                <label className="profile-info-label">Email</label>
                <input
                  ref={emailRef}
                  className="profile-info-value"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={e => handleEmailChange(e.target.value.replace(/\s/g, ''))}
                  onBlur={e => {
                    let val = e.target.value.trim().toLowerCase().replace(/\s/g, '');
                    val = val.replace(/\.con$/, '.com');
                    setForm((m: any) => ({ ...m, email: val }));
                    setTouched(t => ({ ...t, email: true }));
                  }}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: touched.email ? (emailValidation.valid ? '1.5px solid #28a745' : '1.5px solid #e74c3c') : '1px solid #e0e0e0',
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    background: isEditing ? '#fff' : '#f7f7f7',
                    color: '#232946',
                    boxShadow: isEditing ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
                    borderColor: isEditing ? '#007bff' : undefined,
                    transition: 'box-shadow 0.25s, border-color 0.25s, border 0.25s',
                  }}
                  disabled={!isEditing}
                  autoComplete="off"
                  placeholder="example@domain.com"
                  aria-describedby="email-helper"
                />
                <div id="email-helper" style={{ fontSize: '0.93rem', color: '#2980b9', marginTop: 2 }}>
                  Use a valid email — must include ‘@’ and a domain like .com or .org.
                </div>
                {touched.email && (
                  <div style={{ color: emailValidation.valid ? '#28a745' : '#e74c3c', fontSize: '0.95rem', marginTop: 2, transition: 'color 0.2s' }}>
                    {emailValidation.valid ? emailValidation.error : emailValidation.error}
                  </div>
                )}
              </div>
              <div>
                <label className="profile-info-label">Phone Number</label>
                <input
                  ref={phoneRef}
                  className="profile-info-value"
                  name="phone"
                  value={form.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: 8,
                    border: phoneValidation.valid || !touched.phone ? '1px solid #e0e0e0' : '1.5px solid #e74c3c',
                    fontSize: '1.08rem',
                    fontWeight: 500,
                    background: isEditing ? '#fff' : '#f7f7f7',
                    color: '#232946',
                    boxShadow: isEditing ? '0 0 0 2px rgba(0,123,255,0.2)' : undefined,
                    borderColor: isEditing ? '#007bff' : undefined,
                    transition: 'box-shadow 0.25s, border-color 0.25s',
                  }}
                  disabled={!isEditing}
                  autoComplete="off"
                  inputMode="numeric"
                />
                <div style={{ fontSize: '0.93rem', color: phoneValidation.valid ? '#2980b9' : '#e74c3c', marginTop: 2 }}>
                  11 digits required ({form.phone.replace(/\D/g, '').length}/11 entered)
                </div>
                {!phoneValidation.valid && touched.phone && (
                  <div style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: 2 }}>{phoneValidation.error}</div>
                )}
              </div>
              {/* Save/Cancel Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={loading || !allValid} style={{ background: allValid ? '#232946' : '#b0b0b0', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 0', fontWeight: 700, fontSize: '1.13rem', flex: 1, cursor: allValid ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}>Update</button>
                <button type="button" onClick={onEditToggle} style={{ background: '#e0e6ed', color: '#232946', border: 'none', borderRadius: 12, padding: '0.9rem 0', fontWeight: 700, fontSize: '1.13rem', flex: 1, cursor: 'pointer' }}>Cancel</button>
              </div>
              {errorMsg && <div style={{ color: 'red', marginTop: 0 }}>{errorMsg}</div>}
            </form>
          ) : (
            <>
              {/* Show profile info in read-only mode */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
                <div>
                  <label className="profile-info-label">First Name</label>
                  <input className="profile-info-value" name="first_name" value={form.first_name} readOnly style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
                </div>
                <div>
                  <label className="profile-info-label">Last Name</label>
                  <input className="profile-info-value" name="last_name" value={form.last_name} readOnly style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
                </div>
                <div>
                  <label className="profile-info-label">Email</label>
                  <input className="profile-info-value" name="email" value={form.email} readOnly style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
                </div>
                <div>
                  <label className="profile-info-label">Phone Number</label>
                  <input className="profile-info-value" name="phone" value={form.phone} readOnly style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: '#f7f7f7', color: '#232946' }} />
                </div>
              </div>
              {/* Edit Profile Button OUTSIDE form */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%' }}>
                <button type="button" onClick={onEditToggle} style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 0', fontWeight: 700, fontSize: '1.13rem', width: '100%', cursor: 'pointer' }}>Edit Profile</button>
              </div>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ProfileModal;
