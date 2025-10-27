import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './Profile'; // Adjust path if necessary

// Import the "design" component
import LoginForm, { LoginFormProps } from '../components/LoginForm'; // Adjust path as needed

// This is your main page component
const Login: React.FC = () => {
    // --- All State and Logic Lives Here ---
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    // --- Event Handlers ---
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleGoToRegister = () => navigate('/register');
    const handleGoToForgotPassword = () => navigate('/forgot-password');

    // Placeholder for Google Sign-In
    const handleGoogleSignIn = () => {
        setErrorMsg('Google sign-in is not implemented yet.');
    };

    // --- Submit Handler (with the API call) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!email || !password) {
            setErrorMsg('Please enter both email and password.');
            return;
        }

        setLoading(true);
        try {
            // The API URL is correct here
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error("Server sent an unexpected response. (Not JSON)");
            }
                
            const data = await res.json();
            console.log('[LOGIN DEBUG] Response:', data);

            if (res.ok && data.token) {
                sessionStorage.setItem('token', data.token);
                if (rememberMe) {
                    localStorage.setItem('token', data.token);
                } else {
                    localStorage.removeItem('token');
                }

                console.log('[LOGIN SUCCESS] Token set:', data.token);
                setSuccessMsg('Login successful! Redirecting...');

                // Fetch profile
                try {
                    const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, { 
                        headers: { Authorization: `Bearer ${data.token}` },
                    });
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        setUser(profileData); // Update context
                    } else {
                        console.error("Failed to fetch profile after login");
                    }
                } catch (profileErr) {
                    console.error("Error fetching profile after login:", profileErr);
                }

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);

            } else {
                let message = data.message || 'Login failed! Please check your credentials.';
                if (res.status === 401) {
                    message = 'Invalid email or password.';
                } else if (res.status === 404) {
                     message = 'User not found.';
                }
                setErrorMsg(message);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'Network error occurred. Please try again later.');
            console.error('[LOGIN DEBUG] Network or Parse error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Bundle all state and handlers into a props object
    const formProps: LoginFormProps = {
        email,
        password,
        showPassword,
        rememberMe,
        errorMsg,
        successMsg,
        loading,
        handleSubmit,
        handleGoogleSignIn,
        handleGoToRegister,
        handleGoToForgotPassword,
        handleClickShowPassword,
        handleMouseDownPassword,
        setEmail,
        setPassword,
        setRememberMe,
    };

    // Render the "dumb" form component and pass it all the props
    return <LoginForm {...formProps} />;
};

export default Login;
