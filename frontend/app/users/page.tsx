'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Trash2, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

interface User {
    id: string;
    name: string;
    role: string;
    fingerprintId: string;
    department?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showQR, setShowQR] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ 
        name: '', 
        fingerprintId: '', 
        faceEncoding: 'RFID_USER', 
        role: 'officer', 
        password: '',
        department: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('http://localhost:5000/api/auth/users', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                toast.error('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.fingerprintId) {
            toast.error('Name and UID are required');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (data.success) {
                const addedUser = { ...newUser, id: data.userId };
                setUsers([...users, addedUser]);
                setNewUser({ name: '', fingerprintId: '', faceEncoding: 'RFID_USER', role: 'officer', password: '', department: '' });
                setShowAddForm(false);
                toast.success('User registered successfully!');
            } else {
                toast.error(data.error || 'Failed to register user');
            }
        } catch {
            toast.error('Registration failed');
        }
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully!');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <UserPlus className="animate-pulse text-neutral-400" size={48} />
                    <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Accessing Member Registry...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Member Directory.</h1>
                    <p className="text-neutral-500 text-sm font-medium">Manage personnel and cryptographic access credentials.</p>
                </div>
                <Button variant="primary" size="md" onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                    <UserPlus size={16} />
                    Register Member
                </Button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
                <div className="animate-fade-in border-2 border-black p-8 bg-neutral-50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black tracking-tight">Register New Personnel</h3>
                        <button onClick={() => setShowAddForm(false)} className="text-neutral-400 hover:text-black transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Full Legal Name</label>
                             <input
                                type="text"
                                placeholder="e.g. Alan Turing"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">System UID (FP/RFID)</label>
                             <input
                                type="text"
                                placeholder="e.g. 0x82...F2"
                                value={newUser.fingerprintId}
                                onChange={(e) => setNewUser({ ...newUser, fingerprintId: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Designation / Role</label>
                             <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            >
                                <option value="officer">Officer</option>
                                <option value="admin">Admin</option>
                                <option value="faculty">Faculty</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Department</label>
                             <input
                                type="text"
                                placeholder="e.g. Cryptography"
                                value={newUser.department}
                                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            />
                        </div>
                        {newUser.role === 'admin' && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Vault Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                                />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex gap-4">
                        <Button variant="primary" onClick={handleAddUser}>Commit to Registry</Button>
                        <Button variant="secondary" onClick={() => setShowAddForm(false)}>Discard</Button>
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="animate-fade-in">
                <Table headers={['UUID', 'Identity', 'Designation', 'Access Rights', 'Operations']}>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <span className="font-black text-xs text-black">{user.id}</span>
                            </TableCell>
                            <TableCell>
                                <span className="font-bold text-black">{user.name}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs uppercase font-bold tracking-widest opacity-60">{user.role}</span>
                            </TableCell>
                            <TableCell>
                                <span className="text-xs font-bold">{user.department || user.fingerprintId}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <button
                                        title="Generate Private QR"
                                        onClick={() => setShowQR(user.id)}
                                        className="p-2 border border-neutral-100 hover:border-black hover:bg-black hover:text-white transition-all"
                                    >
                                        <QrCode size={14} />
                                    </button>
                                    <button
                                        title="Revoke Access"
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="p-2 border border-neutral-100 hover:border-red-600 hover:bg-red-600 hover:text-white transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowQR(null)}>
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()} className="max-w-sm w-full bg-white p-12 text-center rounded-none border-[12px] border-black shadow-2xl">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black tracking-tighter mb-2">Access Key.</h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Hashed Identity: {showQR}</p>
                        </div>
                        
                        <div className="flex justify-center p-6 border-2 border-neutral-100 mb-8 bg-neutral-50">
                            <QRCodeCanvas value={showQR} size={180} fgColor="#000000" bgColor="#f9f9f9" level="H" />
                        </div>
                        
                        <Button variant="primary" className="w-full" onClick={() => setShowQR(null)}>Terminate Session</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
