import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="app-layout" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #b6cfff 100%)', overflowX: 'hidden' }}>
        <Header />
        {/* <Sidebar /> */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </UserContext.Provider>
  );
};

export default MainLayout;
