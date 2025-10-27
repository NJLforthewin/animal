import React from 'react';
import Header from '../components/Header';

interface ProfileLeftPanelProps {
  user: any;
}

const ProfileLeftPanel: React.FC<ProfileLeftPanelProps> = ({ user }) => {
  return (
    <div className="profile-left-panel">
  <Header sx={{ bgcolor: 'background.paper', boxShadow: 1 }} />
      {/* Add more left panel content here if needed */}
    </div>
  );
};

export default ProfileLeftPanel;
