'use client';

import React from 'react';
import { Bell, Search, Menu, UserCircle } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 w-full bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 absolute top-0 left-0 z-40 bg-opacity-95 backdrop-blur-sm">
            <div className="flex items-center gap-4 w-1/3">
                <h2 className="text-xl font-semibold text-slate-100">Live Overview</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search sensors or locations..."
                        className="h-9 w-64 bg-slate-800 border-slate-700 rounded-full px-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-500"
                    />
                    <Search className="h-4 w-4 absolute right-3 top-2.5 text-slate-500" />
                </div>

                <button className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center relative transition-colors">
                    <Bell className="h-4 w-4 text-slate-300" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500 border border-slate-900" />
                </button>

                <div className="pl-4 border-l border-slate-800 flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-slate-500" />
                </div>
            </div>
        </header>
    );
};

export default Header;
