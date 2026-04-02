'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, ChevronLeft, ChevronRight, Upload, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: ROUTES.dashboard },
    { icon: Users, label: 'Users', href: ROUTES.users },
    { icon: FileText, label: 'Logs', href: ROUTES.logs },
    { icon: Upload, label: 'Upload', href: '/upload' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'bg-[var(--color-card)] border-r border-[var(--color-border)] h-screen sticky top-0 transition-all duration-300',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            <div className="flex flex-col h-full">
                {/* Toggle Button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg hover:bg-[var(--color-primary)] hover:bg-opacity-10 transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        {isCollapsed ? (
                            <ChevronRight size={20} className="text-[var(--color-text-muted)]" />
                        ) : (
                            <ChevronLeft size={20} className="text-[var(--color-text-muted)]" />
                        )}
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                                    'hover:bg-[var(--color-primary)] hover:bg-opacity-10',
                                    isActive && 'bg-[var(--color-primary)] bg-opacity-10 border-l-4 border-[var(--color-accent)]',
                                    !isActive && 'border-l-4 border-transparent'
                                )}
                            >
                                <Icon
                                    size={22}
                                    className={cn(
                                        'transition-colors',
                                        isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                                    )}
                                />
                                {!isCollapsed && (
                                    <span
                                        className={cn(
                                            'font-medium transition-colors',
                                            isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'
                                        )}
                                    >
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] text-center">
                            Blockchain Secured
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] text-center mt-1">
                            v1.0.0
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
