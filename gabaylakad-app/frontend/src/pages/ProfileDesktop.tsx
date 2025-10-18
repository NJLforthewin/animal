import React, { useState } from 'react';
import '../styles/dashboard-main.css';
import '../styles/profile.css';
import ProfileAccountSectiondesktop from '../components/ProfileDesktop/ProfileAccountSectiondesktop';
import AvatarPicker from '../components/AvatarPicker';
import ProfilePreferencesSectiondesktop from '../components/ProfileDesktop/ProfilePreferencesSectiondesktop';
import ProfileSettingsSectiondesktop from '../components/ProfileDesktop/ProfileSettingsSectiondesktop';

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
  fetchProfile: () => Promise<void>; // <-- add this
}


const ProfileDesktop: React.FC<ProfileDesktopProps> = (props) => {
  const [open, setOpen] = useState(true);
  const [overlay, setOverlay] = useState<'none' | 'preferences' | 'settings'>('none');
  const [language, setLanguage] = useState('English');
  const [dark, setDark] = useState(false);
  const toggleDark = () => setDark((d) => !d);

  // Color palette and style variables
  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    background: 'linear-gradient(135deg, #e3f0ff 0%, #b6cfff 100%)',
    card: '#fff',
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };
  const fontFamily = 'Segoe UI, Open Sans, Roboto, Arial, sans-serif';
  if (!open) return null;

  // Main modal backdrop
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(44,62,80,0.18)', backdropFilter: 'blur(4px)', transition: 'opacity 0.25s' }}>
      {/* Main Modal Container (Account base layer) */}
      <div style={{ minWidth: 720, maxWidth: 800, width: '90vw', maxHeight: '90vh', background: palette.card, borderRadius: 18, boxShadow: '0 6px 32px rgba(44,62,80,0.13)', fontFamily, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.25s', position: 'relative', zIndex: 10000, filter: overlay !== 'none' ? 'brightness(0.92)' : 'none', transition: 'filter 0.18s' }}>
        {/* Modal Header with Tabs and Close */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1.5px solid ${palette.secondary}`, padding: '0.7rem 2.2rem', background: '#f7faff', position: 'relative', minHeight: 62 }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <button onClick={() => setOverlay('none')} style={{ background: 'none', border: 'none', color: overlay === 'none' ? palette.accent : palette.primary, fontWeight: 700, fontSize: '1.18rem', cursor: 'pointer', padding: 0, borderBottom: overlay === 'none' ? `3px solid ${palette.accent}` : 'none', transition: 'color 0.18s, border-bottom 0.18s', marginBottom: -2 }}>Account</button>
            <button onClick={() => setOverlay('preferences')} disabled={overlay === 'settings'} style={{ background: 'none', border: 'none', color: overlay === 'preferences' ? palette.accent : palette.primary, fontWeight: 700, fontSize: '1.18rem', cursor: overlay === 'settings' ? 'not-allowed' : 'pointer', opacity: overlay === 'settings' ? 0.5 : 1, padding: 0, borderBottom: overlay === 'preferences' ? `3px solid ${palette.accent}` : 'none', transition: 'color 0.18s, border-bottom 0.18s', marginBottom: -2 }}>Preferences</button>
            <button onClick={() => overlay === 'none' && setOverlay('settings')} disabled={overlay === 'preferences'} style={{ background: 'none', border: 'none', color: overlay === 'settings' ? palette.accent : palette.primary, fontWeight: 700, fontSize: '1.18rem', cursor: overlay === 'preferences' ? 'not-allowed' : 'pointer', opacity: overlay === 'preferences' ? 0.5 : 1, padding: 0, borderBottom: overlay === 'settings' ? `3px solid ${palette.accent}` : 'none', transition: 'color 0.18s, border-bottom 0.18s', marginBottom: -2 }}>Settings</button>
          </div>
          <button aria-label="Close" onClick={() => setOpen(false)} style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 28, color: palette.primary, cursor: 'pointer', fontWeight: 700, zIndex: 10001 }}>&times;</button>
        </div>
        {/* Account Section (always rendered as base layer) */}
        <div style={{ flex: 1, padding: '2.2rem 2.5rem', overflowY: 'auto', background: palette.card }}>
          <ProfileAccountSectiondesktop
            {...props}
            fetchProfile={props.fetchProfile}
          />
        </div>
        {/* Avatar Picker Modal */}
        {props.showAvatarPicker && (
          <AvatarPicker
            defaultAvatars={props.defaultAvatars}
            avatarPreview={props.avatarPreview}
            setAvatarPreview={props.setAvatarPreview}
            setShowAvatarPicker={props.setShowAvatarPicker}
            onConfirm={() => {
              props.setShowAvatarPicker(false);
            }}
          />
        )}
      </div>

      {/* Preferences Overlay Modal */}
      {overlay === 'preferences' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(44,62,80,0.12)', animation: 'fadeIn 0.22s' }}>
          <div style={{ minWidth: 520, maxWidth: 600, width: '80vw', maxHeight: '80vh', background: palette.card, borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.13)', fontFamily, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10002, animation: 'scaleIn 0.22s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: palette.accent }}>Preferences</div>
              <button aria-label="Close Preferences" onClick={() => setOverlay('none')} style={{ background: 'none', border: 'none', fontSize: 26, color: palette.primary, cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            </div>
            <ProfilePreferencesSectiondesktop
              language={language}
              setLanguage={setLanguage}
              dark={dark}
              toggleDark={toggleDark}
            />
          </div>
        </div>
      )}

      {/* Settings Overlay Modal */}
      {overlay === 'settings' && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10002, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(44,62,80,0.14)', animation: 'fadeIn 0.22s' }}>
          <div style={{ minWidth: 520, maxWidth: 600, width: '80vw', maxHeight: '80vh', background: palette.card, borderRadius: 16, boxShadow: '0 4px 24px rgba(44,62,80,0.13)', fontFamily, padding: '2rem 2.5rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10003, animation: 'scaleIn 0.22s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: '1.18rem', color: palette.accent }}>Settings</div>
              <button aria-label="Close Settings" onClick={() => setOverlay('none')} style={{ background: 'none', border: 'none', fontSize: 26, color: palette.primary, cursor: 'pointer', fontWeight: 700 }}>&times;</button>
            </div>
            <ProfileSettingsSectiondesktop />
          </div>
        </div>
      )}
      {/* Security submodals would be rendered above here, handled in ProfileSettingsSectiondesktop */}
    </div>
  );
};

export default ProfileDesktop;
