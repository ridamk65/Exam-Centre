'use client';

import { useEffect, useState } from 'react';
import { Download, CheckCircle, XCircle, Filter } from 'lucide-react';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate, truncateHash, getStatusColor, convertToCSV, downloadFile } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'granted' | 'denied'>('all');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/logs');
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error('Failed to fetch logs:', error);
                toast.error('Failed to load access logs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        return log.status.toLowerCase() === filter;
    });

    const handleVerify = async (hash: string) => {
        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paperHash: hash }),
            });

            const data = await response.json();

            if (data.valid) {
                toast.success('Hash verified successfully!');
            } else {
                toast.error('Hash verification failed');
            }
        } catch (error) {
            toast.error('Verification failed');
        }
    };

    const handleExportCSV = () => {
        const csvData = logs.map(log => ({
            User: log.userName,
            Action: log.action,
            Timestamp: formatDate(log.timestamp),
            Status: log.status,
            PaperHash: log.paperHash,
        }));

        const csv = convertToCSV(csvData);
        downloadFile(csv, `access-logs-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Logs exported successfully!');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center animate-fade-in">
                <div>
                    <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">Access Logs</h1>
                    <p className="text-[var(--color-text-muted)]">
                        View and verify blockchain access events
                    </p>
                </div>
                <Button onClick={handleExportCSV} variant="outline" className="gap-2">
                    <Download size={18} />
                    Export CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">Total Logs</p>
                            <p className="text-3xl font-bold text-[var(--color-text)]">{logs.length}</p>
                        </div>
                        <Filter size={32} className="text-[var(--color-accent)] opacity-50" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">Granted</p>
                            <p className="text-3xl font-bold text-green-500">
                                {logs.filter(l => l.status === 'Granted').length}
                            </p>
                        </div>
                        <CheckCircle size={32} className="text-green-500 opacity-50" />
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">Denied</p>
                            <p className="text-3xl font-bold text-red-500">
                                {logs.filter(l => l.status === 'Denied').length}
                            </p>
                        </div>
                        <XCircle size={32} className="text-red-500 opacity-50" />
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-2 animate-fade-in">
                <Button
                    variant={filter === 'all' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    All
                </Button>
                <Button
                    variant={filter === 'granted' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('granted')}
                >
                    Granted
                </Button>
                <Button
                    variant={filter === 'denied' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('denied')}
                >
                    Denied
                </Button>
            </div>

            {/* Logs Table */}
            <div className="animate-fade-in">
                <Table headers={['User', 'Action', 'Timestamp', 'Status', 'Paper Hash', 'Actions']}>
                    {filteredLogs.map((log, index) => (
                        <TableRow
                            key={log.id}
                            onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                            className="cursor-pointer"
                        >
                            <TableCell>
                                <div>
                                    <p className="font-medium">{log.userName}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{log.user}</p>
                                </div>
                            </TableCell>
                            <TableCell>{log.action}</TableCell>
                            <TableCell>
                                <span className="text-sm">{formatDate(log.timestamp)}</span>
                            </TableCell>
                            <TableCell>
                                <span className={`font-semibold ${getStatusColor(log.status)}`}>
                                    {log.status}
                                </span>
                            </TableCell>
                            <TableCell>
                                <code className="text-xs font-mono text-[var(--color-accent)]">
                                    {truncateHash(log.paperHash)}
                                </code>
                            </TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVerify(log.paperHash);
                                    }}
                                >
                                    Verify
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </Table>
            </div>
        </div>
    );
}
