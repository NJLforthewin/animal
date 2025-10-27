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
  const isProfilePage = location.pathname === '/profile';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {location.pathname !== '/location' && <Header />}
        <main
          className="main-content"
          style={{
            flex: 1,
            width: '100vw',
            position: 'relative',
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
