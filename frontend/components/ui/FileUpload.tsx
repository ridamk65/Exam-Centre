'use client';

import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
}

export function FileUpload({ onFileSelect, accept = '.pdf,.doc,.docx', maxSize = 10, className }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDragIn = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragOut = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const validateFile = useCallback((file: File): boolean => {
        setError(null);

        if (maxSize && file.size > maxSize * 1024 * 1024) {
            setError(`File size must be less than ${maxSize}MB`);
            return false;
        }

        return true;
    }, [maxSize]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect, validateFile]);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    return (
        <div className={cn('w-full', className)}>
            <div
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                    'border-2 border-dashed rounded-[var(--radius-lg)] p-12 text-center transition-all duration-300',
                    isDragging
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] bg-opacity-10 scale-105'
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                )}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileInput}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                        <div className={cn(
                            'p-4 rounded-full transition-all duration-300',
                            isDragging ? 'bg-[var(--color-accent)] text-white scale-110' : 'bg-[var(--color-primary)] bg-opacity-10 text-[var(--color-accent)]'
                        )}>
                            <Upload size={48} />
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-[var(--color-text)] mb-2">
                                {isDragging ? 'Drop file here' : 'Drag & drop exam paper here'}
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                or click to browse (max {maxSize}MB)
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                Supported formats: {accept}
                            </p>
                        </div>
                    </div>
                </label>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-2 animate-fade-in">{error}</p>
            )}
        </div>
    );
}
