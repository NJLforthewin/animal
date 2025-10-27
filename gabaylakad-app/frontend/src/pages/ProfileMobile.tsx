import React, { useState, useEffect } from 'react';
// import '../styles/profile-mobile.css'; // Removed, styles are inline with MUI
import {
  Box,
  Paper,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Avatar,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  // Grid, // Removed Grid
  TextField,
  Switch,
  Typography,
} from '@mui/material';

// Import MUI Icons
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonalInjuryIcon from '@mui/icons-material/PersonalInjury';
import LanguageIcon from '@mui/icons-material/Language';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Assuming these are custom, complex modals
import SecurityModal from '../components/SecurityModal';
import ProfileModal from '../components/ProfileModal';

// We replace BaseModal and AvatarCircle with MUI components

interface ProfileMobileProps {
  profile: any;
  editMode: boolean;
  mobileForm: any;
  loading: boolean;
  errorMsg: string;
  avatarPreview: string | null;
  showAvatarPicker: boolean;
  defaultAvatars: string[];
  setEditMode: (edit: boolean) => void;
  setMobileForm: (form: any) => void;
  setAvatarPreview: (url: string | null) => void; // Allow null
  setShowAvatarPicker: (show: boolean) => void;
  onUpdate: (e: React.FormEvent, closeModal?: () => void) => Promise<void>;
  originalAvatar: string | null;
  fetchProfile: () => Promise<void>; // <-- add this
}


