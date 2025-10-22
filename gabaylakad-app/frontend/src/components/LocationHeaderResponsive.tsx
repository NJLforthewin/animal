import React from 'react';
import LocationHeader from '../components/LocationHeader';
import LocationHeaderMobile from '../components/LocationHeaderMobile';

interface Props {
  user: any;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 430);
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

const LocationHeaderResponsive: React.FC<Props> = ({ user }) => {
  const isMobile = useIsMobile();
  return isMobile ? <LocationHeaderMobile user={user} /> : <LocationHeader user={user} />;
};

export default LocationHeaderResponsive;
