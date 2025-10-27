import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/dashboard-main.css';
import '../styles/profile-mobile.css';
import '../styles/profile-feed-mobile.css';
import ProfileDesktopPage from './ProfileDesktopPage';
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
  phone_number?: string; // Added this field to match your save logic
}

export const UserContext = createContext<{
  user: UserType | null;
  setUser: (u: UserType | null) => void;
}>({ user: null, setUser: () => {} });

const Profile: React.FC = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = 'clip';
      document.documentElement.style.overflow = 'clip';
      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isMobile]);
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
    // No longer need to redirect for desktop
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
        {isMobile ? (
          <div ref={fadeRef} style={{ transition: 'opacity 0.22s', opacity: 1 }}>
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
                  
                  // --- THIS IS THE FIX ---

                  // 1. Create the new profile object *before* sending
                  const newProfileData: UserType = {
                    ...profile, // Start with existing profile data
                    // Add all form fields
                    first_name: mobileForm.first_name || '',
                    last_name: mobileForm.last_name || '',
                    email: mobileForm.email || '',
                    phone_number: mobileForm.phone || '',
                    // Add the new avatar (use avatarPreview if it's set, else keep the old one)
                    avatar: avatarPreview !== null ? avatarPreview : profile?.avatar,
                    
                    // Keep non-editable fields from the original profile
                    relationship: profile?.relationship || '',
                    blind_full_name: profile?.blind_full_name || '',
                    blind_phone_number: profile?.blind_phone_number || '',
                    blind_age: profile?.blind_age || '',
                    impairment_level: profile?.impairment_level || '',
                    device_id: profile?.device_id || '',
                  };

                  // 2. Send the new object to the server
                  await fetch('/api/profile', {
                    method: 'PUT',
                    headers: {
                      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProfileData), // Send the complete new object
                  });

                  // 3. Manually update all states. Do NOT refetch.
                  setProfile(newProfileData); // Update local profile
                  setUser(newProfileData);   // Update global context
                  
                  // --- END OF FIX ---

                  setEditMode(false);
                  setLocalMobileAvatarPreview(null); // Reset this state as in original code
                  setOriginalAvatar(null); // Reset this state as in original code
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
          </div>
        ) : (
          <ProfileDesktopPage />
        )}
      </div>
    </UserContext.Provider>
  );
};

export default Profile;
