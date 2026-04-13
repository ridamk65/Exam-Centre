'use client';

import { Users, Shield, Clock, TrendingUp, Activity, Server } from 'lucide-react';
import { MetricCard } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_USERS, MOCK_LOGS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

const chartData = [
    { date: '02.09', accesses: 12 },
    { date: '02.10', accesses: 18 },
    { date: '02.11', accesses: 15 },
    { date: '02.12', accesses: 22 },
    { date: '02.13', accesses: 28 },
];

export default function DashboardPage() {
    const totalUsers = MOCK_USERS.length;
    const verifiedLogs = MOCK_LOGS.filter(log => log.status === 'Granted').length;
    const lastAccess = MOCK_LOGS[0];

    return (
        <div className="max-w-[1200px] mx-auto space-y-12 py-8 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Workspace Overview.</h1>
                <p className="text-neutral-500 text-sm font-medium">Real-time monitoring and cryptographic verification metrics.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card !p-8 border-l-4 border-l-black group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <Users size={20} className="text-neutral-400 group-hover:text-black transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                            <TrendingUp size={12} className="text-black" /> +12%
                        </span>
                    </div>
                    <div className="text-4xl font-black mb-1 tracking-tighter">{totalUsers}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Authorized Personnel</div>
                </div>

                <div className="card !p-8 border-l-4 border-l-black group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <Shield size={20} className="text-neutral-400 group-hover:text-black transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 flex items-center gap-1">
                             VERIFIED
                        </span>
                    </div>
                    <div className="text-4xl font-black mb-1 tracking-tighter">{verifiedLogs}</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Successful Accesses</div>
                </div>

                <div className="card !p-8 border-l-4 border-l-neutral-200 group hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <Clock size={20} className="text-neutral-400 group-hover:text-black transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                             LATEST ACCESS
                        </span>
                    </div>
                    <div className="text-3xl font-black mb-1 tracking-tighter truncate">
                        {formatDate(lastAccess.timestamp).split(',')[1].trim()}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-widest text-neutral-500">Last System Interaction</div>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="card !p-10">
                <div className="flex items-center justify-between mb-12">
                     <div>
                        <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                             <Activity size={20} /> Access Volume
                        </h2>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Blockchain Verification Frequency</p>
                     </div>
                     <div className="flex gap-2">
                         <button className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded">Week</button>
                         <button className="px-3 py-1 bg-neutral-100 text-neutral-400 text-[10px] font-black uppercase tracking-widest rounded hover:bg-neutral-200 transition-colors">Month</button>
                     </div>
                </div>
                
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorAccess" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#000000" stopOpacity={0.05}/>
                                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#a3a3a3', fontSize: 10, fontWeight: 700}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false}
                                tick={{fill: '#a3a3a3', fontSize: 10, fontWeight: 700}}
                            />
                            <Tooltip 
                                contentStyle={{
                                    borderRadius: '0px',
                                    border: '1px solid #000',
                                    padding: '12px',
                                    boxShadow: '8px 8px 0px rgba(0,0,0,0.1)'
                                }}
                                itemStyle={{fontWeight: 900, fontSize: 12, textTransform: 'uppercase'}}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="accesses" 
                                stroke="#000000" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorAccess)" 
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Status Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card !p-8">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Server size={16} /> System Infrastructure
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Mainnet Node</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black">STABLE</span>
                                <div className="w-2 h-2 bg-black rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">ESP32 Gateway</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black">ACTIVE</span>
                                <div className="w-2 h-2 bg-black rounded-full" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Hash Latency</span>
                            <span className="text-xs font-black uppercase">0.42ms</span>
                        </div>
                    </div>
                </div>

                <div className="card !p-8 bg-neutral-950 text-white flex flex-col justify-center text-center">
                    <Shield size={40} className="mx-auto mb-4" />
                    <h3 className="text-xl font-black mb-2 tracking-tight">Active Protection.</h3>
                    <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        All exam papers are currently <br /> anchored to block <span className="text-white">#19485721</span>
                    </p>
                    <button className="mt-8 text-[10px] font-black border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                        Refresh Proofs
                    </button>
                </div>
            </div>
        </div>
    );
}
