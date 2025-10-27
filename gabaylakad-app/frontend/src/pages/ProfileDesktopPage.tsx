import React, { useEffect, useState, useContext } from 'react'; // Added useContext
// import Header from '../components/Header'; // Header is removed from here
import AccountThreePanelLayout from '../components/AccountThreePanelLayout';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Profile'; // Import UserContext if needed for user data

const ProfileDesktopPage: React.FC = () => {
  // Use user from context instead of fetching locally if MainLayout provides it
  const { user, setUser } = useContext(UserContext); 
  const navigate = useNavigate();
  // isDesktop check might be redundant if Profile.tsx already handles mobile/desktop split
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 430); 

  // Removed local fetchUser useEffect - assuming user comes from context via Profile.tsx parent

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Removed isDesktop check if Profile.tsx handles the switch
  return (
    <>
      <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 'calc(100vh - 64px)', // Example: Assuming 64px header height 
          paddingTop: '20px' // Add some padding if needed 
      }}>
        {/* Pass user and setUser from context (or props if Profile.tsx passes them down) */}
        <AccountThreePanelLayout user={user} setUser={setUser} />
      </div>
    </>
  );
};

export default ProfileDesktopPage;
