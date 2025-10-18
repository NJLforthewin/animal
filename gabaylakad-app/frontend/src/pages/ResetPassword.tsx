import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    resetToken: token,
                    newPassword: password,
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Password reset successful! You will be redirected to the login page in a few seconds.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000); // 3 seconds delay
            } else {
                setMessage(data.message || 'Password reset failed.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                            id="new-password"
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            className="form-input w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-semibold text-lg transition-all"
                        style={{background: 'linear-gradient(90deg, #3498db 0%, #8e44ad 100%)'}}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                {message && (
                    <div className="mt-6 text-center text-blue-700 font-medium">
                        {message}
                    </div>
                )}
                {/* Debug info removed for production */}
            </div>
        </div>
    );
};

export default ResetPassword;
