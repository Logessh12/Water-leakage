'use client';

import React from 'react';
import { Home, Activity, FileText, Settings, AlertTriangle, PenTool } from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const [active, setActive] = React.useState('dashboard');

    const menuItems = [
        { id: 'dashboard', icon: Home, label: 'Dashboard' },
        { id: 'monitoring', icon: Activity, label: 'Real-time Monitoring' },
        { id: 'alerts', icon: AlertTriangle, label: 'Alerts & Incidents' },
        { id: 'maintenance', icon: PenTool, label: 'Maintenance' },
        { id: 'reports', icon: FileText, label: 'Reports' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50 text-slate-300"
        >
            <div className="p-6 border-b border-slate-800">
                <motion.h1
                    className="text-xl font-bold text-blue-500 flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Activity className="h-6 w-6" />
                    <span>HydroGuard</span>
                </motion.h1>
                <p className="text-slate-500 text-xs mt-1 tracking-wider uppercase">Pipeline Monitoring</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <motion.button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 relative',
                            {
                                'bg-blue-600/10 text-blue-400 border border-blue-600/20': active === item.id,
                                'text-slate-400 hover:bg-slate-800 hover:text-slate-100': active !== item.id,
                            }
                        )}
                    >
                        {active === item.id && (
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"
                                layoutId="activeSideBar"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </motion.button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-4 py-2 cursor-pointer"
                >
                    <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 border border-slate-600">
                        AD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-200">Admin User</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
