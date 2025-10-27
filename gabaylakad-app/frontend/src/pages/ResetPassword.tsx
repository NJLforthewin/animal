import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Import the "design" component
import ResetPasswordForm, { ResetPasswordFormProps } from '../components/ResetPasswordForm'; // Adjust path if needed

// This is your page component
const ResetPassword: React.FC = () => {
    // --- All State and Logic Lives Here ---
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Get the token from the URL (e.g., /reset-password?token=...)
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Event Handlers ---
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleGoToLogin = () => navigate('/');

    // --- Submit Handler (with the API call) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password.length < 8) {
             setErrorMsg('Password must be at least 8 characters long.');
             return;
        }

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match.');
            return;
        }

        if (!token) {
            setErrorMsg('Invalid or missing reset token. Please request a new link.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resetToken: token,
                    newPassword: password,
                }),
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error("Server sent an unexpected response. (Not JSON)");
            }

            const data = await response.json();
            
            if (response.ok) {
                setSuccessMsg('Password reset successful! Redirecting to login...');
                setTimeout(() => {
                    navigate('/'); // Use navigate for SPA routing
                }, 3000); // 3 seconds delay
            } else {
                setErrorMsg(data.message || 'Password reset failed.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Bundle all state and handlers into a props object
    const formProps: ResetPasswordFormProps = {
        password,
        confirmPassword,
        showPassword,
        showConfirmPassword,
        successMsg,
        errorMsg,
        loading,
        handleSubmit,
        handleGoToLogin,
        handleClickShowPassword,
        handleClickShowConfirmPassword,
        handleMouseDownPassword,
        setPassword,
        setConfirmPassword
    };

    // Render the "dumb" form component and pass it all the props
    return <ResetPasswordForm {...formProps} />;
};

export default ResetPassword;

