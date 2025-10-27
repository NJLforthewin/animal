import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Avatar,
  Badge, // For the edit icon on the avatar
  IconButton,
  // Grid, // Removed Grid
  CircularProgress,
} from '@mui/material';

// Import a relevant icon
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// Assuming AvatarPicker is a component you have
// We won't style it, but we'll place it correctly
import AvatarPicker from './AvatarPicker';
interface ProfilePanelProps {
  editFields: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar?: string;
  };
  editMode: boolean;
  avatarEditMode: boolean;
  avatarPreview: string | null;
  isDirty: boolean;
  isLoading?: boolean; // Added for save loading state
  setEditMode: (mode: boolean) => void;
  setAvatarEditMode: (mode: boolean) => void;
  setAvatarPreview: (url: string | null) => void;
  handleSave: () => void;
  setEditFields: (fields: ProfilePanelProps['editFields']) => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({
  editFields,
  editMode,
  avatarEditMode,
  avatarPreview,
  setEditMode,
  setAvatarEditMode,
  setAvatarPreview,
  handleSave,
  setEditFields,
  isDirty,
  isLoading,
}) => {

  const handleCancelEdit = () => {
    setEditMode(false);
    setAvatarEditMode(false);
    setAvatarPreview(null);
    // We might need a 'resetFields' function here if 'editFields'
    // shouldn't persist changes after cancelling
  };

  const currentAvatar = avatarPreview !== null ? avatarPreview : editFields.avatar || '/Logo.png';

  return (
    <> {/* Use Fragment to return multiple top-level elements */}
      <Box sx={{
        width: '100%',
        maxWidth: 800, // Consistent max-width
        mx: 'auto',     // Consistent centering
        p: { xs: 2, md: 3 } // Consistent padding
      }}>
        
        {/* MAIN HEADING */}
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight="600">
            Account Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and avatar.
          </Typography>
        </Stack>

        {/* Main stack for all settings cards */}
        <Stack spacing={4}>

          {/* SECTION: Profile Details */}
          <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Stack spacing={2} alignItems="center">
              
              {/* Section Header */}
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1, alignSelf: 'flex-start' }}>
                <PersonIcon color="action" />
                <Typography variant="h6" component="h2" fontWeight="600">
                  Profile Details
                </Typography>
              </Stack>

              {/* Avatar */}
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  editMode && !avatarEditMode ? (
                    <IconButton
                      aria-label="Change Avatar"
                      onClick={() => setAvatarEditMode(true)}
                      sx={{ backgroundColor: 'background.paper', border: '1px solid #ddd' }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  ) : null
                }
              >
                <Avatar
                  src={currentAvatar}
                  alt="Avatar"
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    fontSize: '4rem', // For fallback text
                    border: '2px solid',
                    borderColor: 'divider' 
                  }}
                >
                  {/* Fallback if no image src */}
                  {editFields.first_name ? editFields.first_name[0] : ''}
                </Avatar>
              </Badge>

              {/* ----- FIX: Removed the inline Avatar Picker from here ----- */}
              
              {/* Edit Mode Form */}
              {editMode ? (
                <Stack spacing={2} sx={{ pt: 2, width: '100%', maxWidth: 600 }}>
                  {/* Row 1 */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="First Name"
                      value={editFields.first_name || ''}
                      onChange={e => setEditFields({ ...editFields, first_name: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Last Name"
                      value={editFields.last_name || ''}
                      onChange={e => setEditFields({ ...editFields, last_name: e.target.value })}
                      fullWidth
                    />
                  </Stack>
                  {/* Row 2 */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      label="Email"
                      type="email"
                      value={editFields.email || ''}
                      onChange={e => setEditFields({ ...editFields, email: e.target.value })}
                      fullWidth
                    />
                    <TextField
                      label="Phone Number"
                      value={editFields.phone || ''}
                      onChange={e => setEditFields({ ...editFields, phone: e.target.value })}
                      placeholder="(Optional)"
                      fullWidth
                    />
                  </Stack>
                </Stack>
              ) : (
                // View Mode Info
                <Stack alignItems="center" spacing={0.5}>
                  <Typography variant="h5" fontWeight="600">
                    {editFields.first_name || ''} {editFields.last_name || ''}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {editFields.email}
                  </Typography>
                </Stack>
              )}

              {/* Action Buttons */}
              <Stack 
                direction={{ xs: 'column-reverse', sm: 'row' }} 
                spacing={2} 
                sx={{ pt: 2, width: '100%', maxWidth: 600 }}
                justifyContent="flex-end"
              >
                {editMode ? (
                  <>
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handleCancelEdit}
                      startIcon={<CancelIcon />}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                      disabled={!isDirty || isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditMode(true)}
                    startIcon={<EditIcon />}
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-end' } }}
                  >
                    Manage Profile
                  </Button>
                )}
              </Stack>
              
            </Stack>
          </Paper>
        </Stack>
      </Box>

      <AvatarPicker
        open={avatarEditMode}
        defaultAvatars={[
          '/avatars/avatar1.png',
          '/avatars/avatar2.png',
          '/avatars/avatar3.png',
          '/avatars/avatar4.png',
          '/avatars/avatar5.png',
          '/avatars/avatar6.png'
        ]}
        avatarPreview={avatarPreview ?? (editFields.avatar ?? null)}
        setAvatarPreview={url => setAvatarPreview(url)}
        setShowAvatarPicker={show => { if (!show) setAvatarEditMode(false); }}
        onConfirm={() => { setAvatarEditMode(false); }}
      />
    </>
  );
};

export default ProfilePanel;

