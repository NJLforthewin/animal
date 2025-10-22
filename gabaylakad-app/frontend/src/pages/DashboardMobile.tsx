import React from 'react';

// import Header from '../components/Header';
import ExportButtons from '../components/ExportButtons';
import DashboardLocationCard from '../components/DashboardLocationCard';
import DashboardBatteryCard from '../components/DashboardBatteryCard';
import DashboardActivityCard from '../components/DashboardActivityCard';
import DashboardEmergencyCard from '../components/DashboardEmergencyCard';
import DashboardNightReflectorCard from '../components/DashboardNightReflectorCard';
import DashboardActivityLogCard from '../components/DashboardActivityLogCard';
import '../styles/dashboard-main.css';
import '../styles/dashboard-mobile.css';
// ...existing code...

interface DashboardMobileProps {
  user: any;
  data: any;
}


const DashboardMobile: React.FC<DashboardMobileProps> = ({ user, data }) => {
  // Always render the card grid; let each card handle its own loading state
  return (
    <div className="dashboard-mobile-container" style={{ overflowX: 'hidden' }}>
  {/* Header is now provided by MainLayout */}
      <main>
        {/* Profile Card Section */}
  <div className="dashboard-mobile-patient-card">
          {/* Avatar */}
          <div className="dashboard-mobile-avatar">
            <span>{(user?.blind_full_name || '').split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}</span>
          </div>
          {/* Online/Offline Status */}
          <div className="dashboard-mobile-condition" style={{display:'flex',alignItems:'center',gap:8}}>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: user?.isOnline ? '#43ce7b' : '#e74c3c',
                marginRight: 4,
                border: '2px solid #fff',
                boxShadow: '0 0 4px rgba(44,62,80,0.18)'
              }}
              title={user?.isOnline ? 'Online' : 'Offline'}
            ></span>
            <span style={{fontWeight:700}}>{user?.isOnline ? 'Online' : 'Offline'}</span>
          </div>
          {/* Device status */}
          <div className="dashboard-mobile-device-status">
            <i className="fas fa-person-walking-with-cane" style={{ marginRight: 10, fontSize: '1.2em' }}></i>
            Smart Stick #{user?.device_serial_number || '--'} - Connected
          </div>
        </div>
        <hr className="section-divider" />
        {/* Cards Grid - 2 columns, 3 rows */}
        <div className="card-container">
          <DashboardLocationCard deviceId={user?.device_id || ''} />
          <DashboardBatteryCard />
          <DashboardActivityCard />
          <DashboardEmergencyCard />
          <DashboardNightReflectorCard />
        </div>
        {/* Export Buttons above activity log for mobile */}
        <div className="dashboard-mobile-export-buttons" style={{display: 'flex', gap: '1rem', marginBottom: '2rem', marginTop: '2rem'}}>
          <ExportButtons activityLog={data?.activityLog || []} />
        </div>
        {/* Activity Log */}
        <div className="dashboard-mobile-activity-log">
          <DashboardActivityLogCard />
        </div>
      </main>
    </div>
  );
};

export default DashboardMobile;
