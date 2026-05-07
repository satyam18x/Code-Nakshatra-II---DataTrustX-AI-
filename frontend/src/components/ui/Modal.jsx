import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Positioning */}
                    <div className="flex min-h-full items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                            className={`relative w-full ${sizes[size]} bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-soft-xl border border-white/50 overflow-hidden z-[101]`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-8 border-b border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tightest uppercase">
                                    {title}
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-90"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-10">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
