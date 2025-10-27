import React from 'react';
import { Avatar, Button, Stack } from '@mui/material';

// Define the props interface
interface AvatarCircleProps {
  src?: string;
  initials?: string;
  size?: number; // px
  ring?: boolean;
  onChange?: () => void;
  showChangeButton?: boolean;
  changeButtonText?: string;
}

const AvatarCircle: React.FC<AvatarCircleProps> = ({
  src,
  initials,
  size = 100,
  ring = true,
  onChange,
  showChangeButton = false,
  changeButtonText = 'Change Avatar',
}) => {
  // Use MUI's Avatar component, which handles src and initials fallback automatically
  return (
    <Stack spacing={1.5} alignItems="center">
      <Avatar
        src={src || undefined} // Pass undefined (not empty string) if src is falsy
        alt="Avatar"
        sx={{
          width: size,
          height: size,
          // Handle ring with a border and box-sizing
          border: ring ? '4px solid' : 'none',
          borderColor: 'background.paper', // Use theme color
          boxShadow: 3, // Use theme shadow
          // Handle initials fallback styling
          bgcolor: 'primary.main', // Use theme color for background
          color: 'primary.contrastText',
          fontWeight: 700,
          fontSize: Math.round(size / 2.8), // Keep your font sizing logic
        }}
      >
        {/* Children are used as a fallback if src is missing/fails to load */}
        {initials || ''}
      </Avatar>

      {showChangeButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={onChange}
          sx={{ fontWeight: 600, fontSize: '1rem', px: 3, py: 1 }}
        >
          {changeButtonText}
        </Button>
      )}
    </Stack>
  );
};

export default AvatarCircle;
