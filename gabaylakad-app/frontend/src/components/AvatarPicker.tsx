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
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon

// Define the props interface
interface AvatarPickerProps {
  defaultAvatars: string[];
  avatarPreview: string | null;
  setAvatarPreview: (url: string) => void;
  setShowAvatarPicker: (show: boolean) => void;
  onConfirm: () => void;
  open?: boolean; // Make open optional
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  defaultAvatars,
  avatarPreview,
  setAvatarPreview,
  setShowAvatarPicker,
  onConfirm,
  open, // Use 'open' to control the Dialog
}) => {
  const handleCancel = () => {
    setShowAvatarPicker(false);
    // Note: We might want to reset the preview to the original avatar here
    // but we'd need the original avatar prop.
  };

  const handleConfirm = () => {
    onConfirm();
    setShowAvatarPicker(false);
  };

  return (
    <Dialog
      open={open ?? false} // Default to false if open is undefined
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      sx={{ zIndex: 10001 }} // Ensure it appears above other modals if needed
    >
      {/* FIX: Removed the nested <Typography component="h2">.
        We apply styling directly to DialogTitle and add a close button.
      */}
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 600 }}>
        Choose Your Avatar
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers> {/* 'dividers' adds top/bottom borders */}
        <Stack spacing={3} alignItems="center" sx={{ pt: 1 }}>
          {/* Preview Section */}
          <Stack alignItems="center" spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Preview
            </Typography>
            <Avatar
              src={avatarPreview || defaultAvatars[0]}
              alt="Avatar Preview"
              sx={{
                width: 80,
                height: 80,
                border: '3px solid',
                borderColor: 'primary.main',
                objectFit: 'cover',
              }}
            />
          </Stack>

          {/* Avatar Selection */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2, // Use theme spacing
              justifyContent: 'center',
            }}
          >
            {defaultAvatars.map((url, idx) => (
              <IconButton key={idx} onClick={() => setAvatarPreview(url)}>
                <Avatar
                  src={url}
                  alt={`Avatar ${idx + 1}`}
                  sx={{
                    width: 64,
                    height: 64,
                    border: '3px solid',
                    borderColor: avatarPreview === url ? 'primary.main' : 'divider',
                    cursor: 'pointer',
                    objectFit: 'cover',
                    transition: 'border-color 0.2s',
                  }}
                />
              </IconButton>
            ))}
          </Box>
        </Stack>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AvatarPicker;

