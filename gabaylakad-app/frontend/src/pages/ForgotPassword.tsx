import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setPreviewUrl('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            setMessage(data.message || 'If your email exists, you will receive a reset link.');
            if (data.previewUrl) {
                setPreviewUrl(data.previewUrl);
            }
        } catch (err) {
            setMessage('Network error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                    <button type="submit" className="btn-primary w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold text-lg transition-all" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                {message && (
                    <div className="mt-6 text-center text-blue-700 font-medium">
                        {message}
                    </div>
                )}
                {previewUrl && (
                    <div className="mt-4 text-center">
                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Ethereal test email</a>
                    </div>
                )}
                <div className="mt-6 text-center">
                    <Link to="/login" className="btn-primary w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold text-lg transition-all inline-block">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
