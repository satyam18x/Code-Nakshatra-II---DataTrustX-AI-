import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ArrowRight, ShieldCheck, User, Handshake } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const loadingToast = toast.loading('Initializing handshake protocol...');

        try {
            await login(credentials.username, credentials.password);
            toast.success('Protocol Synchronization Complete.', { id: loadingToast });
            navigate('/dashboard');
        } catch (err) {
            toast.error('Authentication Failure: Unauthorized node.', { id: loadingToast });
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
                        <Badge className="bg-brand-950 text-brand-400 border-brand-500/20 px-4 py-2">
                            Security Layer v4.0
                        </Badge>
                        <h2 className="font-display text-6xl font-bold text-white leading-[1.05] tracking-tightest">
                            Access the <br />
                            <span className="text-brand-500">veracity</span> <br />
                            engine.
                        </h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                            Synchronize your node identity to resume secure data acquisitions and settlements.
                        </p>
                    </div>

                    <div className="h-px bg-white/10 w-full" />
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <ShieldCheck size={24} className="text-brand-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold tracking-tight">Encrypted Session</p>
                                <p className="text-slate-500 text-sm">Military-grade AES-256 Auth</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest opacity-50">
                        TRUSTLESS INFRASTRUCTURE · AUTH_NODE_ALPHA
                    </p>
                </div>
            </motion.div>

            {/* ── RIGHT PANEL: Handshake Form ── */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-[440px] space-y-12"
                >
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-brand-600 font-black text-[11px] uppercase tracking-[0.2em]">
                            <Lock size={14} />
                            <span>Authorization Required</span>
                        </div>
                        <h1 className="font-display text-5xl font-bold text-slate-900 tracking-tightest">Sign In.</h1>
                        <p className="text-slate-500 font-medium">Transmit your credentials to establish a secure handshake.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-6">
                            <Input
                                label="Protocol Identity"
                                name="username"
                                placeholder="Username / Node ID"
                                icon={User}
                                required
                                value={credentials.username}
                                onChange={handleChange}
                            />

                            <div className="space-y-1">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Secure Access Key</label>
                                    <Link to="#" className="text-[10px] font-bold text-brand-600 hover:underline uppercase tracking-widest">Reset Key</Link>
                                </div>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="Enter high-entropy password"
                                    icon={Lock}
                                    required
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="glow"
                            size="xl"
                            className="w-full rounded-full"
                            isLoading={isLoading}
                        >
                            Authorize Access <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
                        </Button>

                        <div className="pt-6 text-center">
                            <p className="text-[14px] text-slate-500 font-medium">
                                New node identity?{' '}
                                <Link to="/register" className="text-brand-600 font-bold hover:underline underline-offset-4 ml-1">
                                    Initialize Registration
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

export default Login;
