'use client';

import { useState } from 'react';
import { FileText, CheckCircle, XCircle, Hash, AlertCircle, Loader2 } from 'lucide-react';
import { FileUpload } from '@/components/ui/FileUpload';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateFileHash } from '@/lib/utils';
import { storePaperHash } from '@/lib/blockchain';
import toast from 'react-hot-toast';

interface UploadResult {
    fileName: string;
    paperHash: string;
    txHash?: string;
    success: boolean;
}

export default function UploadPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<UploadResult | null>(null);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        setResult(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        setIsUploading(true);
        try {
            // Generate SHA-256 hash of the file
            const paperHash = await generateFileHash(selectedFile);

            // Store hash to blockchain (mocked)
            const blockchainResult = await storePaperHash(paperHash, {
                fileName: selectedFile.name,
                fileSize: selectedFile.size,
                uploadedAt: new Date().toISOString(),
            });

            setResult({
                fileName: selectedFile.name,
                paperHash,
                txHash: blockchainResult.txHash,
                success: blockchainResult.success,
            });

            if (blockchainResult.success) {
                toast.success('Paper uploaded and hash recorded on blockchain!');
            } else {
                toast.error('Hash generation succeeded but blockchain recording failed.');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        setResult(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 className="text-4xl font-bold text-[var(--color-text)] mb-2">File Upload</h1>
                <p className="text-[var(--color-text-muted)]">
                    Upload exam papers — SHA-256 hash is recorded on the blockchain for tamper-proof verification
                </p>
            </div>

            {/* Upload Card */}
            <Card className="animate-fade-in">
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                    <FileText size={22} className="text-[var(--color-accent)]" />
                    Upload Exam Paper
                </h2>

                <FileUpload
                    onFileSelect={handleFileSelect}
                    accept=".pdf,.doc,.docx,.txt"
                    maxSize={20}
                />

                {selectedFile && (
                    <div className="mt-4 p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg flex items-center justify-between animate-fade-in">
                        <div className="flex items-center gap-3">
                            <FileText size={18} className="text-[var(--color-accent)]" />
                            <div>
                                <p className="font-medium text-[var(--color-text)] text-sm">{selectedFile.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={handleUpload}
                                loading={isUploading}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                                ) : (
                                    'Upload & Hash'
                                )}
                            </Button>
                            <Button variant="outline" onClick={handleClear} disabled={isUploading}>
                                Clear
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Result Card */}
            {result && (
                <Card className="animate-fade-in">
                    <div className="flex items-center gap-3 mb-6">
                        {result.success ? (
                            <CheckCircle size={24} className="text-green-500" />
                        ) : (
                            <XCircle size={24} className="text-red-500" />
                        )}
                        <h2 className="text-xl font-bold text-[var(--color-text)]">
                            {result.success ? 'Upload Successful' : 'Upload Failed'}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                            <p className="text-sm text-[var(--color-text-muted)] mb-1">File Name</p>
                            <p className="font-medium text-[var(--color-text)]">{result.fileName}</p>
                        </div>

                        <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                            <p className="text-sm text-[var(--color-text-muted)] mb-1 flex items-center gap-2">
                                <Hash size={14} /> SHA-256 Paper Hash
                            </p>
                            <code className="text-xs font-mono text-[var(--color-accent)] break-all">
                                {result.paperHash}
                            </code>
                        </div>

                        {result.txHash && (
                            <div className="p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg">
                                <p className="text-sm text-[var(--color-text-muted)] mb-1">Blockchain Tx Hash</p>
                                <code className="text-xs font-mono text-green-500 break-all">
                                    {result.txHash}
                                </code>
                            </div>
                        )}
                    </div>
                </Card>
            )}

            {/* Info Card */}
            <Card className="animate-fade-in">
                <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-[var(--color-accent)] mt-0.5 flex-shrink-0" />
                    <div>
                        <h3 className="font-semibold text-[var(--color-text)] mb-2">How It Works</h3>
                        <ul className="text-sm text-[var(--color-text-muted)] space-y-1 list-disc list-inside">
                            <li>The file is hashed locally using SHA-256 — the file itself is never sent to the server</li>
                            <li>The hash is recorded on the blockchain as an immutable audit trail</li>
                            <li>Hardware (ESP8266) later scans and sends the UID → backend verifies against this hash</li>
                            <li>Any tampering with the original file will produce a different hash, triggering an alert</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
}
