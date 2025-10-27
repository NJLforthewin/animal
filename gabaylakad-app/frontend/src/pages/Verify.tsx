import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VerifyForm, { VerifyFormProps } from '../components/VerifyForm'; 

const Verify: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // State
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('Please enter the 6-digit code sent to your email.');
    const [errorMsg, setErrorMsg] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // Get email from URL on component mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email') || '';
        setEmail(emailParam);

        if (!emailParam) {
            setErrorMsg("No email address found. Please start the registration process again.");
        }
    }, [location.search]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setMessage('Verifying...');
        setErrorMsg('');

        if (code.length !== 6 || !email) {
            setErrorMsg("Please enter a valid 6-digit code.");
            setIsVerifying(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error("Server sent an unexpected response. (Not JSON)");
            }

            const data = await res.json();

            if (res.ok) {
                setMessage('Verification successful! You can now log in. Redirecting...');
                setIsVerified(true);
                
                // No auto-login for security. Redirect to login page.
                setTimeout(() => {
                    navigate('/'); // Navigate to Login page
                }, 2000);

            } else {
                setErrorMsg(data.message || 'Verification failed. Please check the code and try again.');
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'A network error occurred. Please try again.');
            console.error('Verify network error:', err);
        } finally {
            setIsVerifying(false);
        }
    };

    // Bundle props for the form component
    const formProps: VerifyFormProps = {
        code,
        message,
        isVerifying,
        isVerified,
        errorMsg,
        handleVerify,
        setCode,
    };

    return <VerifyForm {...formProps} />;
};

export default Verify;
