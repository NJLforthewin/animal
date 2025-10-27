import React from 'react';
import { Paper, Stack, TextField, Typography } from '@mui/material';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          Date Range:
        </Typography>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Stack>
    </Paper>
  );
};

export default DateRangePicker;
