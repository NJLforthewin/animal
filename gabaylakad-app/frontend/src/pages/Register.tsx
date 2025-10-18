import React from 'react';
import RegisterForm from '../components/RegisterForm';

const Register: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-5xl border-2 border-blue-400 bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Create an Account</h2>
                <RegisterForm />
            </div>
        </div>
    );
};

export default Register;