import React from 'react';
import useIsMobile from './useIsMobile';

const MobileView: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children }) => {
  const isMobile = useIsMobile();
  return isMobile ? <>{children}</> : null;
};

export default MobileView;
