import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Lock, UserPlus, ArrowLeft,
    ShoppingCart, Tag, CheckCircle2, Handshake, ShieldCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Register = () => {
    const [user, setUser] = useState({ username: '', password: '', role: 'buyer' });
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
    const handleRole = (role) => setUser({ ...user, role });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const tid = toast.loading('Initializing protocol registration…');
        try {
            await signup(user.username, user.password, user.role);
            toast.success('Node established! Authorization granted.', { id: tid });
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Handshake failed. Node rejected.', { id: tid });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-brand-100 selection:text-brand-900">
            {/* ── LEFT PANEL: Technical Identity ── */}
            <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:flex w-[42%] bg-slate-900 p-16 flex-col justify-between relative overflow-hidden"
            >
                {/* Visual Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-audit-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

                <Link to="/" className="flex items-center space-x-3 group relative z-10">
                    <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow group-hover:rotate-6 transition-transform">
                        <Handshake size={22} className="text-white" strokeWidth={2.5} />
                    </div>
                    <span className="font-display text-xl font-bold text-white tracking-tightest">
                        DataTrust<span className="text-brand-400">X</span>
                    </span>
                </Link>

                <div className="relative z-10 space-y-12">
                    <div className="space-y-6">
                        <Badge className="bg-audit-900 text-audit-500 border-audit-600/20 px-4 py-2">
                            Institutional Grade
                        </Badge>
                        <h2 className="font-display text-6xl font-bold text-white leading-[1.05] tracking-tightest">
                            Join the <br />
                            <span className="text-audit-500">verified</span> <br />
                            grid.
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Orchestrating high-stakes data transactions through autonomous ML verification and secure escrow.
                        </p>
                    </div>

                    <div className="h-px bg-white/10 w-full" />

                    <div className="flex gap-10">
                        {[
                            { label: "Veracity", value: "99.9%" },
                            { label: "Nodes", value: "2.4k+" },
                            { label: "Latency", value: "<12ms" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-audit-500 font-display text-2xl font-bold">{stat.value}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-50">
                        © 2026 DataTrustX Protocols · SECURED BY NEURAL CORE
                    </p>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL: Initialization Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-[480px] space-y-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-brand-600 font-black text-[11px] uppercase tracking-[0.2em]">
                            <ShieldCheck size={14} />
                            <span>Node Initialization</span>
                        </div>
                        <h1 className="font-display text-5xl font-bold text-slate-900 tracking-tightest">Create Identity.</h1>
                        <p className="text-slate-500 font-medium">Select your operational role and establish credentials.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        {/* Role Selection */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Protocol Role</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'buyer', icon: ShoppingCart, label: 'Buyer', desc: 'Acquire verified data' },
                                    { id: 'seller', icon: Tag, label: 'Seller', desc: 'Monetize assets' }
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => handleRole(role.id)}
                                        className={`relative p-6 rounded-3xl border-2 text-left transition-all duration-300 group overflow-hidden ${
                                            user.role === role.id 
                                            ? 'border-brand-500 bg-brand-50/50 shadow-sm' 
                                            : 'border-slate-100 bg-slate-50 hover:border-brand-200'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                                            user.role === role.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-400'
                                        }`}>
                                            <role.icon size={20} strokeWidth={2.5} />
                                        </div>
                                        <p className={`font-bold tracking-tight mb-1 ${user.role === role.id ? 'text-brand-900' : 'text-slate-900'}`}>
                                            {role.label}
                                        </p>
                                        <p className="text-[11px] font-medium text-slate-400 leading-tight">{role.desc}</p>
                                        
                                        <AnimatePresence>
                                            {user.role === role.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.5 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.5 }}
                                                    className="absolute top-4 right-4"
                                                >
                                                    <CheckCircle2 size={16} className="text-brand-600" strokeWidth={3} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <Input
                                label="Protocol Username"
                                name="username"
                                placeholder="Choose your node identifier"
                                icon={User}
                                required
                                value={user.username}
                                onChange={handleChange}
                            />
                            <Input
                                label="Secure Access Key"
                                name="password"
                                type="password"
                                placeholder="Establish a high-entropy key"
                                icon={Lock}
                                required
                                value={user.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="flex items-start space-x-3 px-1">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                className="mt-1 h-4 w-4 rounded border-slate-200 text-brand-600 focus:ring-brand-500"
                            />
                            <label htmlFor="terms" className="text-[13px] text-slate-500 font-medium leading-relaxed">
                                I authorize the node establishment and agree to the <Link to="#" className="text-brand-600 font-bold hover:underline underline-offset-4">Governance Protocols</Link>.
                            </label>
                        </div>

                        <Button
                            type="submit"
                            variant="glow"
                            size="xl"
                            className="w-full rounded-full"
                            isLoading={isLoading}
                        >
                            Initialize Account <UserPlus className="ml-2 w-5 h-5" strokeWidth={3} />
                        </Button>

                        <div className="pt-6 text-center">
                            <p className="text-[14px] text-slate-500 font-medium">
                                Existing node?{' '}
                                <Link to="/login" className="text-brand-600 font-bold hover:underline underline-offset-4 ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>

                    <div className="text-center">
                        <Link to="/" className="inline-flex items-center text-[12px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors group">
                            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Abort to Mesh
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;