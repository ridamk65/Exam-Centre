'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Eye, EyeOff, Lock, User } from 'lucide-react';

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
            const response = await fetch('http://localhost:5000/api/auth/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fingerprintId: username, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                // Store admin session in localStorage
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminAuthenticated', 'true');
                router.push('/dashboard');
            } else {
                setError(data.message || 'Invalid admin credentials. Please try again.');
                setLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to the authentication server.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-neutral-50">

            {/* Light Animated Background Orbs */}
            <div style={{
                position: 'absolute', top: '5%', left: '10%',
                width: '450px', height: '450px',
                background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(40px)',
                animation: 'pulse-dot 4s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute', bottom: '5%', right: '10%',
                width: '550px', height: '550px',
                background: 'radial-gradient(circle, rgba(30,58,138,0.08) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(60px)',
                animation: 'pulse-dot 6s ease-in-out infinite'
            }} />

            {/* Grid overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }} />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="animate-fade-in" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '1.5rem',
                    padding: '2.5rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.05), 0 0 40px rgba(6,182,212,0.05)'
                }}>
                    {/* Shield Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="animate-glow" style={{
                            width: '80px', height: '80px',
                            background: 'linear-gradient(135deg, #1E3A8A, #06B6D4)',
                            borderRadius: '1.25rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 10px 25px rgba(6,182,212,0.3)'
                        }}>
                            <ShieldCheck size={42} color="white" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h1 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
                            Admin Portal
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
                            EduVaultX — Restricted Access
                        </p>
                        <div style={{
                            margin: '1rem auto 0',
                            width: '60px', height: '3px',
                            background: 'linear-gradient(90deg, #1E3A8A, #06B6D4)',
                            borderRadius: '999px'
                        }} />
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.05)',
                            border: '1px solid rgba(239,68,68,0.2)',
                            borderRadius: '0.5rem', padding: '0.75rem 1rem',
                            marginBottom: '1.5rem', color: '#DC2626',
                            fontSize: '0.875rem', textAlign: 'center', fontWeight: 500
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Username */}
                        <div>
                            <label style={{ display: 'block', color: '#334155', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Admin Username
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    id="admin-username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    required
                                    style={{
                                        width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem',
                                        background: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '0.625rem', color: '#0F172A',
                                        fontSize: '0.9rem', outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = '#06B6D4';
                                        e.target.style.background = '#ffffff';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#E2E8F0';
                                        e.target.style.background = '#F8FAFC';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', color: '#334155', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <input
                                    id="admin-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                    style={{
                                        width: '100%', padding: '0.75rem 3rem 0.75rem 2.75rem',
                                        background: '#F8FAFC',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '0.625rem', color: '#0F172A',
                                        fontSize: '0.9rem', outline: 'none',
                                        transition: 'all 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = '#06B6D4';
                                        e.target.style.background = '#ffffff';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(6,182,212,0.15)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#E2E8F0';
                                        e.target.style.background = '#F8FAFC';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget.style.color = '#0F172A'); }}
                                    onMouseLeave={e => { (e.currentTarget.style.color = '#94A3B8'); }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="admin-login-btn"
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.875rem',
                                background: loading
                                    ? 'rgba(6,182,212,0.6)'
                                    : 'linear-gradient(135deg, #1E3A8A, #06B6D4)',
                                border: 'none', borderRadius: '0.625rem',
                                color: 'white', fontWeight: 700,
                                fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'opacity 0.2s, transform 0.2s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                marginTop: '0.75rem',
                                boxShadow: '0 10px 25px rgba(6,182,212,0.3)'
                            }}
                            onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
                        >
                            {loading ? (
                                <>
                                    <div style={{
                                        width: '18px', height: '18px',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite'
                                    }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} />
                                    Sign In as Admin
                                </>
                            )}
                        </button>
                    </form>

                    {/* Hint */}
                    <div style={{
                        marginTop: '1.5rem', padding: '0.75rem',
                        background: 'rgba(6,182,212,0.05)',
                        border: '1px dashed rgba(6,182,212,0.3)',
                        borderRadius: '0.5rem', textAlign: 'center'
                    }}>
                        <p style={{ color: '#475569', fontSize: '0.75rem', fontWeight: 500 }}>
                            🔒 Demo credentials: <span style={{ color: '#0284C7', fontWeight: 700 }}>admin</span> / <span style={{ color: '#0284C7', fontWeight: 700 }}>admin123</span>
                        </p>
                    </div>

                    {/* Back link */}
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <button
                            onClick={() => router.push('/')}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#64748B', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.2s'
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#0284c7')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
