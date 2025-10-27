import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Box,
  Badge, // Import Badge
} from '@mui/material';

// Import MUI Icons
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

// Define the props interface
interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: any;
  avatar: string;
  onAvatarClick: () => void;
  isEditing: boolean;
  onEditToggle: () => void;
  form: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  setForm: (form: ProfileModalProps['form']) => void;
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
  zIndex,
}) => {
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the onClose function to onUpdate
    onUpdate(e, onClose);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" sx={{ zIndex: zIndex || 1300 }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {isEditing ? 'Edit Profile' : 'Your Profile'}
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ pt: 1 }}>
            
            {/* ----- FIX: Added logic for editMode ----- */}
            {isEditing ? (
              // In EDIT mode, show Badge and make Avatar clickable
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: '50%',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      p: 0.5,
                    }}
                  >
                    <EditIcon color="primary" sx={{ fontSize: 18 }} />
                  </Box>
                }
              >
                <Avatar
                  src={avatar}
                  alt="Profile Avatar"
                  onClick={onAvatarClick} // Make avatar clickable
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    border: '2px solid', 
                    borderColor: 'divider', 
                    cursor: 'pointer' // Show pointer on hover
                  }}
                />
              </Badge>
            ) : (
              // In VIEW mode, just show the Avatar (not clickable)
              <Avatar
                src={avatar}
                alt="Profile Avatar"
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '2px solid', 
                  borderColor: 'divider' 
                }}
              />
            )}
            {/* ----- END FIX ----- */}

            {/* Error Message */}
            {errorMsg && <Alert severity="error" sx={{ width: '100%' }}>{errorMsg}</Alert>}

            {/* Form Fields */}
            {isEditing ? (
              <>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleFormChange}
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleFormChange}
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleFormChange}
                  fullWidth
                  disabled={loading}
                />
                <TextField
                  label="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  fullWidth
                  disabled={loading}
                />
              </>
            ) : (
              // View Mode
              <>
                <TextField
                  label="First Name"
                  value={profile?.first_name || '-'}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Last Name"
                  value={profile?.last_name || '-'}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Email Address"
                  value={profile?.email || '-'}
                  fullWidth
                  disabled
                />
                <TextField
                  label="Phone Number"
                  value={profile?.phone_number || '-'}
                  fullWidth
                  disabled
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          {isEditing ? (
            <>
              <Button onClick={onEditToggle} color="inherit" disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </>
          ) : (
            <Button onClick={onEditToggle} variant="contained" startIcon={<EditIcon />}>
              Edit Profile
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ProfileModal;