const ProfileMobile: React.FC<ProfileMobileProps> = ({
  profile,
  editMode,
  mobileForm,
  loading,
  errorMsg,
  avatarPreview,
  showAvatarPicker,
  defaultAvatars,
  setEditMode,
  setMobileForm,
  setAvatarPreview,
  setShowAvatarPicker,
  onUpdate,
  originalAvatar,
  fetchProfile
}) => {
  // Modal state
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);

  // Local avatar state for ProfileModal preview
  const [profileModalAvatar, setProfileModalAvatar] = useState<string | null>(null);

  useEffect(() => {
    // Sync local avatar preview when prop changes
    setProfileModalAvatar(avatarPreview || profile?.avatar || defaultAvatars[0]);
  }, [avatarPreview, profile, defaultAvatars]);

  // Navigation items with MUI icons
  const navItems = [
    { label: 'Account', isLabel: true },
    { label: 'Profile', icon: <ManageAccountsIcon />, onClick: () => {
      setProfileModalAvatar(avatarPreview || profile?.avatar || defaultAvatars[0]);
      setShowProfileModal(true);
    } },
    { label: 'Patient Information', icon: <PersonalInjuryIcon />, onClick: () => {
      setShowPatientModal(true);
    } },
    { label: 'Device Information', icon: <PhonelinkIcon />, onClick: () => {
      setShowDeviceModal(true);
    } },
    { label: 'Preferences', isLabel: true },
    { label: 'Language', icon: <LanguageIcon />, onClick: () => {/* language logic */} },
    { label: 'Dark Mode', icon: <Brightness4Icon />, onClick: () => {/* dark mode logic */}, isToggle: true },
    { label: 'Settings', isLabel: true },
    { label: 'Security', icon: <LockIcon />, onClick: () => {
      setShowSecurityModal(true);
    } },
    { label: 'Notifications', icon: <NotificationsIcon />, onClick: () => {/* notifications logic */} },
  ];

  const currentAvatar = avatarPreview || profile?.avatar || defaultAvatars[0];

  const handleCancelAvatar = () => {
    setShowAvatarPicker(false);
    setAvatarPreview(originalAvatar || profile?.avatar || null);
    setProfileModalAvatar(originalAvatar || profile?.avatar || null);
  };

  return (
    <Box sx={{ minHeight: '100vh', overflow: 'hidden', bgcolor: 'grey.50' }}>
      {/* Avatar section */}
      <Stack alignItems="center" sx={{ pt: 4, pb: 2 }}>
        {/* ----- FIX: Removed the Badge/IconButton from here -----
          The edit pencil icon should only be *inside* the ProfileModal,
          not on this main page avatar.
        */}
        <Avatar
          src={currentAvatar}
          alt="Avatar"
          sx={{
            width: 100,
            height: 100,
            border: '2px solid',
            borderColor: 'divider'
          }}
        />
        {/* ----- END FIX ----- */}
      </Stack>

      {/* Avatar Picker Modal (Refactored BaseModal) */}
      <Dialog 
        open={showAvatarPicker} 
        onClose={() => setShowAvatarPicker(false)} 
        fullWidth 
        maxWidth="xs"
        // ----- FIX: Added zIndex to appear on top of ProfileModal -----
        sx={{ zIndex: 10000 }} 
      >
        <DialogTitle>Choose Your Avatar</DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ pt: 1 }}>
            {/* Preview Section */}
            <Stack alignItems="center" spacing={1}>
              <Typography variant="caption" color="text.secondary">Preview</Typography>
              <Avatar
                src={profileModalAvatar || avatarPreview || defaultAvatars[0]}
                alt="Avatar Preview"
                sx={{
                  width: 80,
                  height: 80,
                  border: '3px solid',
                  borderColor: 'primary.main',
                }}
              />
            </Stack>
            
            {/* Avatar Selection Grid (Replaced Grid with Stack) */}
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              flexWrap="wrap" // Allow wrapping
            >
              {defaultAvatars.map((url, idx) => (
                <Avatar
                  key={idx}
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  sx={{
                    width: 64,
                    height: 64,
                    border: '3px solid',
                    borderColor: (profileModalAvatar || avatarPreview) === url ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onClick={() => {
                    setAvatarPreview(url);
                    setProfileModalAvatar(url);
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelAvatar} color="inherit">Cancel</Button>
          <Button onClick={() => setShowAvatarPicker(false)} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>


      {/* Navigation */}
      <Paper elevation={2} sx={{ maxWidth: 380, mx: 'auto', borderRadius: 3, p: 1 }}>
        <List component="nav">
          {navItems.map((item, idx) => (
            item.isLabel ? (
              <ListSubheader key={idx} sx={{ bgcolor: 'transparent' }}>
                {item.label}
              </ListSubheader>
            ) : item.isToggle ? (
              <ListItem key={idx}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
                <Switch edge="end" onChange={item.onClick} />
              </ListItem>
            ) : (
              <ListItemButton key={idx} onClick={item.onClick} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          ))}
        </List>
      </Paper>

      {/* Profile Modal (External) */}
      <ProfileModal
        open={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setProfileEditMode(false);
          setProfileModalAvatar(null);
        }}
        profile={profile}
        avatar={profileModalAvatar || avatarPreview || profile?.avatar || defaultAvatars[0]}
        onAvatarClick={() => setShowAvatarPicker(true)}
        isEditing={profileEditMode}
        onEditToggle={() => {
          if (profileEditMode) {
            setMobileForm({
              first_name: profile?.first_name || '',
              last_name: profile?.last_name || '',
              email: profile?.email || '',
              phone: profile?.phone_number || '',
            });
          }
          setProfileEditMode((v) => !v);
        }}
        form={mobileForm}
        setForm={setMobileForm}
        loading={loading}
        errorMsg={errorMsg}
        onUpdate={async (e, closeModal) => {
          await onUpdate(e, closeModal);
          setProfileEditMode(false);
          setProfileModalAvatar(null);
        }}
        zIndex={9999}
      />

      {/* Patient Information Modal (Refactored BaseModal) */}
      <Dialog open={showPatientModal} onClose={() => setShowPatientModal(false)} fullWidth maxWidth="xs">
        <DialogTitle>Patient Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              value={profile?.blind_full_name || '-'}
              fullWidth
              disabled
            />
            <TextField
              label="Phone Number"
              value={profile?.blind_phone_number || '-'}
              fullWidth
              disabled
            />
            <TextField
              label="Age"
              value={profile?.blind_age || '-'}
              fullWidth
              disabled
            />
            <TextField
              label="Impairment Level"
              value={profile?.impairment_level || '-'}
              fullWidth
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPatientModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Device Information Modal (Refactored BaseModal) */}
      <Dialog open={showDeviceModal} onClose={() => setShowDeviceModal(false)} fullWidth maxWidth="xs">
        <DialogTitle>Device Information</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Relationship"
              value={profile?.relationship || '-'}
              fullWidth
              disabled
            />
            <TextField
              label="Device Serial Number"
              value={profile?.device_serial_number || '-'}
              fullWidth
              disabled
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeviceModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Security Modal (External) */}
      <SecurityModal open={showSecurityModal} onClose={() => setShowSecurityModal(false)} />
    </Box>
  );
};

export default ProfileMobile;

