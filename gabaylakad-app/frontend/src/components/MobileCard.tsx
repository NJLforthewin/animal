import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

interface Field {
  label: string;
  value: React.ReactNode;
}

interface MobileCardProps {
  title: string;
  icon?: React.ReactNode; // Optional icon prop
  fields: Field[];
}

const MobileCard: React.FC<MobileCardProps> = ({ title, icon, fields }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 2, 
        borderRadius: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Typography variant="body2" fontWeight="600" color="text.secondary">
          {title}
        </Typography>
        {icon} {/* Render the icon */}
      </Stack>
      <Stack spacing={1.5} sx={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        {fields.map((f, i) => (
          <Stack key={i} spacing={0.5}>
            <Typography variant="caption" color="text.secondary">
              {f.label}
            </Typography>
            <Typography variant={i === 0 ? "h6" : "body2"} fontWeight={i === 0 ? 600 : 400} noWrap>
              {f.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default MobileCard;
