import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    BellIcon,
    MagnifyingGlassIcon,
    PlusIcon,
    ListBulletIcon,
    UserCircleIcon,
    KeyIcon,
    ArrowRightOnRectangleIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user
        ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
        : 'A';

    return (
        <header className="h-16 bg-dark-900 border-b border-dark-700 flex items-center px-6 gap-4 shrink-0">
            {/* Search */}
            <div className="flex-1 max-w-xs">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="w-full bg-dark-800 border border-dark-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
                {/* Action Buttons */}
                <Link to="/assets" className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-700 text-dark-300 hover:text-white text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200">
                    <ListBulletIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">List of Assets</span>
                </Link>
                <Link to="/assets/add" className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200">
                    <PlusIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Add an Asset</span>
                </Link>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white transition-colors">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="flex items-center gap-2.5 bg-dark-800 border border-dark-700 rounded-lg px-3 py-2 hover:bg-dark-700 transition-colors"
                    >
                        <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {initials}
                        </div>
                        <span className="text-sm font-medium text-white hidden sm:inline">
                            {user ? `${user.first_name} ${user.last_name}` : 'Admin'}
                        </span>
                        <ChevronDownIcon className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-3 border-b border-dark-700">
                                <p className="text-white text-sm font-semibold">{user ? `${user.first_name} ${user.last_name}` : 'Admin'}</p>
                                <p className="text-dark-400 text-xs truncate">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-yellow-500 hover:text-dark-900 transition-colors">
                                    <UserCircleIcon className="w-4 h-4" />
                                    My Profile
                                </Link>
                                <Link to="/change-password" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-dark-300 hover:bg-yellow-500 hover:text-dark-900 transition-colors">
                                    <KeyIcon className="w-4 h-4" />
                                    Change Password
                                </Link>
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                    Log Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
