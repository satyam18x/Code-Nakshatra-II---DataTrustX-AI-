import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import marketplaceService from '../services/marketplace';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldAlert,
    ShieldCheck,
    Settings,
    Users,
    TrendingUp,
    Activity,
    Lock,
    RotateCcw,
    FileText,
    ExternalLink,
    Search,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ValidationReportModal from '../components/ValidationReportModal';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [disputes, setDisputes] = useState([]);
    const [validations, setValidations] = useState([]);
    const [activeTab, setActiveTab] = useState('disputes');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [disputesRes, validationsRes] = await Promise.all([
                marketplaceService.getDisputesAdmin(),
                marketplaceService.getValidations()
            ]);
            setDisputes(disputesRes);
            setValidations(validationsRes);
        } catch (err) {
            toast.error("Failed to fetch administrative data.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewReport = async (reportId) => {
        const loadingToast = toast.loading('Retrieving cryptographic validation report...');
        try {
            const res = await marketplaceService.getValidationReportById(reportId);
            setSelectedReport(res);
            setIsReportModalOpen(true);
            toast.dismiss(loadingToast);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Report protocol error.", { id: loadingToast });
        }
    };

    const handleResolve = async (disputeId, action) => {
        const confirmMsg = action === 'release'
            ? 'Authorized Release: Grant funds to the seller? This protocol cannot be reversed.'
            : 'Authorized Refund: Return funds to the buyer? This protocol cannot be reversed.';

        if (!window.confirm(confirmMsg)) return;

        const loadingToast = toast.loading('Executing resolution protocol...');
        try {
            await marketplaceService.resolveDispute(disputeId, action);
            toast.success(`Resolution Successful: Funds ${action === 'release' ? 'disbursed' : 'reverted'}.`, { id: loadingToast });
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Execution failure.', { id: loadingToast });
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Card className="max-w-md p-12 text-center border-neutral-100 shadow-2xl shadow-neutral-200/50 rounded-[40px]">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <Lock className="w-10 h-10 text-indigo-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">Security Restriction</h2>
                    <p className="text-[15px] font-medium text-neutral-500 mb-10 leading-relaxed">
                        Your account does not possess the required clearance level to access the administrative control console.
                    </p>
                    <Button onClick={() => window.history.back()} className="w-full h-14 rounded-2xl font-bold">
                        Secure Return
                    </Button>
                </Card>
            </div>
        );
    }

    const stats = [
        { label: "Critical Conflicts", value: disputes.filter(d => d.deal_status !== 'resolved').length, icon: ShieldAlert, color: "text-red-600", bg: "bg-red-50" },
        { label: "Active Validation Nodes", value: validations.length, icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Total Network Peers", value: "1,280", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        { label: "Protocol Integrity", value: "99.9%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-8 px-2">
                <div>
                    <div className="flex items-center space-x-3 text-indigo-600 font-bold mb-3 tracking-widest uppercase text-[11px]">
                        <Settings className="w-4 h-4" />
                        <span>Core Infrastructure</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tightest">System Administration</h1>
                    <p className="text-lg text-neutral-500 mt-3 font-medium">Monitoring global exchange health and resolving high-fidelity conflicts.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="secondary" className="h-12 px-6 rounded-xl border-neutral-100 font-bold" onClick={fetchData}>
                        <RotateCcw className="w-4 h-4 mr-2.5" /> Synchronize
                    </Button>
                    <Button variant="glow" className="h-12 px-8 rounded-xl font-bold">
                        Node Management
                    </Button>

                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-8 group hover:border-indigo-500/20 transition-all duration-500 shadow-sm">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
                            </div>
                            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md tracking-tighter">+12.5%</span>
                        </div>
                        <p className="text-[12px] font-bold text-neutral-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-neutral-900 tracking-tight">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Main Console Section */}
            <div className="space-y-6">
                {/* Visual Tab Bar */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-2">
                    <div className="flex items-center space-x-10">
                        <button
                            onClick={() => setActiveTab('disputes')}
                            className={`relative pb-6 text-[15px] font-bold transition-all duration-300 ${activeTab === 'disputes'
                                ? 'text-indigo-600'
                                : 'text-neutral-400 hover:text-neutral-600'
                                }`}
                        >
                            Conflict Resolution ({disputes.filter(d => d.deal_status !== 'resolved').length})
                            {activeTab === 'disputes' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('validations')}
                            className={`relative pb-6 text-[15px] font-bold transition-all duration-300 ${activeTab === 'validations'
                                ? 'text-indigo-600'
                                : 'text-neutral-400 hover:text-neutral-600'
                                }`}
                        >
                            Log Audit Trail
                            {activeTab === 'validations' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                            )}
                        </button>

                    </div>
                </div>

                {isLoading ? (
                    <div className="grid gap-4">
                        <LoadingSkeleton count={3} type="card" className="h-24 rounded-3xl" />
                    </div>
                ) : (
                    <div className="bg-white border border-neutral-100/60 rounded-[32px] overflow-hidden shadow-2xl shadow-neutral-200/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                {activeTab === 'disputes' ? (
                                    <>
                                        <thead>
                                            <tr className="bg-neutral-50/50">
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Conflict Identifier</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Participating Entities</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Dispute Logic</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Security Status</th>
                                                <th className="px-8 py-5 text-right text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {disputes.length === 0 ? (
                                                <tr><td colSpan="5" className="px-8 py-20 text-center"><EmptyState title="Clear Queue" description="All exchange conflicts have been successfully arbitrated." /></td></tr>
                                            ) : (
                                                disputes.map((dispute) => (
                                                    <tr key={dispute.dispute_id} className="hover:bg-neutral-50/50 transition-colors duration-300">
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-neutral-900 tracking-tight">#{dispute.dispute_id}</span>
                                                                <span className="text-[11px] font-bold text-neutral-400 uppercase mt-1">Ref: {dispute.deal_id}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <Badge variant={dispute.opened_by === 'buyer' ? 'primary' : 'purple'} className="py-1 px-3 rounded-lg text-[10px] font-black">
                                                                INITIATED BY {dispute.opened_by?.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="text-[14px] text-neutral-600 font-medium max-w-xs leading-relaxed">{dispute.reason}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {dispute.deal_status === 'resolved' ? (
                                                                <div className="flex items-center space-x-2 text-emerald-600">
                                                                    <ShieldCheck className="w-4 h-4" />
                                                                    <span className="text-[12px] font-bold">Resolved</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center space-x-2 text-red-600">
                                                                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                                                    <span className="text-[12px] font-bold">Priority Conflict</span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            {dispute.deal_status !== 'resolved' ? (
                                                                <div className="flex justify-end space-x-3">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        className="rounded-xl text-[11px] font-bold h-10 px-4 border-neutral-200"
                                                                        onClick={() => handleResolve(dispute.dispute_id, 'release')}
                                                                    >
                                                                        Disburse Funds
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        className="rounded-xl text-[11px] font-bold h-10 px-4"
                                                                        onClick={() => handleResolve(dispute.dispute_id, 'refund')}
                                                                    >
                                                                        Execute Refund
                                                                    </Button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[12px] font-bold text-neutral-400 italic">
                                                                    {dispute.resolution}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </>
                                ) : (
                                    <>
                                        <thead>
                                            <tr className="bg-neutral-50/50">
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Audit Trace</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Origin Peer</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Verification Density</th>
                                                <th className="px-8 py-5 text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Technical Verdict</th>
                                                <th className="px-8 py-5 text-right text-[11px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100">
                                            {validations.length === 0 ? (
                                                <tr><td colSpan="5" className="px-8 py-20 text-center"><EmptyState title="No logs" description="The system audit trail is currently empty." /></td></tr>
                                            ) : (
                                                validations.map((v) => (
                                                    <tr key={v.id} className="hover:bg-neutral-50/50 transition-colors duration-300">
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-neutral-900 tracking-tight">TRC-{v.id}</span>
                                                                <span className="text-[11px] font-bold text-neutral-400 uppercase mt-1">{new Date(v.created_at).toLocaleTimeString()}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="text-[14px] font-bold text-indigo-600">@{v.username}</span>
                                                        </td>

                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex-1 w-24 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                                                    <motion.div
                                                                        initial={{ width: 0 }}
                                                                        animate={{ width: `${v.final_score}%` }}
                                                                        className={`h-full ${v.final_score >= 80 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                                                                    />
                                                                </div>

                                                                <span className="text-[13px] font-black text-neutral-700">{v.final_score?.toFixed(1)}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <Badge variant={v.status === 'passed' ? 'success' : 'danger'} className="font-black text-[10px] tracking-widest">
                                                                {v.status?.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <button
                                                                onClick={() => handleViewReport(v.id)}
                                                                className="inline-flex items-center text-[12px] font-bold text-indigo-600 hover:text-indigo-700 transition-colors group"
                                                            >
                                                                Full Technical Audit
                                                                <ExternalLink className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
                                                            </button>
                                                        </td>

                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </>
                                )}
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <ValidationReportModal
                isOpen={isReportModalOpen}
                onClose={() => setIsReportModalOpen(false)}
                reportData={selectedReport}
            />
        </div>
    );
};

export default AdminDashboard;
