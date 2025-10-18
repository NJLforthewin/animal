import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const impairmentOptions = [
    'Totally Blind',
    'Partially Sighted',
    'Low Vision',
];

const relationshipOptions = [
    'Parent',
    'Child',
    'Sibling',
    'Guardian',
    'Caregiver',
    'Other',
];

const CardSection: React.FC<{ title: string; children: React.ReactNode }>
    = ({ title, children }) => (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 p-6">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">{title}</h3>
        {children}
    </div>
);

const RegisterForm: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [relationship, setRelationship] = useState('');
    const [otherRelationship, setOtherRelationship] = useState('');
    const [deviceId, setDeviceId] = useState('');
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
    const navigate = useNavigate();

    // Validation helpers
    const isPhoneValid = (num: string) => /^\d{11}$/.test(num);
    const isAgeValid = (age: string) => {
        const n = Number(age);
        return !isNaN(n) && n >= 1 && n <= 120;
    };
    const isEmailValid = (email: string) => /.+@.+\..+/.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        if (
            !firstName || !lastName || !phoneNumber || !email || !relationship ||
            !deviceId || !password || !confirmPassword || !userFullName ||
            !userAge || !impairmentLevel || !terms
        ) {
            setErrorMsg('Please fill in all required fields!');
            return;
        }
        if (!isEmailValid(email)) {
            setErrorMsg('Please enter a valid email address!');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match!');
            return;
        }
        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters long!');
            return;
        }
        if (!isPhoneValid(phoneNumber)) {
            setErrorMsg('Please enter a valid caregiver phone number!');
            return;
        }
        if (userPhoneNumber && !isPhoneValid(userPhoneNumber)) {
            setErrorMsg('Please enter a valid user phone number!');
            return;
        }
        if (!isAgeValid(userAge)) {
            setErrorMsg('Please enter a valid age (1-120)!');
            return;
        }
        setLoading(true);
        // If relationship is Other, use the specified value
        const rel = relationship === 'Other' && otherRelationship ? otherRelationship : relationship;
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    password,
                    email,
                    phone_number: phoneNumber,
                    impairment_level: impairmentLevel,
                    device_id: deviceId,
                    relationship: rel,
                    blind_full_name: userFullName,
                    blind_age: userAge, 
                    blind_phone_number: userPhoneNumber
                }),
            });
            const data = await res.json();
            console.log('Register response:', data);
            if (res.ok) {
                // If backend returns token, save and redirect
                if (data.token) {
                    sessionStorage.setItem('token', data.token);
                    alert('Token saved to sessionStorage: ' + sessionStorage.getItem('token'));
                    setSuccessMsg('Registration successful! Redirecting to dashboard...');
                    setTimeout(() => {
                        navigate('/dashboard');
                    }, 1500);
                } else {
                    // If no token, redirect to verification page with email and password
                    setSuccessMsg(data.message || 'Registration successful! Please verify your account.');
                    setTimeout(() => {
                        navigate(`/verify?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
                    }, 1200);
                }
            } else {
                if (data.message && data.message.includes('device_id')) {
                    setErrorMsg('The Device ID you entered already exists. Please check your device manual for the correct Device ID or use a different one.');
                } else {
                    setErrorMsg(data.message || 'Registration failed!');
                }
                console.error('Register API error:', data);
            }
        } catch (err) {
            setErrorMsg('Network error!');
            console.error('Register network error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 register-container p-4 md:p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
            {/* First row: Caregiver & Person side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSection title="Caregiver Information">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="fName" className="block text-sm font-medium text-gray-700 mb-2 required">First Name</label>
                            <input id="fName" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your first name" />
                        </div>
                        <div>
                            <label htmlFor="lName" className="block text-sm font-medium text-gray-700 mb-2 required">Last Name</label>
                            <input id="lName" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your last name" />
                        </div>
                        <div>
                            <label htmlFor="pNumber" className="block text-sm font-medium text-gray-700 mb-2 required">Phone Number</label>
                            <input id="pNumber" type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your 11-digit phone number" maxLength={11} />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 required">Email</label>
                            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
                        </div>
                    </div>
                </CardSection>
                <CardSection title="Person You'll Monitor">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="userFullName" className="block text-sm font-medium text-gray-700 mb-2 required">Full Name</label>
                            <input id="userFullName" type="text" required value={userFullName} onChange={e => setUserFullName(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Full name of person you'll monitor" />
                        </div>
                        <div>
                            <label htmlFor="userPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input id="userPhoneNumber" type="tel" value={userPhoneNumber} onChange={e => setUserPhoneNumber(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Their phone number (optional)" />
                            <p className="mt-1 text-xs text-gray-500">Leave blank if they don't have a phone</p>
                        </div>
                        <div>
                            <label htmlFor="userAge" className="block text-sm font-medium text-gray-700 mb-2 required">Age</label>
                            <input id="userAge" type="number" min={1} max={120} required value={userAge} onChange={e => setUserAge(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Age" />
                        </div>
                        <div>
                            <label htmlFor="impairmentLevel" className="block text-sm font-medium text-gray-700 mb-2 required">Impairment Level</label>
                            <select id="impairmentLevel" required value={impairmentLevel} onChange={e => setImpairmentLevel(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select impairment level</option>
                                {impairmentOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardSection>
            </div>
            {/* Second row: Relationship & Device and Security side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CardSection title="Relationship & Device">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-2 required">Relationship</label>
                            <select id="relationship" required value={relationship} onChange={e => setRelationship(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="">Select relationship</option>
                                {relationshipOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {relationship === 'Other' && (
                                <input id="otherRelationship" type="text" value={otherRelationship} onChange={e => setOtherRelationship(e.target.value)} className="form-input w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Specify relationship" />
                            )}
                        </div>
                        <div>
                            <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2 required">Device Serial Number</label>
                            <input id="deviceId" type="text" required value={deviceId} onChange={e => setDeviceId(e.target.value)} className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Device serial number" />
                            <p className="mt-1 text-xs text-gray-500">Unique serial number on the tracking device</p>
                        </div>
                    </div>
                </CardSection>
                <CardSection title="Security">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 required">Create Password</label>
                            <div className="relative">
                                <input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} className="form-input w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Create password" />
                                <span className="password-toggle" onClick={() => setShowPassword(v => !v)}>
                                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Minimum 8 characters with letters and numbers</p>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2 required">Confirm Password</label>
                            <div className="relative">
                                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-input w-full pr-12 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Confirm password" />
                                <span className="password-toggle" onClick={() => setShowConfirmPassword(v => !v)}>
                                    <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </CardSection>
            </div>
            {/* Actions below both rows */}
            <div className="flex flex-col items-center gap-4 mt-6">
                <div className="flex items-start terms-group">
                    <input id="terms" type="checkbox" required checked={terms} onChange={e => setTerms(e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the <button onClick={() => { navigate('/terms'); }} className="font-medium text-blue-600 hover:text-blue-500">Terms and Conditions</button> and <button onClick={() => { navigate('/privacy'); }} className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</button>
                    </label>
                </div>
                {errorMsg && (
                    <div className="error-notification w-full max-w-lg">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{errorMsg}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="success-notification w-full max-w-lg">
                        <i className="fas fa-check-circle"></i>
                        <span>{successMsg}</span>
                    </div>
                )}
                <button type="submit" className="btn-primary w-full max-w-lg py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 text-lg font-semibold transition-all" disabled={loading}>
                    {loading ? <span className="loading-spinner"></span> : 'Create Caregiver Account'}
                </button>
                <div className="pt-2 text-center w-full max-w-lg">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => { navigate('/'); }} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Sign in</button>
                    </p>
                </div>
            </div>
        </form>
    );
};

export default RegisterForm;
