import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login handler triggered');
        setErrorMsg('');
        setSuccessMsg('');

        if (!email || !password) {
            setErrorMsg('Please fill in all fields');
            return;
        }

        try {
            console.log('Login handler triggered');
            console.log('Starting login fetch for:', email);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            console.log('Login fetch completed, status:', response.status);
            const data = await response.json();
            console.log('Login response:', data);
            if (response.ok) {
                if (data.token) {
                    console.log('JWT token received:', data.token);
                    sessionStorage.setItem('token', data.token);
                    console.log('Token saved to sessionStorage:', sessionStorage.getItem('token'));
                    setSuccessMsg('Login successful! Redirecting...');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1000);
                } else {
                    setErrorMsg('No token received. Please contact support or try registering again.');
                    console.warn('No token received in login response:', data);
                }
            } else {
                setErrorMsg(data.message || 'Login failed');
                console.error('Login API error:', data);
            }
        } catch (error) {
            setErrorMsg('An error occurred. Please try again later.');
            console.error('Login network error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />
            </div>
            {errorMsg && (
                <div className="error-notification">
                    <span>{errorMsg}</span>
                </div>
            )}
            {successMsg && (
                <div className="success-notification">
                    <span>{successMsg}</span>
                </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Sign in to Dashboard
            </button>
        </form>
    );
}

export default LoginForm;