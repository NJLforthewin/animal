import React from 'react';
import ProfileDesktop from './ProfileDesktop';
import ProfileMobile from './ProfileMobile';
import AvatarPicker from '../components/AvatarPicker';

interface ProfileRightPanelProps {
  isMobile: boolean;
  profile: any;
  editMode: boolean;
  form: any;
  mobileForm: any;
  loading: boolean;
  errorMsg: string;
  avatarPreview: string | null;
  showAvatarPicker: boolean;
  defaultAvatars: string[];
  setEditMode: (edit: boolean) => void;
  setForm: (form: any) => void;
  setMobileForm: (form: any) => void;
  setAvatarPreview: (avatar: string | null) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onSave: () => Promise<void>;
  onUpdate: (e: React.FormEvent, closeModal?: () => void) => Promise<void>;
  originalAvatar: string | null;
  localProfileAvatarPreview: string | null;
  setLocalProfileAvatarPreview: (avatar: string | null) => void;
  localMobileAvatarPreview: string | null;
  setLocalMobileAvatarPreview: (avatar: string | null) => void;
}

const ProfileRightPanel: React.FC<ProfileRightPanelProps> = ({
  isMobile,
  profile,
  editMode,
  form,
  mobileForm,
  loading,
  errorMsg,
  avatarPreview,
  showAvatarPicker,
  defaultAvatars,
  setEditMode,
  setForm,
  setMobileForm,
  setAvatarPreview,
  setShowAvatarPicker,
  onSave,
  onUpdate,
  originalAvatar,
  localProfileAvatarPreview,
  setLocalProfileAvatarPreview,
  localMobileAvatarPreview,
  setLocalMobileAvatarPreview,
}) => {
  return (
    <div className="profile-right-panel">
      {/* AvatarPicker for desktop */}
      {!isMobile && showAvatarPicker && (
        <AvatarPicker
          defaultAvatars={defaultAvatars}
          avatarPreview={avatarPreview || originalAvatar || profile?.avatar}
          setAvatarPreview={setAvatarPreview}
          setShowAvatarPicker={(show) => {
            if (!show) {
              setAvatarPreview(originalAvatar || profile?.avatar || null);
            }
            setShowAvatarPicker(show);
          }}
          onConfirm={() => {
            setShowAvatarPicker(false);
          }}
        />
      )}
      {!isMobile ? (
        <ProfileDesktop
          profile={profile}
          editMode={editMode}
          form={form}
          loading={loading}
          errorMsg={errorMsg}
          avatarPreview={editMode ? (avatarPreview || originalAvatar || profile?.avatar) : (avatarPreview || profile?.avatar)}
          showAvatarPicker={showAvatarPicker}
          defaultAvatars={defaultAvatars}
          setEditMode={setEditMode}
          setForm={setForm}
          setAvatarPreview={setAvatarPreview}
          setShowAvatarPicker={setShowAvatarPicker}
          onSave={onSave}
        />
      ) : (
        <ProfileMobile
          profile={profile}
          editMode={editMode}
          mobileForm={mobileForm}
          loading={loading}
          errorMsg={errorMsg}
          avatarPreview={editMode ? (localMobileAvatarPreview || originalAvatar || avatarPreview || profile?.avatar) : (avatarPreview || profile?.avatar)}
          showAvatarPicker={showAvatarPicker}
          defaultAvatars={defaultAvatars}
          setEditMode={setEditMode}
          setMobileForm={setMobileForm}
          setAvatarPreview={setLocalMobileAvatarPreview}
          setShowAvatarPicker={setShowAvatarPicker}
          onUpdate={onUpdate}
          originalAvatar={originalAvatar}
        />
      )}
    </div>
  );
};

export default ProfileRightPanel;
