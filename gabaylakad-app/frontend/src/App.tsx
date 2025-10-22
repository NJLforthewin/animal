import Dashboard from './pages/Dashboard';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/Profile';
import ProfileDesktop from './pages/ProfileDesktop';
import HistoryPage from './pages/History';
import LocationPage from './pages/Location';
import SensorPage from './pages/Sensor';
import Verify from './pages/Verify';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditProfile from './pages/EditProfile';

// Error Boundary for catching rendering errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
    constructor(props: any) {
        super(props);




        
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }
    componentDidCatch(error: any, info: any) {
        console.error('ErrorBoundary caught an error:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return <div>Something went wrong: {this.state.error?.message || 'Unknown error'}</div>;
        }
        return this.props.children;
    }
}


const App: React.FC = () => {
    const [sidebarExpanded, setSidebarExpanded] = React.useState(false);
    const [showProfileDesktop, setShowProfileDesktop] = React.useState(false);
    const [profileData, setProfileData] = React.useState<any>(null);
    const [profileForm, setProfileForm] = React.useState<any>({});
    const [editMode, setEditMode] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState('');
    const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
    const [showAvatarPicker, setShowAvatarPicker] = React.useState(false);
    const [defaultAvatars] = React.useState<string[]>([
      '/avatars/avatar1.png',
      '/avatars/avatar2.png',
      '/avatars/avatar3.png',
      '/avatars/avatar4.png',
      '/avatars/avatar5.png',
      '/avatars/avatar6.png',
    ]);

    React.useEffect(() => {
        const handler = () => setShowProfileDesktop(true);
        window.addEventListener('openProfileDesktopModal', handler);
        return () => window.removeEventListener('openProfileDesktopModal', handler);
    }, []);

    // Fetch profile data function for robust cancel
    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            const data = await res.json();
            setProfileData(data);
            setProfileForm(data);
            setAvatarPreview(data.avatar || null);
        } catch (err) {
            setErrorMsg('Could not fetch profile data.');
        }
        setLoading(false);
    };

    // Fetch profile data when modal opens
    React.useEffect(() => {
        if (!showProfileDesktop) return;
        fetchProfile();
    }, [showProfileDesktop]);

    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    {/* Auth and public routes (no persistent layout) */}
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/edit-profile" element={<EditProfile />} />
                    {/* Main app layout (persistent header/sidebar) */}
                    <Route element={<MainLayout />}>
                        <Route path="/dashboard" element={<Dashboard sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/history" element={<HistoryPage sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />} />
                        <Route path="/location" element={<LocationPage />} />
                        <Route path="/sensor" element={<SensorPage sidebarExpanded={sidebarExpanded} setSidebarExpanded={setSidebarExpanded} />} />
                    </Route>
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
                {/* Global ProfileDesktop Modal Overlay */}
                {showProfileDesktop && (
                    <ProfileDesktop
                        profile={profileData}
                        editMode={editMode}
                        form={profileForm}
                        loading={loading}
                        errorMsg={errorMsg}
                        avatarPreview={avatarPreview}
                        showAvatarPicker={showAvatarPicker}
                        defaultAvatars={defaultAvatars}
                        setEditMode={setEditMode}
                        setForm={setProfileForm}
                        setAvatarPreview={setAvatarPreview}
                        setShowAvatarPicker={setShowAvatarPicker}
                        onSave={async () => {
                            setLoading(true); setErrorMsg('');
                            try {
                                await fetch('/api/profile', {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionStorage.getItem('token')}` },
                                    body: JSON.stringify({ ...profileForm, avatar: avatarPreview }),
                                });
                                const res = await fetch('/api/profile', {
                                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                                });
                                const updated = await res.json();
                                setProfileData(updated);
                                setProfileForm(updated);
                                setAvatarPreview(updated.avatar || null);
                                setEditMode(false);
                            } catch (err) {
                                setErrorMsg('Could not save changes.');
                            }
                            setLoading(false);
                        }}
                        fetchProfile={fetchProfile}
                    />
                )}
            </Router>           
        </ErrorBoundary>
    );
};

export default App;