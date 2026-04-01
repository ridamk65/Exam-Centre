'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Trash2, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

interface User {
    id: string;
    name: string;
    role: string;
    fingerprintId: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showQR, setShowQR] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', fingerprintId: '', faceEncoding: 'RFID_USER', role: 'officer' });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/users');
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
                toast.error('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-[var(--color-text-muted)] animate-pulse">Loading users...</div>;
    }

    const handleAddUser = async () => {
        if (!newUser.name || !newUser.fingerprintId) {
            toast.error('Name and UID are required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            const data = await response.json();

            if (data.success) {
                const addedUser = { ...newUser, id: data.userId };
                setUsers([...users, addedUser]);
                setNewUser({ name: '', fingerprintId: '', faceEncoding: 'RFID_USER', role: 'officer' });
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">User Management</h1>
                    <p className="text-[var(--color-text-muted)]">
                        Manage authorized staff and generate QR codes
                    </p>
                </div>
                <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                    <UserPlus size={20} />
                    Add User
                </Button>
            </div>

            {/* Add User Form */}
            {showAddForm && (
                <Card className="animate-fade-in">
                    <h3 className="text-xl font-bold text-[var(--color-text)] mb-4">Add New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text)]"
                        />
                        <input
                            type="text"
                            placeholder="UID (Fingerprint/RFID)"
                            value={newUser.fingerprintId}
                            onChange={(e) => setNewUser({ ...newUser, fingerprintId: e.target.value })}
                            className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text)]"
                        />
                        <select
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-text)]"
                        >
                            <option value="officer">Officer</option>
                            <option value="admin">Admin</option>
                            <option value="faculty">Faculty</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleAddUser}>Save User</Button>
                        <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                </Card>
            )}

            {/* Users Table */}
            <div className="animate-fade-in">
                <Table headers={['ID', 'Name', 'Role', 'UID', 'Actions']}>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <span className="font-mono text-[var(--color-accent)]">{user.id}</span>
                            </TableCell>
                            <TableCell>
                                <span className="font-medium">{user.name}</span>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <code className="text-xs">{user.fingerprintId}</code>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowQR(user.id)}
                                    >
                                        <QrCode size={16} />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowQR(null)}>
                    <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <Card className="max-w-sm">
                            <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 text-center">
                                QR Code for {showQR}
                            </h3>
                            <div className="flex justify-center mb-4">
                                <QRCodeCanvas value={showQR} size={200} />
                            </div>
                            <Button onClick={() => setShowQR(null)} className="w-full">Close</Button>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}
