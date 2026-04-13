import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    loading?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    children,
    loading = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-bold uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2 select-none';

    const variants = {
        primary: 'bg-black text-white hover:opacity-90 active:scale-[0.98]',
        secondary: 'bg-neutral-100 text-black hover:bg-neutral-200 active:scale-[0.98]',
        outline: 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white active:scale-[0.98]',
        danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50 active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[10px]',
        md: 'px-6 py-3 text-xs',
        lg: 'px-8 py-4 text-sm',
    };

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                (disabled || loading) && 'opacity-30 cursor-not-allowed pointer-events-none',
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {children}
        </button>
    );
}
