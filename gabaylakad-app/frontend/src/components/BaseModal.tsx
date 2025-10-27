import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Define the props interface
interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  zIndex?: number;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // Allow setting max width
}

const BaseModal: React.FC<BaseModalProps> = ({
  open,
  onClose,
  children,
  title,
  zIndex,
  maxWidth = 'xs', // Default to 'xs' for mobile-first modals
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      sx={{
        zIndex: zIndex || 1300, // Use theme's modal z-index or provided one
        '& .MuiDialog-paper': {
          borderRadius: 3, // Consistent border radius
        },
      }}
    >
      {/* Render title and close button */}
      {title && (
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" component="h2" fontWeight="600">
            {title}
          </Typography>
          <IconButton onClick={onClose} aria-label="Close" sx={{ ml: 2 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      
      {/* Render children content */}
      <DialogContent sx={{ pt: title ? 1 : 3 }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
