'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';

// Routes that should NOT render the Navbar + Sidebar shell
const NO_SHELL_ROUTES = ['/', '/admin/login', '/admin/dashboard', '/login'];

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideShell = NO_SHELL_ROUTES.includes(pathname);

    if (hideShell) {
        return <>{children}</>;
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
