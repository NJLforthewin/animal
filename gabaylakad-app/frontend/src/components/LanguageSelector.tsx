import React, { useState } from 'react';
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    Box
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const languages = [
  { code: 'ceb', name: 'Cebuano' },
  { code: 'en', name: 'English' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'fr', name: 'French' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'de', name: 'German' },
  { code: 'ko', name: 'Korean' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ms', name: 'Malay' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'fa', name: 'Persian' },
];

const LanguageSelector: React.FC = () => {
  const [selected, setSelected] = useState('ceb');

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelected(event.target.value);
    // Add logic here to actually change the application language if needed
    console.log('Language changed to:', event.target.value);
  };

  return (
    // Use FormControl for proper label behavior and styling
    <FormControl fullWidth variant="outlined" sx={{ my: 1 }}>
       {/* Use InputLabel for accessibility and floating label effect */}
      <InputLabel id="language-select-label">
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <LanguageIcon fontSize='small' /> Language
           </Box>
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={selected}
        onChange={handleChange}
        // Add label prop matching InputLabel for correct layout
        label={
           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
               <LanguageIcon fontSize='small' /> Language
           </Box>
        }
        // Customize appearance if needed
        sx={{
            '.MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
            }
        }}
        // MenuProps can style the dropdown menu itself
         MenuProps={{
           PaperProps: {
             sx: {
               maxHeight: 300, // Limit dropdown height
             },
           },
         }}
      >
        {languages.map(lang => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
