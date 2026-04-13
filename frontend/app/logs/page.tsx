'use client';

import { useEffect, useState } from 'react';
import { Download, CheckCircle, XCircle, Filter, Search, ShieldCheck } from 'lucide-react';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatDate, truncateHash, convertToCSV, downloadFile, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface LogEntry {
    id: string;
    userName: string;
    user: string;
    action: string;
    timestamp: string;
    status: string;
    paperHash: string;
}

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'granted' | 'denied'>('all');

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const response = await fetch('http://localhost:5000/api/auth/logs', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                setLogs(Array.isArray(data) ? data : []);
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <ShieldCheck className="animate-pulse text-neutral-400" size={48} />
                    <p className="text-sm font-black uppercase tracking-[0.2em] animate-pulse">Syncing Audit Ledger...</p>
                </div>
            </div>
        );
    }

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
        } catch {
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
        <div className="max-w-[1200px] mx-auto space-y-12 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Audit Ledger.</h1>
                    <p className="text-neutral-500 text-sm font-medium">Immutable record of all blockchain-secured access events.</p>
                </div>
                <Button variant="outline" size="md" onClick={handleExportCSV} className="gap-2">
                    <Download size={16} />
                    Export Ledger
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
                <div className="border border-neutral-100 p-6 bg-neutral-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Total Events</p>
                    <p className="text-2xl font-black">{logs.length}</p>
                </div>
                <div className="border border-neutral-100 p-6 bg-neutral-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Success Rate</p>
                    <p className="text-2xl font-black">{logs.length > 0 ? Math.round((logs.filter(l => l.status === 'Granted').length / logs.length) * 100) : 0}%</p>
                </div>
                <div className="border border-neutral-100 p-6 bg-green-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2">Verified</p>
                    <p className="text-2xl font-black text-green-700">{logs.filter(l => l.status === 'Granted').length}</p>
                </div>
                <div className="border border-neutral-200 p-6 bg-black text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-2">Denied / Flagged</p>
                    <p className="text-2xl font-black">{logs.filter(l => l.status === 'Denied').length}</p>
                </div>
            </div>

            {/* Filtering & Listing */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-neutral-100 p-1 rounded">
                        {['all', 'granted', 'denied'].map((f) => (
                             <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
                                    filter === f ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-black"
                                )}
                             >
                                {f}
                             </button>
                        ))}
                    </div>
                    
                    <div className="relative w-full md:w-64">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                         <input 
                            type="text" 
                            placeholder="Search Ledger..." 
                            className="w-full bg-neutral-50 border border-neutral-100 py-2 pl-9 pr-4 text-xs font-bold focus:outline-none focus:border-black transition-colors"
                         />
                    </div>
                </div>

                <div className="animate-fade-in">
                    <Table headers={['Identity Hash', 'Action', 'Timestamp', 'Verification', 'Blockchain Signature', 'Audit']}>
                        {filteredLogs.map((log) => (
                            <TableRow key={log.id}>
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <p className="font-black text-xs text-black">{log.userName}</p>
                                        <p className="text-[10px] font-bold text-neutral-400 font-mono">{log.user}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{log.action}</span>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[10px] font-bold text-neutral-500">{formatDate(log.timestamp).split(',').join(' | ')}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                         <div className={cn(
                                            "w-1.5 h-1.5 rounded-full",
                                            log.status === 'Granted' ? "bg-black" : "bg-red-500"
                                         )} />
                                         <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest",
                                            log.status === 'Granted' ? "text-black" : "text-red-500"
                                         )}>{log.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <code className="text-[10px] font-mono font-bold text-neutral-400">
                                        {truncateHash(log.paperHash)}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVerify(log.paperHash);
                                        }}
                                        className="text-[10px] font-black uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-all flex items-center gap-2"
                                    >
                                        <ShieldCheck size={12} /> Verify
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            </div>
        </div>
    );
}
