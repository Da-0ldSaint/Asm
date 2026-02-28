import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { EnvelopeIcon, PhoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import axios from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const TIMEZONES = [
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
    { value: 'America/New_York', label: 'America/New_York (EST)' },
    { value: 'Europe/London', label: 'Europe/London (GMT)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST)' },
];
const DATE_FORMATS = [
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
];
const TIME_FORMATS = [
    { value: '12', label: '12-hour' },
    { value: '24', label: '24-hour' },
];

const MyProfile = () => {
    const { user, setUser } = useAuth();
    const fileRef = useRef(null);
    const [form, setForm] = useState({
        first_name: '', last_name: '', title: '', phone: '',
        email: '', confirm_email: '', timezone: 'Asia/Kolkata',
        date_format: 'MM/dd/yyyy', time_format: '12',
    });
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                title: user.title || '',
                phone: user.phone || '',
                email: user.email || '',
                confirm_email: user.email || '',
                timezone: user.timezone || 'Asia/Kolkata',
                date_format: user.date_format || 'MM/dd/yyyy',
                time_format: user.time_format || '12',
            });
            if (user.profile_image) setPreview(`/uploads/${user.profile_image}`);
        }
    }, [user]);

    const validate = () => {
        const e = {};
        if (!form.first_name.trim()) e.first_name = 'First name is required';
        if (!form.last_name.trim()) e.last_name = 'Last name is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (form.email !== form.confirm_email) e.confirm_email = 'Emails do not match';
        return e;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowed.includes(file.type)) { alert('Only JPG, GIF, PNG are allowed'); return; }
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (k !== 'confirm_email') formData.append(k, v); });
            if (imageFile) formData.append('profile_image', imageFile);
            const res = await axios.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setUser(res.data);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-white">My Profile</h1>

                {success && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{success}</div>
                )}
                {errors.api && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{errors.api}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: User Info */}
                    <div className="card">
                        <h2 className="text-white font-semibold mb-5 pb-3 border-b border-dark-700">User Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input label="First Name" id="first_name" required value={form.first_name}
                                onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                                error={errors.first_name} placeholder="Enter first name" />
                            <Input label="Last Name" id="last_name" required value={form.last_name}
                                onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                                error={errors.last_name} placeholder="Enter last name" />
                            <Input label="Title" id="title" value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="e.g. System Administrator" />
                            <Input label="Phone" id="phone" value={form.phone} icon={PhoneIcon}
                                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                placeholder="+91 98765 43210" />
                            <Input label="Email" id="email" required type="email" value={form.email} icon={EnvelopeIcon}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                error={errors.email} placeholder="Enter email" />
                            <Input label="Confirm Email" id="confirm_email" required type="email" value={form.confirm_email} icon={EnvelopeIcon}
                                onChange={(e) => setForm((p) => ({ ...p, confirm_email: e.target.value }))}
                                error={errors.confirm_email} placeholder="Confirm email" />
                        </div>
                    </div>

                    {/* Section 2: Localization */}
                    <div className="card">
                        <h2 className="text-white font-semibold mb-2">Localization</h2>
                        <p className="text-dark-400 text-sm mb-5">Adjust settings to fit your profile, style, and your assets.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Select label="Timezone" id="timezone" value={form.timezone} options={TIMEZONES}
                                onChange={(e) => setForm((p) => ({ ...p, timezone: e.target.value }))} />
                            <Select label="Date Display Format" id="date_format" value={form.date_format} options={DATE_FORMATS}
                                onChange={(e) => setForm((p) => ({ ...p, date_format: e.target.value }))} />
                            <Select label="Time Format" id="time_format" value={form.time_format} options={TIME_FORMATS}
                                onChange={(e) => setForm((p) => ({ ...p, time_format: e.target.value }))} />
                        </div>
                    </div>

                    {/* Section 3: Photo */}
                    <div className="card">
                        <h2 className="text-white font-semibold mb-5">User Photo</h2>
                        <div className="flex items-center gap-6">
                            <button type="button" onClick={() => fileRef.current?.click()}
                                className="w-28 h-28 rounded-full border-2 border-dashed border-dark-600 hover:border-brand-500 bg-dark-700 flex flex-col items-center justify-center cursor-pointer transition-colors group overflow-hidden relative">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <>
                                        <CameraIcon className="w-6 h-6 text-dark-400 group-hover:text-brand-400 mb-1" />
                                        <span className="text-dark-500 text-xs text-center group-hover:text-brand-400">Click to upload</span>
                                    </>
                                )}
                            </button>
                            <div>
                                <p className="text-dark-400 text-sm">Allowed: JPG, GIF, PNG</p>
                                <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 text-sm text-brand-400 hover:text-brand-300 underline">
                                    Browse file...
                                </button>
                            </div>
                            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif" className="hidden" onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => window.history.back()} className="btn-gray">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-yellow flex items-center gap-2">
                            {loading && <Spinner size="sm" className="border-dark-900/30 border-t-dark-900" />}
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default MyProfile;
