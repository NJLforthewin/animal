import React, { useEffect, useState, createContext, useContext } from 'react';
import '../styles/dashboard-main.css';
import '../styles/profile.css';
import '../styles/profile-mobile.css';
import '../styles/profile-feed-mobile.css';
import ProfileLeftPanel from './ProfileLeftPanel';
import ProfileRightPanel from './ProfileRightPanel';
import PreferencesSection from '../components/PreferencesSection';

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const defaultAvatars: string[] = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  '/avatars/avatar5.png',
  '/avatars/avatar6.png',
];

export interface UserType {
  blind_full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  relationship?: string;
  blind_phone_number?: string;
  blind_age?: string;
  impairment_level?: string;
  device_id?: string;
}

export const UserContext = createContext<{ user: UserType | null; setUser: (u: UserType | null) => void }>({ user: null, setUser: () => {} });

const Profile: React.FC = () => {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [mobileForm, setMobileForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  // Store the original avatar for cancel logic
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
  // Local preview for mobile profile panel only
  const [localMobileAvatarPreview, setLocalMobileAvatarPreview] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    // Fetch profile data on mount
    async function fetchProfile() {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      const data = await res.json();
      setProfile(data);
      setForm(data);
      setMobileForm({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone_number,
      });
    }
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user: profile, setUser: setProfile }}>
      <div className="profile-page">
  {/* Left panel (desktop header) separated */}
  {!isMobile && <ProfileLeftPanel user={profile} />}
      {/* Right panel (main profile logic) separated */}
      <ProfileRightPanel
        isMobile={isMobile}
        profile={profile}
        editMode={editMode}
        form={form}
        mobileForm={mobileForm}
        loading={loading}
        errorMsg={errorMsg}
        avatarPreview={avatarPreview}
        showAvatarPicker={showAvatarPicker}
        defaultAvatars={defaultAvatars}
        setEditMode={(edit) => {
          setEditMode(edit);
          if (edit) {
            setOriginalAvatar(avatarPreview || profile?.avatar || null);
            if (isMobile) {
              setLocalMobileAvatarPreview(avatarPreview || profile?.avatar || null);
            }
          } else {
            setAvatarPreview(originalAvatar || '');
            if (isMobile) {
              setLocalMobileAvatarPreview(null);
            }
            setOriginalAvatar(null);
          }
        }}
        setForm={setForm}
        setMobileForm={setMobileForm}
  setAvatarPreview={isMobile ? setLocalMobileAvatarPreview : setAvatarPreview}
        setShowAvatarPicker={setShowAvatarPicker}
        onSave={async () => {
          setLoading(true); setErrorMsg('');
          try {
            const avatarToSend = avatarPreview || originalAvatar || profile?.avatar;
            await fetch('/api/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
              body: JSON.stringify({
                ...form,
                avatar: avatarToSend
              }),
            });
            const fetchRes = await fetch('/api/profile', {
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            const updated = await fetchRes.json();
            setProfile(updated);
            setUser(updated); // <-- update global context
            setAvatarPreview(avatarPreview || originalAvatar || profile?.avatar || '');
            setEditMode(false);
            setOriginalAvatar(null);
          } catch (err) {
            setErrorMsg('Could not save changes.');
          }
          setLoading(false);
        }}
        onUpdate={async (e: React.FormEvent, closeModal?: () => void) => {
          e.preventDefault();
          setLoading(true); setErrorMsg('');
          try {
            const avatarToSendMobile = localMobileAvatarPreview || originalAvatar || avatarPreview || profile?.avatar;
            await fetch('/api/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
              body: JSON.stringify({
                first_name: mobileForm.first_name || '',
                last_name: mobileForm.last_name || '',
                email: mobileForm.email || '',
                phone_number: mobileForm.phone || '',
                relationship: profile?.relationship || '',
                blind_full_name: profile?.blind_full_name || '',
                blind_phone_number: profile?.blind_phone_number || '',
                blind_age: profile?.blind_age || '',
                impairment_level: profile?.impairment_level || '',
                device_id: profile?.device_id || '',
                avatar: avatarToSendMobile
              }),
            });
            const fetchRes = await fetch('/api/profile', {
              headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            const updated = await fetchRes.json();
            setProfile(updated);
            setUser(updated); // <-- update global context
            setAvatarPreview(localMobileAvatarPreview || originalAvatar || avatarPreview || profile?.avatar || '');
            setEditMode(false);
            setLocalMobileAvatarPreview(null);
            setOriginalAvatar(null);
            if (closeModal) closeModal();
          } catch (err) {
            setErrorMsg('Could not save changes.');
          }
          setLoading(false);
        }}
        originalAvatar={originalAvatar}
  localProfileAvatarPreview={avatarPreview}
  setLocalProfileAvatarPreview={setAvatarPreview}
        localMobileAvatarPreview={localMobileAvatarPreview}
        setLocalMobileAvatarPreview={setLocalMobileAvatarPreview}
      />
  {/* removed duplicate/broken legacy code */}
      
    </div>
    </UserContext.Provider>
  );
};

export default Profile;
