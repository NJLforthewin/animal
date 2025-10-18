import React from 'react';
import BaseModal from '../BaseModal';
interface ProfilePreferencesSectiondesktopProps {
  language: string;
  setLanguage: (lang: string) => void;
  dark: boolean;
  toggleDark: () => void;
}

const languageOptions = ['English', 'Filipino', 'Cebuano'];

const ProfilePreferencesSectiondesktop: React.FC<ProfilePreferencesSectiondesktopProps> = ({ language, setLanguage, dark, toggleDark }) => {
  const palette = {
    primary: '#232946',
    accent: '#2980b9',
    card: '#fff',
    secondary: '#e0e6ed',
    error: '#e74c3c',
    muted: '#b0b0b0',
  };
  return (
    <div style={{ maxWidth: 420, margin: '0 auto' }}>
  {/* Heading removed to avoid duplication with overlay modal */}
      {/* Language Selector */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ fontWeight: 600, fontSize: '1.08rem', color: palette.primary, marginBottom: 8, display: 'block' }}>Language</label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500, background: palette.secondary, color: palette.primary }}
        >
          {languageOptions.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      {/* Dark Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.2rem', borderRadius: 8, background: palette.secondary }}>
        <span style={{ color: palette.primary, fontWeight: 600, fontSize: '1.08rem' }}>Dark Mode</span>
        <label className="switch">
          <input type="checkbox" checked={dark} onChange={toggleDark} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default ProfilePreferencesSectiondesktop;
