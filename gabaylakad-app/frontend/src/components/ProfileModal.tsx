import React from 'react';
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
            <form onSubmit={e => onUpdate(e)} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <div>
                <label className="profile-info-label">First Name</label>
                <input className="profile-info-value" name="first_name" value={form.first_name} onChange={e => setForm((m: any) => ({ ...m, first_name: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: isEditing ? '#fff' : '#f7f7f7', color: '#232946' }} disabled={!isEditing} />
              </div>
              <div>
                <label className="profile-info-label">Last Name</label>
                <input className="profile-info-value" name="last_name" value={form.last_name} onChange={e => setForm((m: any) => ({ ...m, last_name: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: isEditing ? '#fff' : '#f7f7f7', color: '#232946' }} disabled={!isEditing} />
              </div>
              <div>
                <label className="profile-info-label">Email</label>
                <input className="profile-info-value" name="email" value={form.email} onChange={e => setForm((m: any) => ({ ...m, email: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: isEditing ? '#fff' : '#f7f7f7', color: '#232946' }} disabled={!isEditing} />
              </div>
              <div>
                <label className="profile-info-label">Phone Number</label>
                <input className="profile-info-value" name="phone" value={form.phone} onChange={e => setForm((m: any) => ({ ...m, phone: e.target.value }))} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: isEditing ? '#fff' : '#f7f7f7', color: '#232946' }} disabled={!isEditing} />
              </div>
              {/* Save/Cancel Buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={loading} style={{ background: '#232946', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 0', fontWeight: 700, fontSize: '1.13rem', flex: 1, cursor: 'pointer' }}>Update</button>
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
