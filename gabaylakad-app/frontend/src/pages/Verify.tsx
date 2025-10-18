import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Verify: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Please enter the verification code sent to your email.');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  React.useEffect(() => {
  const params = new URLSearchParams(location.search);
  const emailParam = params.get('email') || '';
  const passwordParam = params.get('password') || '';
  setEmail(emailParam);
  setPassword(passwordParam);
  }, [location.search]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setMessage('Verifying...');
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.message && data.message.toLowerCase().includes('success')) {
        setMessage('Thank you for registering your device! Logging you in...');
        setVerified(true);
        // Automatically log in
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }), // use password from query params
        });
        const loginData = await loginRes.json();
        if (loginData.token) {
          sessionStorage.setItem('token', loginData.token);
          setTimeout(() => navigate('/dashboard'), 1200);
        } else {
          setMessage('Verification succeeded, but login failed. Please login manually.');
        }
      } else {
        setMessage(data.message || 'Verification failed.');
      }
    } catch {
      setMessage('Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Account Verification</h2>
        <p className="mb-6 text-lg text-center">{message}</p>
        {!verified && (
          <form onSubmit={handleVerify} className="w-full max-w-xs flex flex-col gap-4">
            <input
              type="text"
              className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-center text-lg"
              placeholder="Enter verification code"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              maxLength={6}
              disabled={verifying}
            />
            <button
              type="submit"
              className="btn-primary py-3 px-6 rounded-lg text-white font-semibold"
              disabled={verifying}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Verify;
