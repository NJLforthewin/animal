import React from 'react';
import useIsMobile from './useIsMobile';

const MobileView: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children }) => {
  const isMobile = useIsMobile();
  if (!isMobile) return null;
  return <>{children}</>;
};

export default MobileView;
