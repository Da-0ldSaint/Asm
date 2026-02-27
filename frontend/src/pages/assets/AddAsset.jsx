import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { CurrencyRupeeIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from '../../api/axios';
import Spinner from '../../components/ui/Spinner';

const TYPES = [
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'other', label: 'Other' },
];

const FormSection = ({ title, children }) => (
    <div className="card">
        <h2 className="text-white font-semibold text-base mb-5 pb-3 border-b border-dark-700">{title}</h2>
        {children}
    </div>
);

const AddAsset = () => {
    const [sites, setSites] = useState([]);
    const [locations, setLocations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        description: '', asset_tag_id: '', purchased_from: '', purchase_date: '',
        brand: '', cost: '', model: '', serial_no: '', windows_key: '', office_key: '',
        type: '', site_id: '', location_id: '', category_id: '',
    });
    const [assetPhoto, setAssetPhoto] = useState(null);
    const [photoName, setPhotoName] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [s, c] = await Promise.all([axios.get('/api/sites'), axios.get('/api/categories')]);
                setSites(s.data.map((x) => ({ value: x.id, label: x.name })));
                setCategories(c.data.map((x) => ({ value: x.id, label: x.name })));
            } catch { }
        };
        fetchDropdowns();
    }, []);

    useEffect(() => {
        if (form.site_id) {
            axios.get(`/api/locations?site_id=${form.site_id}`)
                .then((r) => setLocations(r.data.map((x) => ({ value: x.id, label: x.name }))))
                .catch(() => setLocations([]));
        } else {
            setLocations([]);
        }
    }, [form.site_id]);

    const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const validate = () => {
        const e = {};
        if (!form.description.trim()) e.description = 'Description is required';
        if (!form.asset_tag_id.trim()) e.asset_tag_id = 'Asset Tag ID is required';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
            if (assetPhoto) fd.append('asset_photo', assetPhoto);
            await axios.post('/api/assets', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSuccess('Asset added successfully!');
            setForm({ description: '', asset_tag_id: '', purchased_from: '', purchase_date: '', brand: '', cost: '', model: '', serial_no: '', windows_key: '', office_key: '', type: '', site_id: '', location_id: '', category_id: '' });
            setAssetPhoto(null); setPhotoName('');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setErrors({ api: err.response?.data?.message || 'Failed to add asset' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <PlusIcon className="w-4 h-4 text-dark-900" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Add an Asset</h1>
                </div>

                {success && <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{success}</div>}
                {errors.api && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{errors.api}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Section 1: Asset Details */}
                    <FormSection title="Asset Details">
                        <div className="space-y-4">
                            <Input label="Description" id="description" required value={form.description}
                                onChange={set('description')} error={errors.description} placeholder="Enter asset description" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Asset Tag ID" id="asset_tag_id" required value={form.asset_tag_id}
                                    onChange={set('asset_tag_id')} error={errors.asset_tag_id} placeholder="e.g. AST-001" />
                                <Input label="Purchased From" id="purchased_from" value={form.purchased_from}
                                    onChange={set('purchased_from')} placeholder="Vendor name" />
                                <Input label="Purchase Date" id="purchase_date" type="date" value={form.purchase_date}
                                    onChange={set('purchase_date')} />
                                <Input label="Brand" id="brand" value={form.brand} onChange={set('brand')} placeholder="e.g. Dell, HP" />
                                <div className="relative">
                                    <label className="label">Cost</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 text-sm">₹</span>
                                        <input type="number" value={form.cost} onChange={set('cost')} placeholder="0.00"
                                            className="form-input pl-7" />
                                    </div>
                                </div>
                                <Input label="Model" id="model" value={form.model} onChange={set('model')} placeholder="Model number" />
                                <Input label="Serial No" id="serial_no" value={form.serial_no} onChange={set('serial_no')} placeholder="Serial number" />
                            </div>
                            <Input label="Windows Key" id="windows_key" value={form.windows_key} onChange={set('windows_key')} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" />
                            <Input label="MS Office Key" id="office_key" value={form.office_key} onChange={set('office_key')} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" />
                            <div className="max-w-xs">
                                <Select label="Type" id="type" value={form.type} options={TYPES} onChange={set('type')} placeholder="Select Type" />
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 2: Site, Location, Category */}
                    <FormSection title="Site, Location & Category">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="label mb-0">Site</label>
                                    <button type="button" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                                        <PlusIcon className="w-3 h-3" /> New
                                    </button>
                                </div>
                                <Select id="site_id" value={form.site_id} options={sites} onChange={set('site_id')} placeholder="Select Site" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="label mb-0">Category</label>
                                    <button type="button" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                                        <PlusIcon className="w-3 h-3" /> New
                                    </button>
                                </div>
                                <Select id="category_id" value={form.category_id} options={categories} onChange={set('category_id')} placeholder="Select Category" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="label mb-0">Location</label>
                                    <button type="button" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
                                        <PlusIcon className="w-3 h-3" /> New
                                    </button>
                                </div>
                                <Select id="location_id" value={form.location_id} options={locations} onChange={set('location_id')} placeholder="Select Location" />
                            </div>
                        </div>
                    </FormSection>

                    {/* Section 3: Photo */}
                    <FormSection title="Asset Photo">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg px-4 py-2 cursor-pointer transition-colors">
                                <input type="file" accept="image/jpeg,image/png,image/gif" className="hidden"
                                    onChange={(e) => { setAssetPhoto(e.target.files[0]); setPhotoName(e.target.files[0]?.name || ''); }} />
                                Choose File
                            </label>
                            <span className="text-dark-400 text-sm">{photoName || 'No file chosen'}</span>
                        </div>
                        <p className="text-dark-500 text-xs mt-2">Only (JPG, GIF, PNG) are allowed</p>
                    </FormSection>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-end">
                        <button type="button" onClick={() => window.history.back()} className="btn-gray">Cancel</button>
                        <button type="submit" disabled={loading} className="btn-yellow flex items-center gap-2">
                            {loading && <Spinner size="sm" className="border-dark-900/30 border-t-dark-900" />}
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default AddAsset;
