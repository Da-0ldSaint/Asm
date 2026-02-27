import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/ui/Input';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import axios from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const ChangePassword = () => {
    const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const validate = () => {
        const e = {};
        if (!form.current_password) e.current_password = 'Current password is required';
        if (!form.new_password) e.new_password = 'New password is required';
        else if (form.new_password.length < 8) e.new_password = 'Password must be at least 8 characters';
        if (!form.confirm_password) e.confirm_password = 'Please confirm your password';
        else if (form.new_password !== form.confirm_password) e.confirm_password = 'Passwords do not match';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            await axios.put('/api/users/change-password', {
                currentPassword: form.current_password,
                newPassword: form.new_password,
            });
            setSuccess('Password changed successfully!');
            setForm({ current_password: '', new_password: '', confirm_password: '' });
            setTimeout(() => setSuccess(''), 4000);
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const toggleShow = (field) => setShow((p) => ({ ...p, [field]: !p[field] }));

    const PasswordField = ({ id, label, field, placeholder }) => (
        <Input
            label={label} id={id} required type={show[field] ? 'text' : 'password'}
            value={form[field === 'current' ? 'current_password' : field === 'new' ? 'new_password' : 'confirm_password']}
            onChange={(e) => setForm((p) => ({ ...p, [field === 'current' ? 'current_password' : field === 'new' ? 'new_password' : 'confirm_password']: e.target.value }))}
            error={errors[field === 'current' ? 'current_password' : field === 'new' ? 'new_password' : 'confirm_password']}
            icon={LockClosedIcon}
            placeholder={placeholder}
            rightElement={
                <button type="button" onClick={() => toggleShow(field)} className="text-dark-400 hover:text-white">
                    {show[field] ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
            }
        />
    );

    return (
        <Layout>
            <div className="max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Change Password</h1>

                {success && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{success}</div>
                )}
                {errors.api && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{errors.api}</div>
                )}

                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <PasswordField id="current_password" label="Current Password" field="current" placeholder="Enter current password" />
                        <PasswordField id="new_password" label="New Password" field="new" placeholder="Min 8 characters" />
                        <PasswordField id="confirm_password" label="Confirm New Password" field="confirm" placeholder="Re-enter new password" />

                        <div className="pt-2 flex gap-3 justify-end">
                            <button type="button" onClick={() => window.history.back()} className="btn-gray">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-yellow flex items-center gap-2">
                                {loading && <Spinner size="sm" className="border-dark-900/30 border-t-dark-900" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default ChangePassword;
