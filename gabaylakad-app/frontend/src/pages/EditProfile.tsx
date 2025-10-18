import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import AvatarCircle from '../components/AvatarCircle';

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Fetch profile data (simulate API call)
    async function fetchProfile() {
      try {
        // Replace with actual API call
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        });
        const data = await res.json();
        setForm({
          username: data.first_name || '',
          email: data.email || '',
          phone: data.phone_number || '',
          password: ''
        });
        setAvatarUrl(`https://ui-avatars.com/api/?name=${encodeURIComponent(data.first_name || '')}&background=ff867c&color=fff`);
        setProfile(data);
      } catch (err) {
        setErrorMsg('Failed to load profile');
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      // Replace with actual API call
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update profile');
      navigate('/profile');
    } catch (err) {
      setErrorMsg('Could not update profile');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, Open Sans, Roboto, Arial, sans-serif', padding: 0 }}>
      {/* Mobile Header */}
      <Header />
      {/* Header and Avatar */}
      <div style={{ textAlign: 'center', marginTop: 24, fontWeight: 500, color: '#232946', fontSize: '1.08rem' }}>
        <AvatarCircle src={avatarUrl} size={100} showChangeButton={true} changeButtonText="Change Picture" onChange={() => { /* TODO: handle avatar change */ }} />
      </div>
      {/* Edit Form */}
      <form onSubmit={handleUpdate} style={{ maxWidth: 340, margin: '0 auto', marginTop: 32, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <label style={{ fontWeight: 700, color: '#232946', marginBottom: 6, display: 'block' }}>Username</label>
          <input name="username" value={form.username} onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500 }} />
        </div>
        <div>
          <label style={{ fontWeight: 700, color: '#232946', marginBottom: 6, display: 'block' }}>Email I'd</label>
          <input name="email" value={form.email} onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500 }} />
        </div>
        <div>
          <label style={{ fontWeight: 700, color: '#232946', marginBottom: 6, display: 'block' }}>Phone Number</label>
          <input name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500 }} />
        </div>
        <div>
          <label style={{ fontWeight: 700, color: '#232946', marginBottom: 6, display: 'block' }}>Password</label>
          <input name="password" value={form.password} onChange={handleChange} style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 8, border: '1px solid #e0e0e0', fontSize: '1.08rem', fontWeight: 500 }} type="password" />
        </div>
        <button type="submit" disabled={loading} style={{ background: '#232946', color: '#fff', border: 'none', borderRadius: 12, padding: '0.9rem 0', fontWeight: 700, fontSize: '1.13rem', marginTop: 18, cursor: 'pointer' }}>Update</button>
        {errorMsg && <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>}
      </form>
    </div>
  );
};

export default EditProfile;
