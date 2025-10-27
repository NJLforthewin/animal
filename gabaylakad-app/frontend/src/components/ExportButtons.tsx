import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material'; // Import MUI components
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Standard icon for export/download

interface ActivityLogItem {
  // Assuming structure based on DashboardActivityLogCard
  event_type?: string;
  action?: string;
  activity_type?: string;
  timestamp?: string;
  date?: string;
  payload?: { steps?: number };
  // Add other potential fields if needed
  title?: string;  // Fallback if specific fields aren't present
  details?: string; // Fallback
  time?: string;   // Fallback
}

interface ExportProps {
  activityLog: ActivityLogItem[];
}

// Helper to get consistent data for export
const getActivityData = (item: ActivityLogItem): { title: string, details: string, time: string } => {
    const title = item.event_type || item.action || item.activity_type || item.title || 'Unknown Event';
    const details = item.payload?.steps !== undefined ? `Steps: ${item.payload.steps}` : item.details || '';
    const time = item.timestamp || item.date || item.time || 'No timestamp';
    return { title, details, time };
};


// Export activity log as CSV
export const exportCSV = (activityLog: ActivityLogItem[]) => {
  const csvRows = [
    ['Event', 'Details', 'Time'], // Updated headers
    ...activityLog.map(item => {
        const { title, details, time } = getActivityData(item);
        // Escape commas in fields
        const escape = (str: string) => `"${String(str || '').replace(/"/g, '""')}"`;
        return [escape(title), escape(details), escape(time)];
    }),
  ];
  const csvContent = "\uFEFF" + csvRows.map(row => row.join(',')).join('\n'); // Add BOM for Excel compatibility
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'activity-log.csv';
  document.body.appendChild(a); // Append anchor to body for Firefox compatibility
  a.click();
  document.body.removeChild(a); // Clean up anchor
  window.URL.revokeObjectURL(url);
};

// Export activity log as PDF
export const exportPDF = (activityLog: ActivityLogItem[]) => {
  const doc = new jsPDF();
  doc.text('Activity Log', 14, 16);
  autoTable(doc, {
    head: [['Event', 'Details', 'Time']], // Updated headers
    body: activityLog.map(item => {
        const { title, details, time } = getActivityData(item);
        return [title, details, time];
    }),
    startY: 24,
  });
  doc.save('activity-log.pdf');
};

const ExportButtons: React.FC<ExportProps> = ({ activityLog }) => {
  const navigate = useNavigate();

  const handleExportCSV = () => {
    exportCSV(activityLog);
    // navigate('/some-route'); // Navigation seems out of place here, remove unless specifically needed after export
  };

  const handleExportPDF = () => {
    exportPDF(activityLog);
    // navigate('/some-route'); // Navigation seems out of place here
  };


  return (
    // Use Stack for layout
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportCSV}
        sx={{
            // Example custom gradient (optional, consider using theme colors)
             background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
             color: 'white',
             '&:hover': {
                 background: 'linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)',
             }
        }}
      >
        Export CSV
      </Button>
      <Button
        variant="contained"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportPDF}
         sx={{
             // Example custom gradient (optional)
             background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
             color: 'white',
              '&:hover': {
                  background: 'linear-gradient(90deg, #f857a6 0%, #ff5858 100%)',
              }
         }}
      >
        Export PDF
      </Button>
    </Stack>
  );
};

export default ExportButtons;
