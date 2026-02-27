import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyProfile from './pages/users/MyProfile';
import ChangePassword from './pages/users/ChangePassword';
import AddAsset from './pages/assets/AddAsset';
import ListAssets from './pages/assets/ListAssets';
import Employees from './pages/employees/Employees';
import Layout from './components/Layout';

const PlaceholderPage = ({ title }) => (
    <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                <p className="text-dark-400">This page is coming soon.</p>
            </div>
        </div>
    </Layout>
);

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
                    <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                    <Route path="/assets" element={<ProtectedRoute><ListAssets /></ProtectedRoute>} />
                    <Route path="/assets/add" element={<ProtectedRoute><AddAsset /></ProtectedRoute>} />
                    <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                    <Route path="/employees/add" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
                    <Route path="/alerts" element={<ProtectedRoute><PlaceholderPage title="Alerts" /></ProtectedRoute>} />
                    <Route path="/reports" element={<ProtectedRoute><PlaceholderPage title="Reports" /></ProtectedRoute>} />
                    <Route path="/tools" element={<ProtectedRoute><PlaceholderPage title="Tools" /></ProtectedRoute>} />
                    <Route path="/advanced" element={<ProtectedRoute><PlaceholderPage title="Advanced" /></ProtectedRoute>} />
                    <Route path="/setup" element={<ProtectedRoute><PlaceholderPage title="Setup" /></ProtectedRoute>} />
                    <Route path="/help" element={<ProtectedRoute><PlaceholderPage title="Help / Support" /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
