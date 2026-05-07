import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { 
    ShieldCheck, 
    BarChart3, 
    Terminal, 
    Clock, 
    TrendingUp, 
    History, 
    Search, 
    Download, 
    ExternalLink, 
    ChevronRight,
    Activity,
    Lock,
    Cpu,
    Fingerprint,
    Zap,
    Layers,
    ArrowUpRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ValidationReportModal from '../components/ValidationReportModal';
import marketplaceService from '../services/marketplace';

const ValidationHistory = () => {
    const { user } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await marketplaceService.getValidationHistory();
            setHistory(data);
        } catch (err) {
            toast.error('Failed to retrieve veracity audit logs.');
        } finally {
            setIsLoading(false);
        }
    };

    const viewReport = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-audit-500';
        if (score >= 70) return 'text-brand-500';
        return 'text-rose-500';
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans selection:bg-brand-100 selection:text-brand-900">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
                
                {/* ── HEADER ── */}
                <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-600">
                            <Fingerprint size={18} strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Neural Audit Trails</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tightest text-slate-900">
                            Veracity <span className="text-brand-500">History</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-lg">
                            Historical trace of autonomous ML audits performed across your node network.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="h-14 rounded-2xl border-slate-200 px-8 bg-white">
                            <Download className="mr-2 w-4 h-4" /> Download Logs
                        </Button>
                    </div>
                </div>

                {/* ── METRICS OVERVIEW ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Integrity Index", value: "98.8%", icon: ShieldCheck, color: "text-audit-500" },
                        { label: "Total Audits", value: history.length.toString().padStart(2, '0'), icon: Activity, color: "text-brand-500" },
                        { label: "System Uptime", value: "99.99%", icon: Zap, color: "text-brand-500" }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border border-slate-200 bg-white flex items-center justify-between group hover:border-brand-500/30 hover:shadow-soft-xl transition-all">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                <p className={`text-4xl font-display font-bold ${stat.color} tracking-tightest`}>{stat.value}</p>
                            </div>
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-brand-500 transition-colors border border-slate-100">
                                <stat.icon size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── HISTORY TABLE ── */}
                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <History className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                            <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Audit Records</h2>
                        </div>
                        <Badge variant="primary" className="bg-brand-50 text-brand-600 border-brand-200/50 px-4 py-1.5">Cryptographic Trace Live</Badge>
                    </div>

                    <Card className="p-0 overflow-hidden border-slate-200 shadow-sm bg-slate-50/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Audit_ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Integrity Score</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {isLoading ? (
                                        [1, 2, 3].map(i => (
                                            <tr key={i} className="animate-pulse">
                                                <td colSpan="5" className="px-8 py-6 h-20 bg-slate-50/20" />
                                            </tr>
                                        ))
                                    ) : history.map((record, idx) => (
                                        <motion.tr 
                                            key={record.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-white transition-colors group"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-3">
                                                    <Clock size={16} className="text-slate-300" />
                                                    <span className="font-medium text-slate-600">
                                                        {new Date(record.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-mono text-[12px] text-slate-400">
                                                TRACE_{String(record.id ?? '').padStart(8, '0').toUpperCase()}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                                        <div 
                                                            className={`h-full ${record.final_score >= 80 ? 'bg-audit-500' : 'bg-brand-500'}`} 
                                                            style={{ width: `${record.final_score}%` }} 
                                                        />
                                                    </div>
                                                    <span className={`font-display font-bold text-xl tracking-tightest ${getScoreColor(record.final_score)}`}>
                                                        {record.final_score}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge 
                                                    variant={record.status === 'PASS' || record.status === 'passed' ? 'success' : 'danger'}
                                                    className="uppercase tracking-widest text-[9px] font-black px-3 py-1"
                                                >
                                                    {record.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => viewReport(record)}
                                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm"
                                                >
                                                    <ArrowUpRight size={18} strokeWidth={2.5} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* ── EMPTY STATE ── */}
                {!isLoading && history.length === 0 && (
                    <div className="py-32 text-center space-y-6 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <Terminal className="text-slate-200 w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tightest">Audit log empty.</h3>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            No autonomous veracity audits have been processed through your node environment yet.
                        </p>
                        <Button variant="secondary" className="rounded-full px-8" onClick={fetchHistory}>
                            Force Protocol Refresh
                        </Button>
                    </div>
                )}
            </div>

            <ValidationReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reportData={selectedReport}
            />
        </div>
    );
};

export default ValidationHistory;
