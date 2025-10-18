import React from 'react';
import HeaderDesktop from '../components/headerDesktop';

interface ProfileLeftPanelProps {
  user: any;
}

const ProfileLeftPanel: React.FC<ProfileLeftPanelProps> = ({ user }) => {
  return (
    <div className="profile-left-panel">
      <HeaderDesktop user={user} />
      {/* Add more left panel content here if needed */}
    </div>
  );
};

export default ProfileLeftPanel;
