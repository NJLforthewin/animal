import React, { useState } from 'react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);
        try {
            // Use full backend URL for login
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            console.log('[LOGIN DEBUG] Response:', data);
            if (res.ok) {
                if (data.token) {
                    sessionStorage.setItem('token', data.token);
                    setSuccessMsg('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 2000);
                } else {
                    setErrorMsg('No token received. Deep loading...');
                    // Deep loading: try to find token in sessionStorage, localStorage, cookies
                    let foundToken = sessionStorage.getItem('token');
                    if (!foundToken) foundToken = localStorage.getItem('token');
                    if (!foundToken && document.cookie) {
                        const match = document.cookie.match(/token=([^;]+)/);
                        if (match) foundToken = match[1];
                    }
                    if (foundToken) {
                        setSuccessMsg('Token found via deep loading. Redirecting...');
                        sessionStorage.setItem('token', foundToken);
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 2000);
                    } else {
                        setErrorMsg('Token missing after deep loading. Please try again or contact support.');
                        console.error('[LOGIN DEBUG] Deep loading failed. No token found in sessionStorage, localStorage, or cookies.');
                    }
                }
            } else {
                setErrorMsg(data.message || 'Login failed!');
                console.error('[LOGIN DEBUG] Login failed:', data);
            }
        } catch (err) {
            setErrorMsg('Network error!');
            console.error('[LOGIN DEBUG] Network error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        setErrorMsg('Google sign-in not yet implemented.');
    };

    return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
                <div className="max-w-4xl w-full mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left Side - Features */}
                                    <div className="hidden lg:block">
                                        <div className="text-center lg:text-left mb-8">
                                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to GabayLakad</h2>
                                            <p className="text-lg text-gray-600">Secure access to monitor and support your loved one</p>
                                        </div>
                                        <div className="bg-white rounded-xl p-8 shadow-lg">
                                            <div className="space-y-6">
                                                <div className="feature-bullet">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                    <span>Real-time GPS tracking of visually impaired individuals</span>
                                                </div>
                                                <div className="feature-bullet">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                    <span>Emergency alerts with automatic location sharing</span>
                                                </div>
                                                <div className="feature-bullet">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                    <span>24/7 monitoring through comprehensive dashboard</span>
                                                </div>
                                                <div className="feature-bullet">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                    <span>Automatic location logging every 2 minutes</span>
                                                </div>
                                                <div className="feature-bullet">
                                                    <i className="fas fa-check-circle text-xl"></i>
                                                    <span>Secure access with encrypted authentication</span>
                                                </div>
                                            </div>
                                            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <i className="fas fa-shield-alt text-blue-600 text-2xl mt-1"></i>
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900 mb-2">Security First</h4>
                                                        <p className="text-blue-800 text-sm">Your data is protected with industry-standard encryption and secure authentication protocols.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                        {/* Right Side - Login Form */}
                                    <div className="relative">
                                        <div className="login-container relative bg-white">
                                            <div className="p-8">
                                                <div className="text-center mb-6">
                                                    <div className="mb-4">
                                                        <img src="/Logo.png" alt="Company Logo" style={{width: 143, height: 143, margin: '0 auto'}} />
                                                    </div>
                                                </div>
                                                {/* Success Message */}
                                                {successMsg && (
                                                    <div className="success-notification">
                                                        <i className="fas fa-check-circle"></i>
                                                        <span>{successMsg}</span>
                                                    </div>
                                                )}
                                                {/* Error Message */}
                                                {errorMsg && (
                                                    <div className="error-notification">
                                                        <i className="fas fa-exclamation-circle"></i>
                                                        <span>{errorMsg}</span>
                                                    </div>
                                                )}
                                                <form onSubmit={handleSubmit} className="space-y-6">
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Email
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <i className="fas fa-user text-gray-400"></i>
                                                            </div>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                required
                                                                value={email}
                                                                onChange={e => setEmail(e.target.value)}
                                                                className="form-input pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Enter your email"
                                                                autoComplete="username"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                                            Password
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <i className="fas fa-lock text-gray-400"></i>
                                                            </div>
                                                            <input
                                                                id="password"
                                                                name="password"
                                                                type={showPassword ? 'text' : 'password'}
                                                                required
                                                                value={password}
                                                                onChange={e => setPassword(e.target.value)}
                                                                className="form-input pl-10 pr-12 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                placeholder="Enter your password"
                                                                autoComplete="current-password"
                                                            />
                                                            <span className="password-toggle" onClick={() => setShowPassword(v => !v)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',cursor:'pointer'}}>
                                                                <i id="toggleIcon" className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                                                Remember me
                                                            </label>
                                                        </div>
                                                        <div className="text-sm">
                                                            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                                                Forgot password?
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button type="submit" className="btn-primary w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-semibold transition-all" disabled={loading}>
                                                            {loading ? <span className="loading-spinner"></span> : 'Sign in to Dashboard'}
                                                        </button>
                                                    </div>
                                                </form>
                                                <div className="mt-4">
                                                    <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-md font-semibold transition-all">
                                                        <i className="fab fa-google text-lg"></i> Sign in with Google
                                                    </button>
                                                </div>
                                                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                                    <p className="text-sm text-gray-600">
                                                        Don't have an account?{' '}
                                                        <a href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                                            Register now
                                                        </a>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Decorative elements */}
                                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 floating"></div>
                                        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-100 rounded-full opacity-50 floating" style={{animationDelay:'2s'}}></div>
                                        {/* Mobile features */}
                                        <div className="lg:hidden mt-6">
                                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                                <h4 className="font-semibold text-gray-900 mb-4 text-center">Key Features</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <i className="fas fa-map-marker-alt text-blue-600"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Real-time Tracking</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <i className="fas fa-exclamation-triangle text-blue-600"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Emergency Alerts</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <i className="fas fa-history text-blue-600"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Location History</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <i className="fas fa-shield-alt text-blue-600"></i>
                                                        </div>
                                                        <p className="text-xs text-gray-600">Secure Access</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                    </div>
                </div>
            </div>
        );
    };

export default Login;