import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingValueProps {
  loading: boolean;
  value: React.ReactNode;
  className?: string;
  title?: string;
  compact?: boolean;
}

const LoadingValue: React.FC<LoadingValueProps> = ({ loading, value, className = '', title, compact = false }) => (
  <div className={className} title={title}>
    <div className="loading-value-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
      {loading ? <LoadingSpinner compact={compact} /> : value}
    </div>
  </div>
);

export default LoadingValue;
