import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Spinner from '../components/ui/Spinner';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const validate = () => {
        const e = {};
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
        if (!form.password) e.password = 'Password is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setApiError('');
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', form);
            login(res.data.token, res.data.user);
            navigate('/dashboard');
        } catch (err) {
            setApiError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-9 h-9 bg-brand-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M4 3a2 2 0 00-2 2v1h16V5a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v6a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span className="text-dark-900 font-bold text-xl">ASM</span>
                    </div>

                    <h1 className="text-3xl font-bold text-dark-900 mb-2">Welcome Back!</h1>
                    <p className="text-dark-500 text-sm mb-8 leading-relaxed">
                        Sign in to access your asset management dashboard and streamline asset tracking.
                    </p>

                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
                            <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="Enter your email"
                                    className={`w-full bg-white border ${errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-brand-500'} text-dark-900 rounded-lg pl-10 pr-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-dark-700">Password</label>
                                <a href="#" className="text-xs text-brand-600 hover:text-brand-700 font-medium">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                    placeholder="Enter your password"
                                    className={`w-full bg-white border ${errors.password ? 'border-red-400 focus:ring-red-400' : 'border-slate-300 focus:ring-brand-500'} text-dark-900 rounded-lg pl-10 pr-10 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                />
                                <button type="button" onClick={() => setShowPassword((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-semibold rounded-lg py-3 text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                            {loading && <Spinner size="sm" />}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-slate-50 px-3 text-slate-400 font-medium">OR</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="space-y-2.5">
                            <button type="button" className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-dark-700 font-medium rounded-lg py-3 text-sm transition-all duration-200">
                                Continue with Google
                            </button>
                            <button type="button" className="w-full border border-slate-300 bg-white hover:bg-slate-50 text-dark-700 font-medium rounded-lg py-3 text-sm transition-all duration-200">
                                Continue with Apple
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-dark-500">
                        Don't have an account?{' '}
                        <a href="#" className="text-brand-600 hover:text-brand-700 font-semibold">Sign Up</a>
                    </p>
                </div>
            </div>

            {/* RIGHT: Marketing Panel */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-start p-16 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #0f3d3e 0%, #0a2e2f 60%, #051f20 100%)' }}>
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="relative z-10 max-w-md">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                        <div className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
                        <span className="text-brand-300 text-xs font-medium tracking-wide uppercase">Enterprise Platform</span>
                    </div>

                    <h2 className="text-4xl font-bold text-white leading-tight mb-8">
                        Smarter Asset Management Starts Here
                    </h2>

                    <div className="border-l-2 border-brand-500 pl-6 mb-6">
                        <p className="text-brand-200 text-base leading-relaxed italic mb-4">
                            "Great asset management isn't about tracking equipment — it's about empowering people with clarity, control, and confidence."
                        </p>
                        <p className="text-brand-400 text-sm font-medium">— System Architecture Team</p>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                        <p className="text-brand-300 text-sm leading-relaxed">
                            Built for growing teams who demand efficiency and accountability.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-6">
                        {[['470+', 'Active Assets'], ['₹1.6Cr+', 'Asset Value'], ['99.9%', 'Uptime']].map(([val, label]) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-bold text-white mb-1">{val}</div>
                                <div className="text-brand-400 text-xs">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
