import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    onClick,
    type = 'button',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed tracking-tight font-sans';

    const variants = {
        primary: 'bg-brand-500 hover:bg-brand-600 text-white shadow-[0_10px_20px_-10px_rgba(18,71,246,0.4)] hover:shadow-[0_15px_25px_-10px_rgba(18,71,246,0.5)] active:scale-[0.98]',
        secondary: 'bg-white border border-slate-200 hover:border-brand-500/50 hover:bg-brand-50/30 text-slate-700 hover:text-brand-600 shadow-premium active:scale-[0.98]',
        outline: 'border-2 border-brand-500 text-brand-500 hover:bg-brand-50 active:scale-[0.98]',
        ghost: 'hover:bg-slate-50 text-slate-500 hover:text-slate-900',
        danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_10px_20px_-10px_rgba(244,63,94,0.4)] active:scale-[0.98]',
        success: 'bg-audit-500 hover:bg-audit-600 text-white shadow-[0_10px_20px_-10px_rgba(29,185,84,0.4)] active:scale-[0.98]',
        glow: 'bg-brand-500 text-white shadow-[0_0_20px_rgba(18,71,246,0.3)] hover:shadow-[0_0_30px_rgba(18,71,246,0.5)] hover:bg-brand-600 active:scale-[0.98]',
        white: 'bg-white text-brand-500 hover:bg-slate-50 shadow-premium active:scale-[0.98]',
    };

    const sizes = {
        sm: 'px-4 py-2 text-[12px] rounded-xl',
        md: 'px-6 py-3 text-[14px] rounded-2xl',
        lg: 'px-8 py-4 text-[16px] rounded-2xl',
        xl: 'px-10 py-5 text-[18px] rounded-full',
    };

    return (
        <motion.button
            whileHover={{ y: disabled || isLoading ? 0 : -2 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
            type={type}
            disabled={disabled || isLoading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="uppercase tracking-widest text-[10px] font-black">Executing...</span>
                </div>
            ) : children}
        </motion.button>
    );
};

export default Button;
