import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Handshake, ChevronRight, LayoutDashboard, LogOut, ShieldCheck, Activity } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Marketplace', path: '/#marketplace' },
        { name: 'Protocol', path: '/#protocol' },
        { name: 'Governance', path: '/#governance' },
    ];

    const authLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Ledger', path: '/deals', icon: Activity },
        { name: 'Audits', path: '/history', icon: ShieldCheck },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'py-5 bg-slate-50/80 backdrop-blur-md border-b border-slate-100'
        }`}>
            <div className="max-w-[1400px] mx-auto px-6 sm:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 group relative z-10">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                        <Handshake size={22} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl font-bold text-slate-900 tracking-tightest">
                        DataTrust<span className="text-brand-500">X</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center space-x-10">
                    <div className="flex items-center space-x-8">
                        {(isAuthenticated ? authLinks : navLinks).map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[12px] font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
                                    location.pathname === link.path ? 'text-brand-600' : 'text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                {link.icon && <link.icon size={14} />}
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="h-4 w-px bg-slate-100" />

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authorized Node</span>
                                    <span className="text-sm font-bold text-slate-900">@{user?.username}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-slate-500 font-bold px-6">Sign In</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="glow" className="rounded-full px-8 shadow-glow">Initialize Node</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="lg:hidden p-3 bg-slate-50 rounded-xl text-slate-900"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl p-6 space-y-8"
                    >
                        <div className="flex flex-col space-y-6">
                            {(isAuthenticated ? authLinks : navLinks).map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-bold text-slate-900 flex items-center gap-3"
                                >
                                    {link.icon && <link.icon size={20} className="text-brand-600" />}
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-6 border-t border-slate-50 flex flex-col space-y-4">
                            {isAuthenticated ? (
                                <Button variant="secondary" className="w-full h-14 rounded-2xl border-rose-100 text-rose-500" onClick={handleLogout}>
                                    Terminate Session
                                </Button>
                            ) : (
                                <>
                                    <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                                        <Button variant="secondary" className="w-full h-14 rounded-2xl">Sign In</Button>
                                    </Link>
                                    <Link to="/register" className="w-full" onClick={() => setIsOpen(false)}>
                                        <Button variant="glow" className="w-full h-14 rounded-2xl">Initialize Node</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
