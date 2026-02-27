import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from '../api/axios';
import {
    CubeIcon,
    CurrencyRupeeIcon,
    ShoppingBagIcon,
} from '@heroicons/react/24/outline';

const COLORS = ['#047481', '#0694a2', '#16bdca', '#7edce2', '#afecef', '#d5f5f6'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [categoryData, setCategoryData] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [feeds, setFeeds] = useState([]);
    const [feedTab, setFeedTab] = useState('checked_out');
    const [alertFilter, setAlertFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [s, c, a, f] = await Promise.all([
                    axios.get('/api/dashboard/stats'),
                    axios.get('/api/dashboard/category-value'),
                    axios.get('/api/dashboard/alerts'),
                    axios.get('/api/dashboard/feeds'),
                ]);
                setStats(s.data);
                setCategoryData(c.data);
                setCalendarEvents(a.data);
                setFeeds(f.data);
            } catch (e) {
                // fallback with mock data
                setStats({ activeAssetsCount: 470, totalAssetValue: 16037644, fiscalYearPurchases: 5546992, fiscalYearAssetCount: 107 });
                setCategoryData([
                    { name: 'Electronics', value: 5200000 },
                    { name: 'Furniture', value: 3100000 },
                    { name: 'Vehicles', value: 4500000 },
                    { name: 'Computers', value: 2800000 },
                    { name: 'Others', value: 437644 },
                ]);
                setFeeds([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const statCards = stats ? [
        { title: 'Number of Active Assets', value: stats.activeAssetsCount.toLocaleString(), icon: CubeIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { title: 'Value of Assets', value: `₹${Number(stats.totalAssetValue).toLocaleString('en-IN')}`, icon: CurrencyRupeeIcon, color: 'text-red-400', bg: 'bg-red-500/10' },
        { title: 'Purchases in Fiscal Year', value: `₹${Number(stats.fiscalYearPurchases).toLocaleString('en-IN')}`, sub: `${stats.fiscalYearAssetCount} Assets`, icon: ShoppingBagIcon, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    ] : [];

    const filteredFeeds = feeds.filter((f) => feedTab === 'all' || f.type === feedTab);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-dark-400 text-sm mt-1">Welcome back! Here's your asset overview.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="stat-card animate-pulse">
                                <div className="h-4 bg-dark-700 rounded w-3/4 mb-4" />
                                <div className="h-8 bg-dark-700 rounded w-1/2" />
                            </div>
                        ))
                    ) : (
                        statCards.map((card) => (
                            <div key={card.title} className="stat-card">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-dark-400 text-sm mb-2">{card.title}</p>
                                        <p className="text-2xl font-bold text-white">{card.value}</p>
                                        {card.sub && <p className="text-dark-400 text-xs mt-1">{card.sub}</p>}
                                    </div>
                                    <div className={`${card.bg} p-3 rounded-xl`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="card">
                        <h2 className="text-white font-semibold text-base mb-4">Asset Value by Category</h2>
                        {categoryData.length ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <PieChart>
                                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value">
                                        {categoryData.map((_, idx) => (
                                            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, '']}
                                        contentStyle={{ background: '#1e293b', border: '1px solid #243044', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        formatter={(v) => <span className="text-dark-300 text-xs">{v}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-64 flex items-center justify-center text-dark-500">No data available</div>
                        )}
                    </div>

                    {/* Calendar */}
                    <div className="card">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white font-semibold text-base">Alert Calendar</h2>
                            <div className="flex gap-2">
                                {['Assets Due', 'Insurance', 'Lease'].map((btn) => (
                                    <button key={btn} className="text-xs px-2 py-1 rounded bg-dark-700 text-dark-300 hover:bg-brand-600 hover:text-white transition-colors">
                                        {btn}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="fc-dark">
                            <FullCalendar
                                plugins={[dayGridPlugin]}
                                initialView="dayGridMonth"
                                events={calendarEvents}
                                headerToolbar={{ left: 'prev', center: 'title', right: 'next' }}
                                height={260}
                                eventColor="#047481"
                            />
                        </div>
                    </div>
                </div>

                {/* Feeds */}
                <div className="card">
                    <div className="flex items-center gap-4 mb-4 border-b border-dark-700 pb-4">
                        <h2 className="text-white font-semibold text-base mr-4">Feeds</h2>
                        {[
                            { key: 'checked_out', label: 'Checked Out' },
                            { key: 'checked_in', label: 'Checked In' },
                            { key: 'repair', label: 'Under Repair' },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFeedTab(tab.key)}
                                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${feedTab === tab.key ? 'bg-brand-600 text-white' : 'text-dark-400 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    {['Asset Tag ID', 'Description', 'Check-out Date', 'Due Date', 'Assigned To'].map((h) => (
                                        <th key={h} className="text-left py-3 px-3 text-dark-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFeeds.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-dark-500 py-10">No records found</td>
                                    </tr>
                                ) : (
                                    filteredFeeds.map((row, i) => (
                                        <tr key={i} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                                            <td className="py-3 px-3 text-brand-400 font-mono text-xs">{row.assetTagId}</td>
                                            <td className="py-3 px-3 text-dark-300">{row.description}</td>
                                            <td className="py-3 px-3 text-dark-400">{row.checkoutDate}</td>
                                            <td className="py-3 px-3 text-dark-400">{row.dueDate}</td>
                                            <td className="py-3 px-3 text-dark-300">{row.assignedTo}</td>
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

export default Dashboard;
