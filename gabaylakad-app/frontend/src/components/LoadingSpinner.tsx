import React from 'react';
import './loading.css';

const LoadingSpinner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`loading-spinner-container ${compact ? 'compact' : ''}`} role="status" aria-label="loading">
      <div className={`loading-spinner ${compact ? 'compact' : ''}`} aria-hidden="true"></div>
    </div>
  );
};

export default LoadingSpinner;
