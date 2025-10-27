import React from 'react';
import '../styles/shimmer.css';

interface ShimmerValueProps {
  width?: string;
  height?: string;
  className?: string;
}

const ShimmerValue: React.FC<ShimmerValueProps> = ({ width = '100%', height = '1.6em', className = '' }) => (
  <div
    className={`shimmer-value ${className}`}
    style={{ width, height, borderRadius: '6px' }}
    aria-label="loading"
  />
);

export default ShimmerValue;
