'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShieldCheck, Users, FileText, Activity,
    Settings, LogOut, Upload, Eye,
    Bell, Database, Lock, CheckCircle, AlertTriangle
} from 'lucide-react';

const stats = [
    { label: 'Total Users', value: '5', icon: Users, color: '#06B6D4', change: '+12%' },
    { label: 'Exam Papers', value: '24', icon: FileText, color: '#8B5CF6', change: '+5%' },
    { label: 'Active Sessions', value: '3', icon: Activity, color: '#10B981', change: 'Live' },
    { label: 'Security Alerts', value: '0', icon: AlertTriangle, color: '#F59E0B', change: 'Clear' },
];

const recentActivity = [
    { action: 'User "Karthik" accessed Exam Paper #12', time: '2 min ago', type: 'access', status: 'success' },
    { action: 'New exam paper uploaded: Math Finals 2026', time: '15 min ago', type: 'upload', status: 'success' },
    { action: 'Failed login attempt from 192.168.1.55', time: '1 hour ago', type: 'alert', status: 'warning' },
    { action: 'Blockchain sync completed successfully', time: '2 hours ago', type: 'system', status: 'success' },
    { action: 'User "Priya" added to authorized list', time: '3 hours ago', type: 'user', status: 'success' },
];

const systemModules = [
    { name: 'User Management', desc: 'Add, edit or remove authorized users', icon: Users, path: '/users' },
    { name: 'File Upload', desc: 'Upload and manage exam papers', icon: Upload, path: '/upload' },
    { name: 'Access Logs', desc: 'View all system access records', icon: Eye, path: '/logs' },
    { name: 'System Settings', desc: 'Configure blockchain and hardware', icon: Settings, path: '/settings' },
];

export default function AdminDashboardPage() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [time, setTime] = useState('');

    useEffect(() => {
        const isAuth = localStorage.getItem('adminAuthenticated') === 'true';
        if (!isAuth) {
            router.replace('/admin/login');
        } else {
            setTimeout(() => setAuthenticated(true), 0);
        }
        setTimeout(() => setTime(new Date().toLocaleTimeString()), 0);
        const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(t);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('adminAuthenticated');
        router.push('/admin/login');
    };

    if (!authenticated) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid rgba(6,182,212,0.3)', borderTopColor: '#06B6D4', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#0F172A', fontFamily: 'Inter, Manrope, sans-serif' }}>
            {/* Top Navbar */}
            <nav style={{
                background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(6,182,212,0.2)',
                padding: '0 2rem', height: '64px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '38px', height: '38px',
                        background: 'linear-gradient(135deg, #1E3A8A, #06B6D4)',
                        borderRadius: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ShieldCheck size={20} color="white" />
                    </div>
                    <div>
                        <div style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>Admin Dashboard</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.7rem' }}>EduVaultX</div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>System Online</span>
                    </div>
                    <div style={{ color: '#64748B', fontSize: '0.8rem' }}>{time}</div>
                    <button
                        id="admin-notifications"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '6px' }}
                        title="Notifications"
                    >
                        <Bell size={18} />
                    </button>
                    <button
                        id="admin-logout-btn"
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '0.4rem',
                            padding: '0.45rem 1rem',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.5rem', color: '#FCA5A5',
                            fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.2)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Welcome Banner */}
                <div className="animate-fade-in" style={{
                    background: 'linear-gradient(135deg, rgba(30,58,138,0.5) 0%, rgba(6,182,212,0.2) 100%)',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: '1rem', padding: '1.5rem 2rem',
                    marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <h1 style={{ color: '#F1F5F9', fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                            Welcome back, Admin 👋
                        </h1>
                        <p style={{ color: '#94A3B8', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                            Here&apos;s a full overview of the EduVaultX system.
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={16} color="#06B6D4" />
                        <span style={{ color: '#06B6D4', fontSize: '0.8rem', fontWeight: 600 }}>Blockchain Secured</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="animate-fade-in card-hover" style={{
                            background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)',
                            borderRadius: '1rem', padding: '1.5rem',
                            display: 'flex', flexDirection: 'column', gap: '0.75rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <stat.icon size={24} color={stat.color} />
                                <span style={{
                                    fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                                    borderRadius: '999px',
                                    background: `${stat.color}20`, color: stat.color
                                }}>{stat.change}</span>
                            </div>
                            <div>
                                <div style={{ color: '#F1F5F9', fontSize: '1.75rem', fontWeight: 800 }}>{stat.value}</div>
                                <div style={{ color: '#94A3B8', fontSize: '0.8rem', marginTop: '2px' }}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Recent Activity */}
                    <div style={{
                        background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)',
                        borderRadius: '1rem', padding: '1.5rem'
                    }}>
                        <h2 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={18} color="#06B6D4" /> Recent Activity
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {recentActivity.map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                                        background: item.status === 'success' ? '#10B981' : '#F59E0B'
                                    }} />
                                    <div>
                                        <p style={{ color: '#CBD5E1', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>{item.action}</p>
                                        <span style={{ color: '#64748B', fontSize: '0.72rem' }}>{item.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health */}
                    <div style={{
                        background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)',
                        borderRadius: '1rem', padding: '1.5rem'
                    }}>
                        <h2 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Database size={18} color="#8B5CF6" /> System Health
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { label: 'Blockchain Network', status: 'Operational', ok: true },
                                { label: 'ESP32 Hardware', status: 'Online', ok: true },
                                { label: 'Database Sync', status: 'Synced', ok: true },
                                { label: 'Security Firewall', status: 'Active', ok: true },
                                { label: 'Last Backup', status: '2 hrs ago', ok: true },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>{item.label}</span>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                                        color: item.ok ? '#10B981' : '#EF4444', fontSize: '0.8rem', fontWeight: 600
                                    }}>
                                        <CheckCircle size={13} />{item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Access Modules */}
                <div style={{
                    background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(51,65,85,0.6)',
                    borderRadius: '1rem', padding: '1.5rem'
                }}>
                    <h2 style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Settings size={18} color="#F59E0B" /> Quick Access
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        {systemModules.map((mod, i) => (
                            <button
                                key={i}
                                id={`admin-module-${mod.name.toLowerCase().replace(/\s+/g, '-')}`}
                                onClick={() => router.push(mod.path)}
                                style={{
                                    background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.5)',
                                    borderRadius: '0.75rem', padding: '1.25rem',
                                    textAlign: 'left', cursor: 'pointer',
                                    transition: 'border-color 0.2s, background 0.2s',
                                    display: 'flex', flexDirection: 'column', gap: '0.5rem'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = '#06B6D4';
                                    e.currentTarget.style.background = 'rgba(6,182,212,0.08)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)';
                                    e.currentTarget.style.background = 'rgba(15,23,42,0.6)';
                                }}
                            >
                                <mod.icon size={22} color="#06B6D4" />
                                <div style={{ color: '#F1F5F9', fontWeight: 600, fontSize: '0.9rem' }}>{mod.name}</div>
                                <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{mod.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
