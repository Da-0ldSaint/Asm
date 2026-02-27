import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../api/axios';
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ListAssets = () => {
    const [assets, setAssets] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/assets')
            .then((r) => setAssets(r.data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = assets.filter((a) =>
        a.description?.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_tag_id?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this asset?')) return;
        try {
            await axios.delete(`/api/assets/${id}`);
            setAssets((p) => p.filter((a) => a.id !== id));
        } catch { }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Assets</h1>
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets..."
                            className="form-input pl-9 w-64" />
                    </div>
                </div>

                <div className="card overflow-hidden p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-dark-700/50">
                                <tr>
                                    {['Tag ID', 'Description', 'Brand', 'Model', 'Category', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="text-left py-3 px-4 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-t border-dark-700">
                                            {[...Array(7)].map((_, j) => (
                                                <td key={j} className="py-3 px-4"><div className="h-4 bg-dark-700 rounded animate-pulse" /></td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr><td colSpan={7} className="text-center text-dark-500 py-12">No assets found</td></tr>
                                ) : (
                                    filtered.map((row) => (
                                        <tr key={row.id} className="border-t border-dark-700 hover:bg-dark-700/30 transition-colors">
                                            <td className="py-3 px-4 text-brand-400 font-mono text-xs">{row.asset_tag_id}</td>
                                            <td className="py-3 px-4 text-white max-w-xs truncate">{row.description}</td>
                                            <td className="py-3 px-4 text-dark-300">{row.brand || '—'}</td>
                                            <td className="py-3 px-4 text-dark-300">{row.model || '—'}</td>
                                            <td className="py-3 px-4 text-dark-300">{row.Category?.name || '—'}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-500/10 text-green-400' :
                                                        row.status === 'checked_out' ? 'bg-yellow-500/10 text-yellow-400' :
                                                            'bg-red-500/10 text-red-400'
                                                    }`}>{row.status || 'active'}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-brand-400 hover:bg-dark-600 transition-colors">
                                                        <PencilIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDelete(row.id)} className="p-1.5 rounded-lg bg-dark-700 text-dark-400 hover:text-red-400 hover:bg-dark-600 transition-colors">
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
        </Layout>
    );
};

export default ListAssets;
