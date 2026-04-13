'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:5000/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprintId: username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminAuthenticated', 'true');
                router.push('/dashboard');
            } else {
                setError(data.message || 'Invalid credentials. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to the authentication server.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar — same as landing page */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                    >
                        <Lock size={20} />
                        <span className="font-bold text-lg tracking-tight">EduVaultX</span>
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        ← Back to Home
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-12">
                <div className="w-full max-w-sm animate-fade-in">

                    {/* Icon + Heading */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-5">
                            <ShieldCheck size={28} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-1">Admin Portal</h1>
                        <p className="text-sm text-neutral-500">
                            Sign in to access the EduVaultX dashboard
                        </p>
                    </div>

                    {/* Error banner */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.06)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '6px',
                            padding: '0.65rem 0.9rem',
                            marginBottom: '1.25rem',
                            color: '#dc2626',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Username */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                marginBottom: '0.4rem',
                                color: 'var(--color-fg)',
                            }}>
                                Admin Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={15} style={{
                                    position: 'absolute', left: '11px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--color-muted)',
                                    pointerEvents: 'none',
                                }} />
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    required
                                    className="input"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '2.25rem',
                                        paddingRight: '0.75rem',
                                        paddingTop: '0.65rem',
                                        paddingBottom: '0.65rem',
                                        boxSizing: 'border-box',
                                        fontSize: '0.9rem',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                fontWeight: 500,
                                marginBottom: '0.4rem',
                                color: 'var(--color-fg)',
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{
                                    position: 'absolute', left: '11px', top: '50%',
                                    transform: 'translateY(-50%)', color: 'var(--color-muted)',
                                    pointerEvents: 'none',
                                }} />
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    className="input"
                                    style={{
                                        width: '100%',
                                        paddingLeft: '2.25rem',
                                        paddingRight: '2.75rem',
                                        paddingTop: '0.65rem',
                                        paddingBottom: '0.65rem',
                                        boxSizing: 'border-box',
                                        fontSize: '0.9rem',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '10px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none',
                                        cursor: 'pointer', color: 'var(--color-muted)',
                                        padding: '4px',
                                        display: 'flex', alignItems: 'center',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                padding: '0.7rem 1rem',
                                marginTop: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontSize: '0.9rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '15px', height: '15px',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        borderTopColor: 'white',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                    }} />
                                    Authenticating…
                                </>
                            ) : (
                                <>
                                    Sign In as Admin <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        margin: '1.5rem 0',
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>demo access</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }} />
                    </div>

                    {/* Demo credentials hint */}
                    <div className="card" style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.78rem', color: 'var(--color-muted)', lineHeight: 1.6 }}>
                            🔒 Demo credentials:{' '}
                            <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>admin</span>
                            {' '}/${' '}
                            <span style={{ fontWeight: 600, color: 'var(--color-fg)' }}>admin123</span>
                        </p>
                    </div>

                    {/* Back to Home */}
                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-secondary"
                            style={{
                                fontSize: '0.82rem',
                                padding: '0.5rem 1.25rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                            }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
