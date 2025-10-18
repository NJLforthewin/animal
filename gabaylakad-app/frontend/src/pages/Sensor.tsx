
import React, { useState, useEffect } from 'react';
import HeaderDesktop from '../components/headerDesktop';
// import Header from '../components/Header';
import '../styles/dashboard-main.css';
import useIsMobile from '../components/useIsMobile';

interface SensorPageProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

const SensorPage: React.FC<SensorPageProps> = ({ sidebarExpanded, setSidebarExpanded }) => {
  const [profile, setProfile] = useState<any>(null);
  const isMobile = useIsMobile();

  // Example: fetch user profile if needed
  useEffect(() => {
    // Replace with your actual fetch logic
    setProfile({ name: 'User' });
  }, []);

  return (
    <>
      {/* Desktop: HeaderDesktop, Mobile: mobile header inside container */}
      {!isMobile && <HeaderDesktop user={profile} />}
      {/* Header is now provided by MainLayout for mobile */}
      <main className={sidebarExpanded ? "main-content-expanded" : "main-content-collapsed"}>
        {/* Add sensor data content here */}
      </main>
    </>
  );
}

export default SensorPage;
