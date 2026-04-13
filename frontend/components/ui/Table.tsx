import React from 'react';
import { cn } from '@/lib/utils';

interface TableProps {
    headers: string[];
    children: React.ReactNode;
    className?: string;
}

export function Table({ headers, children, className }: TableProps) {
    return (
        <div className={cn('overflow-hidden border border-neutral-200 bg-white shadow-sm', className)}>
            <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

interface TableRowProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
    return (
        <tr
            onClick={onClick}
            className={cn(
                'group hover:bg-neutral-50 transition-colors',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </tr>
    );
}

interface TableCellProps {
    children: React.ReactNode;
    className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
    return (
        <td className={cn('px-6 py-4 text-sm text-neutral-600 font-medium group-hover:text-black transition-colors', className)}>
            {children}
        </td>
    );
}
