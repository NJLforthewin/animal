import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/Profile';
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
    const handleSidebarExpand = (expanded: boolean) => setSidebarExpanded(expanded);
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
                        <Route path="/dashboard" element={<Dashboard sidebarExpanded={sidebarExpanded} setSidebarExpanded={handleSidebarExpand} />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/history" element={<HistoryPage sidebarExpanded={sidebarExpanded} setSidebarExpanded={handleSidebarExpand} />} />
                        <Route path="/location" element={<LocationPage sidebarExpanded={sidebarExpanded} setSidebarExpanded={handleSidebarExpand} />} />
                        <Route path="/sensor" element={<SensorPage sidebarExpanded={sidebarExpanded} setSidebarExpanded={handleSidebarExpand} />} />
                    </Route>
                    <Route path="*" element={<div>404 - Page Not Found</div>} />
                </Routes>
            </Router>           
        </ErrorBoundary>
    );
};

export default App;