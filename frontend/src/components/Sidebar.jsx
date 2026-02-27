import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HomeIcon,
    BellIcon,
    CubeIcon,
    ChartBarIcon,
    WrenchScrewdriverIcon,
    AdjustmentsHorizontalIcon,
    Cog6ToothIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    UsersIcon,
    ChevronDownIcon,
    KeyIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    ListBulletIcon,
} from '@heroicons/react/24/outline';

const navItems = [
    { label: 'Dashboard', icon: HomeIcon, to: '/dashboard' },
    { label: 'Alerts', icon: BellIcon, to: '/alerts' },
    {
        label: 'Assets',
        icon: CubeIcon,
        children: [
            { label: 'List Assets', icon: ListBulletIcon, to: '/assets' },
            { label: 'Add an Asset', icon: PlusIcon, to: '/assets/add' },
        ],
    },
    { label: 'Reports', icon: ChartBarIcon, to: '/reports' },
    { label: 'Tools', icon: WrenchScrewdriverIcon, to: '/tools' },
    { label: 'Advanced', icon: AdjustmentsHorizontalIcon, to: '/advanced' },
    { label: 'Setup', icon: Cog6ToothIcon, to: '/setup' },
    {
        label: 'Employees',
        icon: UsersIcon,
        children: [
            { label: 'List Employees', icon: ListBulletIcon, to: '/employees' },
            { label: 'Add Employee', icon: PlusIcon, to: '/employees/add' },
        ],
    },
    {
        label: 'Users',
        icon: UserIcon,
        children: [
            { label: 'My Profile', icon: UserIcon, to: '/profile' },
            { label: 'Change Password', icon: KeyIcon, to: '/change-password' },
            { label: 'Logout', icon: ArrowRightOnRectangleIcon, to: null, action: 'logout' },
        ],
    },
    { label: 'Help / Support', icon: QuestionMarkCircleIcon, to: '/help' },
];

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [openMenus, setOpenMenus] = useState({ Users: false, Assets: false, Employees: false });

    const toggleMenu = (label) => setOpenMenus((p) => ({ ...p, [label]: !p[label] }));

    const handleAction = (item) => {
        if (item.action === 'logout') {
            logout();
            navigate('/login');
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-dark-900 border-r border-dark-700 flex flex-col shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-dark-700">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                        <CubeIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">ASM</span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    if (item.children) {
                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => toggleMenu(item.label)}
                                    className="sidebar-item w-full justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-4 h-4 shrink-0" />
                                        <span>{item.label}</span>
                                    </div>
                                    <ChevronDownIcon
                                        className={`w-4 h-4 transition-transform duration-200 ${openMenus[item.label] ? 'rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ${openMenus[item.label] ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="ml-4 mt-1 space-y-1 border-l border-dark-700 pl-3">
                                        {item.children.map((child) =>
                                            child.action ? (
                                                <button
                                                    key={child.label}
                                                    onClick={() => handleAction(child)}
                                                    className="sidebar-item w-full text-left"
                                                >
                                                    <child.icon className="w-4 h-4 shrink-0" />
                                                    <span>{child.label}</span>
                                                </button>
                                            ) : (
                                                <NavLink
                                                    key={child.label}
                                                    to={child.to}
                                                    className={({ isActive }) =>
                                                        `sidebar-item ${isActive ? 'active' : ''}`
                                                    }
                                                >
                                                    <child.icon className="w-4 h-4 shrink-0" />
                                                    <span>{child.label}</span>
                                                </NavLink>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon className="w-4 h-4 shrink-0" />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-dark-700">
                <p className="text-dark-500 text-xs text-center">ASM v1.0.0</p>
            </div>
        </aside>
    );
};

export default Sidebar;
