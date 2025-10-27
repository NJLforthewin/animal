import React, { useEffect, useContext } from 'react'; // useState removed
// import Header from '../components/Header'; // Header is removed from here
import AccountThreePanelLayout from '../components/AccountThreePanelLayout';
// Removed unused useNavigate import
import { UserContext } from './Profile'; // Import UserContext if needed for user data

const ProfileDesktopPage: React.FC = () => {
  // Use user from context instead of fetching locally if MainLayout provides it
  const { user, setUser } = useContext(UserContext); 
  // Removed unused variable 'navigate'
  // isDesktop check might be redundant if Profile.tsx already handles mobile/desktop split
  // Removed unused variable 'isDesktop' and its setter

  // Removed local fetchUser useEffect - assuming user comes from context via Profile.tsx parent

  // Removed unused function 'handleNavigate'

  useEffect(() => {
  // Removed unused setIsDesktop in handleResize
  // Removed unused handleResize references
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
