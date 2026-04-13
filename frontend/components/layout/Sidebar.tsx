'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight, Lock, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: ROUTES.dashboard },
    { icon: Users, label: 'User Directory', href: ROUTES.users },
    { icon: FileText, label: 'Blockchain Logs', href: ROUTES.logs },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'h-screen sticky top-0 transition-all duration-300 z-50 bg-white border-r border-neutral-200',
                isCollapsed ? 'w-[72px]' : 'w-72'
            )}
        >
            <div className="flex flex-col h-full">
                {/* Brand / Logo */}
                <div className="h-20 flex items-center px-6 border-b border-neutral-100 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center border border-black shrink-0">
                            <Lock size={16} strokeWidth={2.5} />
                        </div>
                        {!isCollapsed && (
                            <span className="font-black tracking-tighter text-lg animate-fade-in uppercase">EduVaultX</span>
                        )}
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-3 rounded-md transition-all group',
                                    isActive ? 'bg-black text-white' : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
                                )}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={isActive ? 2.5 : 2}
                                />
                                {!isCollapsed && (
                                    <span className="text-sm font-bold tracking-tight">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer Controls */}
                <div className="p-3 border-t border-neutral-100">
                    <button
                         onClick={() => setIsCollapsed(!isCollapsed)}
                         className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-neutral-400 hover:text-black hover:bg-neutral-50 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                         {isCollapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Collapse</>}
                    </button>
                    
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest mt-1"
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Sign Out</span>}
                    </Link>
                </div>
            </div>
        </aside>
    );
}
