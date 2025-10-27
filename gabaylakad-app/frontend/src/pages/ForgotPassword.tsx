import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ForgotPasswordForm, { ForgotPasswordFormProps } from '../components/ForgotPasswordForm'; // Adjust path

const ForgotPassword: React.FC = () => {
    // --- All State and Logic Lives Here ---
    const [email, setEmail] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- Event Handlers ---
    const handleGoToLogin = () => navigate('/'); // Navigate to your login route

    // --- Submit Handler (with the API call) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMsg('');
        setErrorMsg('');
        setPreviewUrl('');
        setLoading(true);

        if (!email) {
            setErrorMsg('Please enter your email address.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error("Server sent an unexpected response. (Not JSON)");
            }

            const data = await res.json();

            if (res.ok) {
                setSuccessMsg(data.message || 'If your email exists, you will receive a reset link.');
                if (data.previewUrl) {
                    setPreviewUrl(data.previewUrl);
                }
            } else {
                setErrorMsg(data.message || 'Failed to send reset link.');
            }

        } catch (err: any) {
            setErrorMsg(err.message || 'Network error. Please try again later.');
            console.error('Forgot Password error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Bundle all state and handlers into a props object
    const formProps: ForgotPasswordFormProps = {
        email,
        successMsg,
        errorMsg,
        previewUrl,
        loading,
        handleSubmit,
        handleGoToLogin,
        setEmail
    };

    // Render the "dumb" form component and pass it all the props
    return <ForgotPasswordForm {...formProps} />;
};

export default ForgotPassword;
