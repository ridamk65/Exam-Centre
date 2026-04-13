import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export function Card({ children, className }: CardProps) {
    return (
        <div
            className={cn(
                'card bg-white border border-neutral-200 p-6',
                className
            )}
        >
            {children}
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function MetricCard({ title, value, icon, trend }: MetricCardProps) {
    return (
        <Card className="animate-fade-in hover:border-black transition-colors">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black tracking-tighter">{value}</h3>
                    {trend && (
                        <p className={cn(
                            'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 inline-block',
                            trend.isPositive ? 'bg-neutral-100 text-black' : 'bg-red-50 text-red-600'
                        )}>
                            {trend.isPositive ? '+' : '-'} {Math.abs(trend.value)}%
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="w-10 h-10 border border-neutral-100 flex items-center justify-center">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
