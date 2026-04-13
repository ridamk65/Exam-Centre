'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mock authentication
        setTimeout(() => {
            if (username && password) {
                toast.success('Login successful!');
                router.push('/dashboard');
            } else {
                toast.error('Please enter username and password');
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white text-black">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative">
                <button 
                    onClick={() => router.push('/')}
                    className="absolute top-8 left-8 lg:left-24 text-neutral-400 hover:text-black flex items-center gap-2 text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                <div className="max-w-[400px] w-full mx-auto lg:mx-0 animate-fade-in">
                    <div className="mb-12">
                        <div className="w-10 h-10 border border-black flex items-center justify-center mb-6">
                            <Lock size={18} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-2">Welcome Back.</h1>
                        <p className="text-neutral-500 text-sm">Sign in to access the blockchain dashboard.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black focus:outline-none transition-colors placeholder:text-neutral-300 text-lg"
                                placeholder="name@domain"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-0 py-3 bg-transparent border-b border-neutral-200 focus:border-black focus:outline-none transition-colors placeholder:text-neutral-300 text-lg"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-primary h-14 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-12 pt-12 border-t border-neutral-100 italic text-neutral-400 text-xs">
                        Blockchain integrity, verified locally.
                    </div>
                </div>
            </div>

            {/* Right Side - Visual / Empty Space with subtle text */}
            <div className="hidden lg:flex bg-neutral-950 items-center justify-center p-24 overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="relative text-white max-w-md">
                    <div className="text-8xl font-black text-neutral-900 absolute -top-12 -left-12 select-none">
                        AUTH
                    </div>
                    <p className="text-2xl font-medium leading-relaxed relative z-10">
                        "Security is not a feature, it's the foundation."
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="w-12 h-1 bg-white" />
                        <span className="text-xs font-bold tracking-widest uppercase">EduVaultX</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
