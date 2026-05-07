import React from 'react';
import { motion } from 'framer-motion';
import {
    ShieldCheck,
    Zap,
    Globe,
    Lock,
    ArrowRight,
    Search,
    Database,
    LineChart,
    Activity,
    Cpu,
    Network,
    Key,
    Handshake,
    ChevronRight,
    MousePointer2,
    Boxes
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import heroVisual from '../assets/hero-visual.png';

const Home = () => {
    const features = [
        {
            title: "Neural Verification",
            description: "Proprietary AI engines audit every dataset for statistical veracity and semantic integrity before any transaction occurs.",
            icon: Cpu,
            color: "text-brand-500"
        },
        {
            title: "Non-Custodial Escrow",
            description: "Assets are isolated in secure cryptographic containers, only releasing funds upon successful veracity attestation.",
            icon: Lock,
            color: "text-audit-500"
        },
        {
            title: "Veracity Oracle",
            description: "A decentralized consensus network that validates data quality and authenticity across multi-node intelligence grids.",
            icon: Network,
            color: "text-brand-500"
        },
        {
            title: "Atomic Settlement",
            description: "Instantaneous transfer of ownership and funds occurs at the exact microsecond the verification logic clears.",
            icon: Zap,
            color: "text-audit-500"
        }
    ];

    return (
        <div className="bg-white min-h-screen overflow-x-hidden font-sans selection:bg-brand-100 selection:text-brand-900">
            {/* ── HERO SECTION ── */}
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24">
                {/* Visual Architecture */}
                <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50/40 via-white to-transparent -z-10" />
                <div className="absolute top-12 left-0 w-[400px] h-[400px] bg-audit-50/15 rounded-full blur-[100px] -z-10" />
                
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Hero Content */}
                        <div className="lg:w-3/5 space-y-6 lg:space-y-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100"
                                >
                                    <Badge variant="primary" className="bg-brand-600 text-white border-transparent">Protocol v4.0</Badge>
                                    <span className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">Autonomous Data Governance</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-6xl sm:text-7xl lg:text-[90px] font-display font-bold tracking-tightest leading-[0.9] text-slate-900"
                                >
                                    Decentralized Data <br />
                                    <span className="text-brand-500">Marketplace.</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-lg lg:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl"
                                >
                                    Orchestrating the world's most sensitive data acquisitions through autonomous neural verification and cryptographic settlement.
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-col sm:flex-row items-center gap-4"
                            >
                                <Link to="/register">
                                    <Button variant="glow" size="xl" className="group rounded-full px-10 h-14">
                                        Join the Mesh <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="secondary" size="xl" className="border-slate-200 rounded-full px-10 h-14 hover:bg-slate-50 bg-white">
                                        Authorize Node
                                    </Button>
                                </Link>
                            </motion.div>

                            {/* Trust Signals */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-100"
                            >
                                <div>
                                    <p className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tightest">99.9%</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Veracity Index</p>
                                </div>
                                <div>
                                    <p className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tightest">12ms</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Audit Latency</p>
                                </div>
                                <div>
                                    <p className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tightest">$42M+</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Escrow Volume</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Hero Visual: Neural Core */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="lg:w-2/5 relative mt-8 lg:mt-0"
                        >
                            <div className="absolute -inset-6 bg-brand-500/5 rounded-full blur-[60px] animate-pulse-slow" />
                            <div className="relative p-1 bg-slate-100 rounded-[2rem] shadow-premium">
                                <div className="bg-white rounded-[1.8rem] overflow-hidden p-3">
                                    <img 
                                        src={heroVisual} 
                                        alt="Neural Core Visualization" 
                                        className="w-full h-auto rounded-[1.5rem] shadow-soft-xl hover:scale-105 transition-transform duration-1000"
                                    />
                                </div>
                            </div>
                            
                            {/* Live Floating Node */}
                            <motion.div 
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 p-4 bg-slate-900 rounded-[1.5rem] shadow-2xl border border-white/10 hidden xl:block"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-audit-500 rounded-lg flex items-center justify-center shadow-[0_0_12px_rgba(29,185,84,0.3)]">
                                        <Activity size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm leading-tight">Handshake_OK</p>
                                        <p className="text-audit-500 text-[8px] font-black uppercase tracking-widest">Node #882 Verified</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES SECTION (Bento Grid) ── */}
            <section className="py-24 relative bg-slate-50/50">
                <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-16">
                    <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-xl space-y-4">
                            <Badge className="bg-brand-50 text-brand-600 border-brand-100/50 px-4 py-1.5">Infrastructure</Badge>
                            <h2 className="text-5xl lg:text-6xl font-display font-bold tracking-tightest leading-[1.05] text-slate-900">
                                Engineered for <br /> Absolute Certainty.
                            </h2>
                        </div>
                        <p className="text-lg text-slate-500 font-medium max-w-sm lg:text-right leading-relaxed">
                            A proprietary architecture that decouples acquisition from risk through autonomous verification.
                        </p>
                    </div>

                    <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bento-card group"
                            >
                                <div className={`w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-600 transition-colors duration-500 shadow-sm border border-slate-100`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color} group-hover:text-white transition-colors duration-500`} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-display font-bold text-slate-900 tracking-tightest mb-3">{feature.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TECHNICAL VISUALIZATION ── */}
            <section className="py-24 px-6">
                <div className="max-w-[1400px] mx-auto bg-slate-900 rounded-[3rem] overflow-hidden relative border border-white/5">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px] -mr-80 -mt-80" />
                    
                    <div className="p-10 lg:p-20 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <Badge className="bg-white/10 text-brand-400 border-white/5 px-4 py-1.5">The Protocol</Badge>
                                <h2 className="text-5xl lg:text-6xl font-display font-bold text-white tracking-tightest leading-[1.05]">Fluid Execution. <br /> Atomic Settlement.</h2>
                                <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
                                    We isolate transactional risk by decoupling data delivery from asset release through an autonomous verification middle-layer.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { step: "01", title: "Oracle Constraint Mapping", desc: "Define statistical and semantic benchmarks for acquisition." },
                                    { step: "02", title: "Non-Custodial Transmission", desc: "Data assets are delivered to a secure verification node, never the buyer." },
                                    { step: "03", title: "Veracity Attestation", desc: "Upon verification, assets are released and funds disbursed instantly." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <span className="text-4xl font-display font-bold text-slate-800 group-hover:text-brand-500 transition-colors">{item.step}</span>
                                        <div className="space-y-1 pt-1.5">
                                            <h4 className="text-lg font-bold text-white tracking-tight">{item.title}</h4>
                                            <p className="text-slate-500 font-medium text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="p-1 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                                <div className="p-8 lg:p-12 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow border border-white/10">
                                                <Boxes size={24} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-white tracking-tight">Neural Core Trace</p>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Verification Hub #10</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 text-audit-500 bg-audit-900/50 px-3 py-1.5 rounded-lg border border-audit-600/20">
                                            <div className="w-2 h-2 bg-audit-500 rounded-full animate-pulse" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Active Audit</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {[
                                            { label: "Statistical Veracity", value: "98.8%", pass: true },
                                            { label: "Schema Integrity", value: "Verified", pass: true },
                                            { label: "Semantic Drift", value: "0.02%", pass: true }
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-xl border border-white/5 group hover:border-brand-500/30 transition-all">
                                                <span className="text-slate-300 font-medium text-sm">{stat.label}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-brand-400 font-bold text-sm">{stat.value}</span>
                                                    <ShieldCheck size={16} className="text-audit-500" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button variant="glow" size="lg" className="w-full rounded-xl h-14">
                                        View Infrastructure Status
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── GLOBAL CTA ── */}
            <section className="py-24 px-6 text-center bg-slate-50/30 border-y border-slate-100">
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                    >
                        <Badge variant="primary" className="px-6 py-2 rounded-full">Final Release</Badge>
                        <h2 className="text-6xl lg:text-8xl font-display font-bold tracking-tightest leading-none text-slate-900">
                            The future of data <br /> is <span className="text-brand-500">verified.</span>
                        </h2>
                        <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Join the network and start transacting with absolute integrity and cryptographic certainty.
                        </p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link to="/register">
                            <Button variant="glow" size="xl" className="min-w-[260px] rounded-full h-16">Initialize Your Node</Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="xl" className="min-w-[260px] rounded-full h-16 border-slate-200 bg-white">Contact Protocol Team</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── MINIMAL FOOTER ── */}
            <footer className="py-12 bg-white">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg border border-white/10">
                            <Handshake size={18} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-xs font-black tracking-tightest uppercase font-display text-slate-900">DataTrustX AI</span>
                    </div>
                    <div className="flex space-x-10">
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-600 transition-colors">Documentation</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-600 transition-colors">Governance</a>
                        <a href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-brand-600 transition-colors">Security</a>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 DataTrustX Protocols. ALL SYSTEMS NOMINAL.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
