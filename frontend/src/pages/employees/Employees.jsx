import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import {
    EnvelopeIcon, PhoneIcon, CalendarIcon, PlusIcon,
    MagnifyingGlassIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';
import axios from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const GENDER_OPTIONS = ['Male', 'Female'];

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [sites, setSites] = useState([]);
    const [locations, setLocations] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        full_name: '', employee_id: '', title: '', phone: '', email: '',
        personal_email: '', gender: '', joining_date: '', notes: '',
        site_id: '', location_id: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [e, s] = await Promise.all([axios.get('/api/employees'), axios.get('/api/sites')]);
                setEmployees(e.data);
                setSites(s.data.map((x) => ({ value: x.id, label: x.name })));
            } catch { } finally { setLoading(false); }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (form.site_id) {
            axios.get(`/api/locations?site_id=${form.site_id}`)
                .then((r) => setLocations(r.data.map((x) => ({ value: x.id, label: x.name }))))
                .catch(() => setLocations([]));
        }
    }, [form.site_id]);

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.full_name.trim()) e.full_name = 'Full name is required';
        if (!form.phone.trim()) e.phone = 'Phone is required';
        if (!form.email.trim()) e.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
        if (!form.gender) e.gender = 'Gender is required';
        if (!form.joining_date) e.joining_date = 'Joining date is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setSubmitting(true);
        try {
            const res = await axios.post('/api/employees', form);
            setEmployees((p) => [res.data, ...p]);
            setIsOpen(false);
            resetForm();
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Failed to add employee' });
        } finally { setSubmitting(false); }
    };

    const resetForm = () => setForm({
        full_name: '', employee_id: '', title: '', phone: '', email: '',
        personal_email: '', gender: '', joining_date: '', notes: '', site_id: '', location_id: '',
    });

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this employee?')) return;
        try {
            await axios.delete(`/api/employees/${id}`);
            setEmployees((p) => p.filter((emp) => emp.id !== id));
        } catch { }
    };

    const filtered = employees.filter((e) =>
        e.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        e.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Employees / Persons</h1>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..."
                                className="form-input pl-9 w-56" />
                        </div>
                        <button onClick={() => setIsOpen(true)} className="btn-yellow flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" /> Add Employee
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-dark-700/50">
                                <tr>
                                    {['Name', 'Employee ID', 'Phone', 'Email', 'Gender', 'Joining Date', 'Actions'].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(4)].map((_, i) => (
                                        <tr key={i} className="border-t border-dark-700">
                                            {[...Array(7)].map((_, j) => (
                                                <td key={j} className="py-3 px-4"><div className="h-4 bg-dark-700 rounded animate-pulse" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center text-dark-500 py-12">No employees found</td></tr>
                                ) : (
                                    filtered.map((emp) => (
                                        <tr key={emp.id} className="border-t border-dark-700 hover:bg-dark-700/30 transition-colors">
                                            <td className="py-3 px-4 text-white font-medium">{emp.full_name}</td>
                                            <td className="py-3 px-4 text-dark-300 font-mono text-xs">{emp.employee_id || '—'}</td>
                                            <td className="py-3 px-4 text-dark-300">{emp.phone}</td>
                                            <td className="py-3 px-4 text-dark-300 truncate max-w-[180px]">{emp.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${emp.gender === 'male' ? 'bg-blue-500/10 text-blue-400' : 'bg-pink-500/10 text-pink-400'}`}>
                                                    {emp.gender || '—'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-dark-300">{emp.joining_date ? new Date(emp.joining_date).toLocaleDateString() : '—'}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-brand-400 hover:bg-dark-600 transition-colors">
                                                        <PencilIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(emp.id)} className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-red-400 hover:bg-dark-600 transition-colors">
                                                        <TrashIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Employee Modal */}
            <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); resetForm(); setErrors({}); }} title="Add a Person / Employee" size="lg">
                {errors.api && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{errors.api}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" id="full_name" required value={form.full_name} onChange={set('full_name')} error={errors.full_name} placeholder="Enter full name" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Employee ID" id="employee_id" value={form.employee_id} onChange={set('employee_id')} placeholder="EMP-001" />
                        <Input label="Title" id="title" value={form.title} onChange={set('title')} placeholder="e.g. Manager" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Phone" id="phone" required value={form.phone} onChange={set('phone')} error={errors.phone} icon={PhoneIcon} placeholder="+91 98765 43210" />
                        <Input label="Email" id="email" required type="email" value={form.email} onChange={set('email')} error={errors.email} icon={EnvelopeIcon} placeholder="work@company.com" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select label="Site" id="site_id" value={form.site_id} options={sites} onChange={set('site_id')} />
                        <Select label="Location" id="location_id" value={form.location_id} options={locations} onChange={set('location_id')} />
                    </div>
                    <div>
                        <label className="label">Notes</label>
                        <textarea value={form.notes} onChange={set('notes')} rows={3} placeholder="Additional notes..."
                            className="form-input resize-none" />
                    </div>
                    <div>
                        <label className="label">Gender <span className="text-red-400 ml-1">*</span></label>
                        <div className="flex gap-4">
                            {GENDER_OPTIONS.map((g) => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="gender" value={g.toLowerCase()} checked={form.gender === g.toLowerCase()}
                                        onChange={() => setForm((p) => ({ ...p, gender: g.toLowerCase() }))}
                                        className="accent-yellow-500" />
                                    <span className="text-dark-300 text-sm">{g}</span>
                                </label>
                            ))}
                        </div>
                        {errors.gender && <p className="error-text">{errors.gender}</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input label="Joining Date" id="joining_date" required type="date" value={form.joining_date} onChange={set('joining_date')} error={errors.joining_date} icon={CalendarIcon} />
                        <Input label="Personal Email" id="personal_email" type="email" value={form.personal_email} onChange={set('personal_email')} icon={EnvelopeIcon} placeholder="personal@gmail.com" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsOpen(false)} className="btn-gray">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn-yellow flex items-center gap-2">
                            {submitting && <Spinner size="sm" className="border-dark-900/30 border-t-dark-900" />}
                            Add Employee
                        </button>
                    </div>
                </form>
            </Modal>
        </Layout>
    );
};

export default Employees;
