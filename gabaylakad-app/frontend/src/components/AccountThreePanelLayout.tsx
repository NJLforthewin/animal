import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Skeleton, // Import Skeleton for the loader
} from '@mui/material';

// Import all the panels
import SecuritySettingsPanel from './SecuritySettingsPanel';
import NotificationSettingsPanel from './NotificationSettingsPanel';
import LanguagePreferencePanel from './LanguagePreferencePanel';
import DarkModePanel from './DarkModePanel';
import ProfilePanel from './ProfilePanel';
import PatientInformationPanel from './PatientInformationPanel';
import DeviceInformationPanel from './DeviceInformationPanel';

// Consistent Shimmer loader using MUI Skeleton
function ShimmerLoader() {
  return (
    <Box sx={{ width: '100%', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
      <Skeleton variant="circular" width={220} height={220} />
    </Box>
  );
}

export default function AccountThreePanelLayout({ user, setUser }: { user: any, setUser: (u: any) => void }) {
  // State declarations
  const panel1Options = ['Account', 'Preferences', 'Settings'];
  const panel2Map: Record<string, string[]> = {
    Account: ['Profile', 'Patient Information', 'Device information'],
    Preferences: ['Language', 'Dark mode'],
    Settings: ['Security', 'Notifications'],
  };
  const [selectedPanel1, setSelectedPanel1] = useState('Account');
  const [selectedPanel2, setSelectedPanel2] = useState(panel2Map['Account'][0]);
  const [profile, setProfile] = useState<any>(user || null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [avatarEditMode, setAvatarEditMode] = useState(false);

  // Update local profile when user prop changes
  useEffect(() => {
    if (user) setProfile(user);
  }, [user]);

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    // ... (rest of your handleSave logic is unchanged) ...
    const payload = {
      first_name: editFields.first_name || profile.first_name || '',
      last_name: editFields.last_name || profile.last_name || '',
      phone_number: editFields.phone || profile.phone_number || '',
      email: editFields.email || profile.email || '',
      relationship: profile.relationship || '',
      blind_full_name: profile.blind_full_name || '',
      blind_phone_number: profile.blind_phone_number || '',
      blind_age: profile.blind_age || '',
      impairment_level: profile.impairment_level || '',
      device_id: profile.device_id || '',
      avatar: avatarPreview !== null ? avatarPreview : editFields.avatar || profile.avatar || '',
    };
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      body: JSON.stringify(payload),
    });
    setEditMode(false);
    setAvatarEditMode(false);
    setAvatarPreview(null);
    setIsDirty(false);
    // Refresh profile
    const res = await fetch('/api/profile', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    });
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
      setUser(data); // <-- update global user for dropdown avatar
      setEditFields({
        avatar: data.avatar || '',
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    }
    setLoading(false);
  };

  // Fetch profile on mount
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditFields({
          avatar: data.avatar || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
        });
      }
      setLoading(false);
    })();
  }, []);

  // Track changes for Save button
  useEffect(() => {
    if (!profile) return;
    const changed =
      (avatarPreview !== null && avatarPreview !== (profile.avatar || '')) ||
      editFields.avatar !== (profile.avatar || '') ||
      editFields.first_name !== (profile.first_name || '') ||
      editFields.last_name !== (profile.last_name || '') ||
      editFields.email !== (profile.email || '') ||
      editFields.phone !== (profile.phone || '');
    setIsDirty(changed);
  }, [editFields, avatarPreview, profile]);

  // Debug log (unchanged)
  useEffect(() => {
    if (profile) {
      console.log('[FRONTEND] Profile loaded:', profile);
      console.log('[FRONTEND] Avatar field:', profile.avatar);
    }
  }, [profile]);

  // Panel 3 content rendering
  let panel3Content;
  if (loading || !profile) {
    panel3Content = <ShimmerLoader />;
  } else if (selectedPanel1 === 'Account' && selectedPanel2 === 'Profile') {
    panel3Content = (
      <ProfilePanel
        editFields={editFields}
        editMode={editMode}
        avatarEditMode={avatarEditMode}
        avatarPreview={avatarPreview}
        setEditMode={setEditMode}
        setAvatarEditMode={setAvatarEditMode}
        setAvatarPreview={setAvatarPreview}
        handleSave={handleSave}
        setEditFields={setEditFields}
        isDirty={isDirty}
        isLoading={loading} // Pass loading state to ProfilePanel
      />
    );
  } else if (selectedPanel1 === 'Account' && selectedPanel2 === 'Patient Information') {
    panel3Content = <PatientInformationPanel profile={profile} />;
  } else if (selectedPanel1 === 'Account' && selectedPanel2 === 'Device information') {
    panel3Content = <DeviceInformationPanel profile={profile} />;
  } else if (selectedPanel1 === 'Preferences' && selectedPanel2 === 'Language') {
    panel3Content = <LanguagePreferencePanel />;
  } else if (selectedPanel1 === 'Preferences' && selectedPanel2 === 'Dark mode') {
    panel3Content = <DarkModePanel />;
  } else if (selectedPanel1 === 'Settings' && selectedPanel2 === 'Security') {
    panel3Content = <SecuritySettingsPanel />;
  } else if (selectedPanel1 === 'Settings' && selectedPanel2 === 'Notifications') {
    panel3Content = <NotificationSettingsPanel />;
  }

  // Main three-column layout, refactored with MUI components
  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        width: 1000,
        height: 700,
        minHeight: 700,
        maxHeight: 700,
        m: '0 auto',
        borderRadius: 4, // Consistent border radius
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Panel 1: navigation */}
      <Box
        sx={{
          width: 180,
          backgroundColor: 'grey.50',
          borderRight: '1px solid',
          borderColor: 'divider',
          py: 4,
          px: 2,
        }}
      >
        <List component="nav">
          {panel1Options.map(opt => (
            <ListItemButton
              key={opt}
              selected={selectedPanel1 === opt}
              onClick={() => {
                setSelectedPanel1(opt);
                setSelectedPanel2(panel2Map[opt][0]);
                setEditMode(false);
                setAvatarEditMode(false);
                setAvatarPreview(null);
              }}
              sx={{ borderRadius: 2, mb: 1, textAlign: 'center' }}
            >
              <ListItemText
                primary={opt}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 600,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Panel 2: Sub-navigation */}
      <Box
        sx={{
          width: 220,
          backgroundColor: 'grey.50',
          borderRight: '1px solid',
          borderColor: 'divider',
          py: 4,
          px: 2,
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2.5, px: 2 }}>
          {selectedPanel1}
        </Typography>
        <List component="nav">
          {panel2Map[selectedPanel1].map(opt => (
            <ListItemButton
              key={opt}
              selected={selectedPanel2 === opt}
              onClick={() => {
                setSelectedPanel2(opt);
                setEditMode(false);
                setAvatarEditMode(false);
                setAvatarPreview(null);
              }}
              sx={{ borderRadius: 2, mb: 1 }}
            >
              <ListItemText
                primary={opt}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Panel 3: Content */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto', // Keep this, but removed padding
          p: 0, // FIX: Remove padding to let child panels control it
        }}
      >
        {panel3Content}
      </Box>
    </Paper>
  );
}