'use client';

import { usePathname } from 'next/navigation';
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
        <div className="flex h-screen bg-white text-black font-sans">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto w-full p-4 lg:p-12">
                    {children}
                </main>
            </div>
        </div>
    );
}
