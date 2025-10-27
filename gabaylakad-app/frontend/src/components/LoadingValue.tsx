import React from 'react';
import ShimmerValue from './ShimmerValue';

interface LoadingValueProps {
  loading: boolean;
  value: React.ReactNode;
  className?: string;
  title?: string;
  compact?: boolean;
}

const LoadingValue: React.FC<LoadingValueProps> = ({ loading, value, className = '', title, compact = false }) => (
  <div className={className} title={title}>
    <div className="loading-value-inner">
  {loading ? <ShimmerValue width="120px" height="1.2em" /> : value}
    </div>
  </div>
);

export default LoadingValue;
