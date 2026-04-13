'use client';

import { useState } from 'react';
import { UserPlus, Trash2, QrCode, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import { MOCK_USERS } from '@/lib/constants';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

export default function UsersPage() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [showQR, setShowQR] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', role: '', department: '' });

    const handleAddUser = () => {
        if (!newUser.name || !newUser.role || !newUser.department) {
            toast.error('Please fill all fields');
            return;
        }

        const user = {
            id: `FAC${String(users.length + 1).padStart(3, '0')}`,
            ...newUser,
        };

        setUsers([...users, user]);
        setNewUser({ name: '', role: '', department: '' });
        setShowAddForm(false);
        toast.success('User added successfully!');
    };

    const handleDeleteUser = (id: string) => {
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully!');
    };

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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Designation / Role</label>
                             <input
                                type="text"
                                placeholder="e.g. Senior Invigilator"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Department</label>
                             <input
                                type="text"
                                placeholder="e.g. Cryptography Lab"
                                value={newUser.department}
                                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                                className="w-full bg-transparent border-b border-neutral-300 focus:border-black focus:outline-none py-2 text-sm font-bold transition-colors"
                            />
                        </div>
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
                                <span className="text-xs font-bold">{user.department}</span>
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
