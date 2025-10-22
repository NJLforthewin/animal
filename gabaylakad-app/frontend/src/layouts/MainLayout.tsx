import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';
import { UserContext, UserType } from '../pages/Profile';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const location = useLocation();
  const isMobile = window.innerWidth <= 600;
  const isProfileMobile = isMobile && location.pathname === '/profile';
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="app-layout" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #b6cfff 100%)', overflowX: 'hidden' }}>
        {/* Only render Header if not on /location, so overlay header is always used for Location page */}
        {location.pathname !== '/location' && <Header />}
        {/* <Sidebar /> */}
        <main
          className="main-content"
          style={{
            padding: 0,
            margin: 0,
            minHeight: '100vh',
            width: '100vw',
            position: 'relative',
            overflowY: isProfileMobile ? 'hidden' : 'auto',
            background: 'none',
          }}
        >
          <Outlet />
        </main>
      </div>
    </UserContext.Provider>
  );
};

export default MainLayout;
