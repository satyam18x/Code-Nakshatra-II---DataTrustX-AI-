import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, variant = 'default', ...props }) => {
    const variants = {
        default: 'bg-white border border-slate-200 shadow-premium',
        glass: 'bg-white/70 backdrop-blur-md border border-white/20 shadow-premium',
        premium: 'bg-white border border-slate-100 shadow-soft-xl',
        dark: 'bg-slate-900 border border-slate-800 text-white shadow-premium',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -8, transition: { duration: 0.3, ease: 'easeOut' } } : {}}
            className={`rounded-[2.5rem] p-8 ${variants[variant]} ${className} transition-colors duration-300`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
