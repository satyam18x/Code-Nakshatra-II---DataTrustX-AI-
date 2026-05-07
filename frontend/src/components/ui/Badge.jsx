import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700',
        primary: 'bg-brand-50 text-brand-700 border border-brand-100/50',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-100/50',
        warning: 'bg-amber-50 text-amber-700 border border-amber-100/50',
        danger: 'bg-rose-50 text-rose-700 border border-rose-100/50',
        purple: 'bg-violet-50 text-violet-700 border border-violet-100/50',
        cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-100/50',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
