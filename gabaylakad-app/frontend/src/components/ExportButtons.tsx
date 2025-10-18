import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

interface ActivityLogItem {
  title: string;
  details: string;
  time: string;
  icon: string;
  color: string;
}

interface ExportProps {
  activityLog: ActivityLogItem[];
}

// Export activity log as CSV
export const exportCSV = (activityLog: ActivityLogItem[]) => {
  const csvRows = [
    ['Title', 'Details', 'Time'],
    ...activityLog.map(item => [item.title, item.details, item.time]),
  ];
  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'activity-log.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};

// Export activity log as PDF
export const exportPDF = (activityLog: ActivityLogItem[]) => {
  const doc = new jsPDF();
  doc.text('Activity Log', 14, 16);
  autoTable(doc, {
    head: [['Title', 'Details', 'Time']],
    body: activityLog.map(item => [item.title, item.details, item.time]),
    startY: 24,
  });
  doc.save('activity-log.pdf');
};

const ExportButtons: React.FC<ExportProps> = ({ activityLog }) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <button
        className="btn-primary export-btn"
        style={{
          background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '0.7rem 1.7rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          cursor: 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #5ee7df 0%, #b490ca 100%)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(44,62,80,0.18)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(44,62,80,0.10)';
        }}
        onClick={() => {
          exportCSV(activityLog);
          navigate('/some-route'); // Replace with your desired route
        }}
      >
        <i className="fas fa-file-csv" style={{ fontSize: '1.2em', color: '#ffe082' }}></i>
        Export CSV
      </button>
      <button
        className="btn-primary export-btn"
        style={{
          background: 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(44,62,80,0.10)',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '0.7rem 1.7rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          cursor: 'pointer',
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #f857a6 0%, #ff5858 100%)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(44,62,80,0.18)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #ff9966 0%, #ff5e62 100%)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(44,62,80,0.10)';
        }}
        onClick={() => {
          exportPDF(activityLog);
          navigate('/some-route'); // Replace with your desired route
        }}
      >
        <i className="fas fa-file-pdf" style={{ fontSize: '1.2em', color: '#ffe082' }}></i>
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;
