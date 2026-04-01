'use client';

import React, { useState, useEffect } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export function Navbar() {
    const router = useRouter();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isConnected] = useState(true);

    useEffect(() => {
        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        setTimeout(() => setTheme(initialTheme), 0);
        document.documentElement.setAttribute('data-theme', initialTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <nav className="bg-[var(--color-card)] border-b border-[var(--color-border)] px-6 py-4 animate-slide-down sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[var(--color-text)]">EduVaultX</h1>
                        <p className="text-xs text-[var(--color-text-muted)]">Blockchain-Secured Exams</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-6">
                    {/* System Status */}
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            'w-2 h-2 rounded-full animate-pulse-dot',
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                        )} />
                        <span className="text-sm text-[var(--color-text-muted)]">
                            {isConnected ? 'Connected' : 'Offline'}
                        </span>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-[var(--color-primary)] hover:bg-opacity-10 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon size={20} className="text-[var(--color-text-muted)]" />
                        ) : (
                            <Sun size={20} className="text-[var(--color-accent)]" />
                        )}
                    </button>

                    {/* User Avatar — click to go to Admin Login */}
                    <button
                        id="admin-portal-btn"
                        onClick={() => router.push('/admin/login')}
                        title="Admin Portal"
                        className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all"
                        style={{ background: 'none', border: 'none', padding: '4px 8px', borderRadius: '0.5rem' }}
                    >
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-full flex items-center justify-center"
                            style={{ boxShadow: '0 0 0 0 rgba(6,182,212,0)', transition: 'box-shadow 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 12px rgba(6,182,212,0.5)')}
                            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(6,182,212,0)')}
                        >
                            <User size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-medium text-[var(--color-text)]">Admin</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
