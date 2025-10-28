import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm, { RegisterFormProps } from '../components/RegisterForm'; 

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [relationship, setRelationship] = useState('');
    const [otherRelationship, setOtherRelationship] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userFullName, setUserFullName] = useState('');
    const [userAge, setUserAge] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [impairmentLevel, setImpairmentLevel] = useState('');
    const [terms, setTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const apiUrl = process.env.REACT_APP_API_URL;
    const validateEmailInline = async (val: string) => {
        setEmail(val);
        setErrors((prev) => ({ ...prev, email: '' }));
        if (!isEmailValid(val)) {
            setErrors((prev) => ({ ...prev, email: 'Invalid email format' }));
            return;
        }
        try {
            const res = await fetch(`${apiUrl}/api/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: val })
            });
            const data = await res.json();
            if (!data.valid) {
                setErrors((prev) => ({ ...prev, email: data.message }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, email: 'Error checking email' }));
        }
    };

    const validatePhoneInline = async (val: string) => {
        setPhoneNumber(val);
        setErrors((prev) => ({ ...prev, phoneNumber: '' }));
        if (!isPhoneValid(val)) {
            setErrors((prev) => ({ ...prev, phoneNumber: 'Must be 11 digits' }));
            return;
        }
        try {
            const res = await fetch(`${apiUrl}/api/auth/check-phone`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: val })
            });
            const data = await res.json();
            if (!data.valid) {
                setErrors((prev) => ({ ...prev, phoneNumber: data.message }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, phoneNumber: 'Error checking phone number' }));
        }
    };

    const validateSerialInline = async (val: string) => {
        setSerialNumber(val);
        setErrors((prev) => ({ ...prev, serialNumber: '' }));
        if (!val) {
            setErrors((prev) => ({ ...prev, serialNumber: 'Device serial number is required' }));
            return;
        }
        try {
            const res = await fetch(`${apiUrl}/api/auth/check-serial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serial_number: val })
            });
            const data = await res.json();
            if (!data.valid) {
                setErrors((prev) => ({ ...prev, serialNumber: data.message }));
            }
        } catch (err) {
            setErrors((prev) => ({ ...prev, serialNumber: 'Error checking serial number' }));
        }
    };
    const navigate = useNavigate();

    // --- Validation Helpers ---
    const isPhoneValid = (num: string) => /^\d{11}$/.test(num);
    const isAgeValid = (age: string) => {
        const n = Number(age);
        return !isNaN(n) && n >= 1 && n <= 120;
    };
    const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // --- Event Handlers ---
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const handleGoToLogin = () => navigate('/');
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!firstName) newErrors.firstName = 'First name is required';
        if (!lastName) newErrors.lastName = 'Last name is required';
        if (!phoneNumber) newErrors.phoneNumber = 'Caregiver phone number is required';
        else if (!isPhoneValid(phoneNumber)) newErrors.phoneNumber = 'Must be 11 digits';
        if (!email) newErrors.email = 'Email is required';
        else if (!isEmailValid(email)) newErrors.email = 'Invalid email format';
        if (!relationship) newErrors.relationship = 'Relationship is required';
        if (relationship === 'Other' && !otherRelationship) newErrors.otherRelationship = 'Please specify relationship';
        if (!serialNumber) newErrors.serialNumber = 'Device serial number is required';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
        else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!userFullName) newErrors.userFullName = 'Full name of person to monitor is required';
        if (!userAge) newErrors.userAge = 'Age is required';
        else if (!isAgeValid(userAge)) newErrors.userAge = 'Enter age between 1 and 120';
        if (userPhoneNumber && !isPhoneValid(userPhoneNumber)) newErrors.userPhoneNumber = 'Must be 11 digits';
        if (!impairmentLevel) newErrors.impairmentLevel = 'Impairment level is required';
        if (!terms) newErrors.terms = 'You must agree to the terms';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --- Submit Handler (with the API call) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!validateForm()) {
            setErrorMsg("Please fix the errors in the form.");
            return;
        }

        setLoading(true);
        const rel = relationship === 'Other' && otherRelationship ? otherRelationship : relationship;

        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName, lastName, password, email,
                    phone_number: phoneNumber, impairment_level: impairmentLevel,
                    serial_number: serialNumber, relationship: rel,
                    blind_full_name: userFullName, blind_age: parseInt(userAge),
                    blind_phone_number: userPhoneNumber || null
                }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                 throw new Error("Server sent an unexpected response. (Not JSON)");
            }

            const data = await res.json();
            console.log('Register response:', data);

            if (res.ok) {
                setSuccessMsg(`Registration successful! Device Serial: ${data.serial_number || serialNumber}. Redirecting...`);
                if (data.token) { // If backend auto-verifies and sends token
                    sessionStorage.setItem('token', data.token);
                    setTimeout(() => navigate('/dashboard'), 2000);
                } else { // Redirect to verification page
                    setTimeout(() => navigate(`/verify?email=${encodeURIComponent(email)}`), 2000);
                }
            } else {
                let specificError = data.message || 'Registration failed!';
                if (data.message && data.message.toLowerCase().includes('already assigned')) {
                    specificError = 'Device serial number is already assigned. Please use a different device.';
                } else if (data.message && (data.message.toLowerCase().includes('already exists') || data.message.toLowerCase().includes('duplicate entry'))) {
                    // Check for duplicate email/phone or device
                    if (data.message.toLowerCase().includes('serial')) {
                         specificError = 'Device serial number is already assigned. Please use a different device.';
                    } else {
                         specificError = 'An account with this Email or Phone Number already exists.';
                    }
                }
                setErrorMsg(specificError);
            }
        } catch (err: any) {
            setErrorMsg(err.message || 'A network error occurred. Please try again.');
            console.error('Register network error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Bundle all state and handlers into a props object
    const formProps: RegisterFormProps = {
        firstName, lastName, phoneNumber, email, relationship, otherRelationship,
        serialNumber, password, confirmPassword, userFullName, userAge,
        userPhoneNumber, impairmentLevel, terms, showPassword,
        showConfirmPassword, loading, errorMsg, successMsg, errors,
    handleSubmit, handleGoToLogin,
        handleClickShowPassword, handleClickShowConfirmPassword, handleMouseDownPassword,
    setFirstName, setLastName,
    setPhoneNumber: validatePhoneInline,
    setEmail: validateEmailInline,
    setRelationship, setOtherRelationship,
    setSerialNumber: validateSerialInline,
    setPassword, setConfirmPassword,
    setUserFullName, setUserAge, setUserPhoneNumber, setImpairmentLevel, setTerms
    };

    return <RegisterForm {...formProps} />;
};

export default Register;
