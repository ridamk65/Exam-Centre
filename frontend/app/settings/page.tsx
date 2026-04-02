'use client';

import { useState } from 'react';
import {
    Settings, Shield, Database, Wifi, Bell,
    Save, RefreshCw, AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

interface SettingRow {
    label: string;
    value: string;
    editable: boolean;
    type?: string;
    description: string;
}

const initialBlockchainSettings: SettingRow[] = [
    { label: 'RPC URL', value: 'http://127.0.0.1:8545', editable: true, description: 'Hardhat / Ganache local node URL' },
    { label: 'Contract Address', value: '0x5FbDB2315678afecb367f032d93F642f64180aa3', editable: true, description: 'Deployed ExamVaultAudit contract address' },
    { label: 'Network', value: 'Localhost (Hardhat)', editable: false, description: 'Active blockchain network' },
];

const initialHardwareSettings: SettingRow[] = [
    { label: 'API Key', value: 'eduvault_secure', editable: true, type: 'password', description: 'Must match x-api-key sent by ESP8266' },
    { label: 'Allowed User-Agent', value: 'ESP8266 / ESP32', editable: false, description: 'Only requests from this device type are accepted' },
    { label: 'Rate Limit', value: '100 req / min', editable: false, description: 'Global rate limit applied per IP' },
];

export default function SettingsPage() {
    const [blockchainSettings, setBlockchainSettings] = useState(initialBlockchainSettings);
    const [hardwareSettings] = useState(initialHardwareSettings);
    const [notifications, setNotifications] = useState({ failedLogins: true, systemAlerts: true, blockchainSync: false });
    const [isSaving, setIsSaving] = useState(false);

    const updateBlockchain = (idx: number, val: string) => {
        setBlockchainSettings(prev => prev.map((s, i) => i === idx ? { ...s, value: val } : s));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 900)); // simulate API call
        toast.success('Settings saved successfully!');
        setIsSaving(false);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">System Settings</h1>
                <p className="text-[var(--color-text-muted)]">
                    Configure blockchain, hardware, and notification settings for EduVaultX
                </p>
            </div>

            {/* Blockchain Settings */}
            <Card className="animate-fade-in">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                    <Database size={22} className="text-[var(--color-accent)]" />
                    Blockchain Configuration
                </h2>
                <div className="space-y-4">
                    {blockchainSettings.map((setting, idx) => (
                        <div key={setting.label} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                            <div>
                                <p className="font-medium text-[var(--color-text)] text-sm">{setting.label}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{setting.description}</p>
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type={setting.type || 'text'}
                                    value={setting.value}
                                    disabled={!setting.editable}
                                    onChange={(e) => updateBlockchain(idx, e.target.value)}
                                    className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Hardware Settings */}
            <Card className="animate-fade-in">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                    <Wifi size={22} className="text-[var(--color-accent)]" />
                    Hardware & Security Settings
                </h2>
                <div className="space-y-4">
                    {hardwareSettings.map((setting) => (
                        <div key={setting.label} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                            <div>
                                <p className="font-medium text-[var(--color-text)] text-sm">{setting.label}</p>
                                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{setting.description}</p>
                            </div>
                            <div className="md:col-span-2">
                                <input
                                    type={setting.type || 'text'}
                                    value={setting.value}
                                    disabled={!setting.editable}
                                    readOnly={!setting.editable}
                                    className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                                />
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
                        <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-yellow-400">
                            API Key changes require re-flashing the ESP8266 with the updated <code className="font-mono">HARDWARE_API_KEY</code> define in <code className="font-mono">rfid_auth.ino</code>.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Notifications */}
            <Card className="animate-fade-in">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                    <Bell size={22} className="text-[var(--color-accent)]" />
                    Notification Preferences
                </h2>
                <div className="space-y-4">
                    {[
                        { key: 'failedLogins' as const, label: 'Failed Login Alerts', desc: 'Notify when unauthorized access is attempted' },
                        { key: 'systemAlerts' as const, label: 'System Alerts', desc: 'Critical server and database errors' },
                        { key: 'blockchainSync' as const, label: 'Blockchain Sync Events', desc: 'Notify on every blockchain transaction' },
                    ].map(({ key, label, desc }) => (
                        <div key={key} className="flex items-center justify-between py-2">
                            <div>
                                <p className="font-medium text-[var(--color-text)] text-sm">{label}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
                            </div>
                            <button
                                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${notifications[key] ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'}`}
                            >
                                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${notifications[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>

            {/* System Info */}
            <Card className="animate-fade-in">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                    <Info size={22} className="text-[var(--color-accent)]" />
                    System Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'Backend', value: 'Node.js + Express v4', icon: Shield },
                        { label: 'Blockchain', value: 'Hardhat / Ethers v6', icon: Database },
                        { label: 'Hardware', value: 'ESP8266 + MFRC522', icon: Wifi },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-3 p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                            <Icon size={18} className="text-[var(--color-accent)]" />
                            <div>
                                <p className="text-xs text-[var(--color-text-muted)]">{label}</p>
                                <p className="font-medium text-[var(--color-text)] text-sm">{value}</p>
                            </div>
                            <CheckCircle size={14} className="text-green-500 ml-auto" />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Save + Reset */}
            <div className="flex gap-3 animate-fade-in">
                <Button onClick={handleSave} loading={isSaving}>
                    <Save size={16} />
                    Save Settings
                </Button>
                <Button variant="outline" onClick={() => { setBlockchainSettings(initialBlockchainSettings); toast.success('Settings reset to defaults'); }}>
                    <RefreshCw size={16} />
                    Reset to Defaults
                </Button>
            </div>
        </div>
    );
}
