import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/dashboard-main.css';
import '../styles/profile.css';
import '../styles/profile-mobile.css';
import '../styles/profile-feed-mobile.css';
import ProfileLeftPanel from './ProfileLeftPanel';
import ProfileMobile from './ProfileMobile';

import useIsMobile from '../components/useIsMobile';

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

export const UserContext = createContext<{
  user: UserType | null;
  setUser: (u: UserType | null) => void;
}>({ user: null, setUser: () => {} });

const Profile: React.FC = () => {
  const isMobile = useIsMobile();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [mobileForm, setMobileForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [originalAvatar, setOriginalAvatar] = useState<string | null>(null);
  const [localMobileAvatarPreview, setLocalMobileAvatarPreview] = useState<string | null>(null);
  const { setUser } = useContext(UserContext);
  const fadeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Shared fetchProfile
  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      const data = await res.json();
  setProfile(data);
      setMobileForm({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone_number,
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Responsive view switcher with route sync
  useEffect(() => {
    if (!isMobile && location.pathname === '/profile') {
      // Mobile → Desktop: redirect to dashboard and open modal
      navigate('/dashboard', { replace: true });
      setTimeout(() => {
        window.dispatchEvent(new Event('openProfileDesktopModal'));
      }, 10);
    } else if (isMobile && location.pathname !== '/profile') {
      // Only redirect if not already on profile
      if (location.pathname !== '/profile') {
        navigate('/profile', { replace: true });
      }
    }
    // eslint-disable-next-line
  }, [isMobile]);

  return (
    <UserContext.Provider value={{ user: profile, setUser: setProfile }}>
      <div
        className="profile-page"
        style={{
          position: 'relative',
          minHeight: '100vh',
          ...(isMobile ? { overflow: 'hidden' } : {}),
        }}
      >
        {/* Left panel (desktop header) */}
        {!isMobile && <ProfileLeftPanel user={profile} />}
        {/* Fade transition wrapper */}
        <div ref={fadeRef} style={{ transition: 'opacity 0.22s', opacity: 1 }}>
          {/* Mobile view: ProfileMobile always rendered on /profile route */}
          {isMobile && (
            <ProfileMobile
              profile={profile}
              editMode={editMode}
              mobileForm={mobileForm}
              loading={loading}
              errorMsg={errorMsg}
              avatarPreview={avatarPreview}
              showAvatarPicker={showAvatarPicker}
              defaultAvatars={defaultAvatars}
              setEditMode={setEditMode}
              setMobileForm={setMobileForm}
              setAvatarPreview={setAvatarPreview}
              setShowAvatarPicker={setShowAvatarPicker}
              onUpdate={async (e, closeModal) => {
                e.preventDefault();
                setLoading(true);
                setErrorMsg('');
                try {
                  const avatarToSend = localMobileAvatarPreview || originalAvatar || avatarPreview || profile?.avatar;
                  await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                      'Content-Type': 'application/json',
                    },
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
                      avatar: avatarToSend,
                    }),
                  });
                  await fetchProfile();
                  setUser(profile);
                  setAvatarPreview(localMobileAvatarPreview || originalAvatar || avatarPreview || profile?.avatar || '');
                  setEditMode(false);
                  setLocalMobileAvatarPreview(null);
                  setOriginalAvatar(null);
                  if (closeModal) closeModal();
                } catch (err) {
                  console.error(err);
                  setErrorMsg('Could not save changes.');
                }
                setLoading(false);
              }}
              originalAvatar={originalAvatar}
              fetchProfile={fetchProfile}
            />
          )}
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default Profile;
