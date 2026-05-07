import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, 
    ArrowRight, 
    Download, 
    ShieldCheck, 
    ShoppingCart, 
    DollarSign, 
    CheckCircle2, 
    ChevronRight,
    Activity,
    Lock,
    Zap,
    Key,
    Database,
    Cpu,
    ArrowUpRight,
    Search,
    Upload,
    FileText,
    UploadCloud
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import marketplaceService from '../services/marketplace';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ValidationReportModal from '../components/ValidationReportModal';

const DealsPage = () => {
    const { user } = useContext(AuthContext);
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeliverModal, setShowDeliverModal] = useState(false);
    const [deliverDealId, setDeliverDealId] = useState(null);
    const [deliveryFile, setDeliveryFile] = useState(null);
    const [isDelivering, setIsDelivering] = useState(false);
    const [deliveryResult, setDeliveryResult] = useState(null);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const data = await marketplaceService.getMyDeals();
            setDeals(data);
        } catch (err) {
            toast.error('Failed to synchronize transaction ledger.');
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (dealId) => {
        const tid = toast.loading('Establishing secure escrow channel...');
        try {
            await marketplaceService.payEscrow(dealId);
            toast.success('Escrow authorized. Asset decryption queued.', { id: tid });
            fetchDeals();
        } catch (err) {
            toast.error('Payment rejected: Escrow protocol error.', { id: tid });
        }
    };

    const handleDownload = async (dealId) => {
        const tid = toast.loading('Initiating secure asset retrieval...');
        try {
            const blob = await marketplaceService.downloadDataset(dealId);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dataset_${dealId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Asset successfully retrieved.', { id: tid });
        } catch (err) {
            console.error('Download error:', err);
            toast.error(err.response?.data?.detail || 'Retrieval failed: Asset locked or missing.', { id: tid });
        }
    };

    const handleDeliver = async () => {
        if (!deliveryFile) { toast.error('Please select a CSV file.'); return; }
        setIsDelivering(true);
        const tid = toast.loading('Running ML validation pipeline...');
        try {
            const formData = new FormData();
            formData.append('file', deliveryFile);
            const result = await marketplaceService.markDelivered(deliverDealId, formData);
            setDeliveryResult(result);
            toast.success(`Validation PASSED (Score: ${result.score?.toFixed(1)}%). Dataset delivered!`, { id: tid });
            fetchDeals();
        } catch (err) {
            const detail = err.response?.data?.detail || 'Delivery failed: Validation rejected.';
            toast.error(detail, { id: tid });
        } finally {
            setIsDelivering(false);
        }
    };

    const openDeliverModal = (dealId) => {
        setDeliverDealId(dealId);
        setDeliveryFile(null);
        setDeliveryResult(null);
        setShowDeliverModal(true);
    };

    const viewReport = async (deal) => {
        // Try to load from deal's veracity_report or fetch from history
        if (deal.veracity_report) {
            setSelectedReport(deal.veracity_report);
            setIsModalOpen(true);
        } else {
            try {
                const report = await marketplaceService.getValidationReportByDeal(deal.id);
                setSelectedReport(report);
                setIsModalOpen(true);
            } catch {
                toast.error('No validation report found for this deal.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans selection:bg-brand-100 selection:text-brand-900">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
                
                {/* ── HEADER ── */}
                <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-600">
                            <Lock size={18} strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Transaction Ledger</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tightest text-slate-900">
                            Operational <span className="text-brand-500">Trace</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-lg">
                            Monitor the veracity status and settlement cycle of your data acquisitions.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="secondary" className="h-14 rounded-2xl border-slate-200 px-8 bg-white">
                            <Download className="mr-2 w-4 h-4" /> Export Ledger
                        </Button>
                    </div>
                </div>

                {/* ── DEAL GRID ── */}
                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Activity className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                            <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Active Handshakes</h2>
                        </div>
                        <Badge variant="primary" className="bg-brand-50 text-brand-600 border-brand-200/50 px-4 py-1.5">Real-time Settlement Grid</Badge>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] animate-pulse border border-slate-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {deals.map((deal, idx) => (
                                    <motion.div
                                        key={deal.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="p-0 overflow-hidden border-slate-200 hover:border-brand-500/40 transition-all duration-500 group flex flex-col h-full bg-slate-50/30 hover:bg-white shadow-sm">
                                            {/* Status Header */}
                                            <div className="p-8 pb-0 flex justify-between items-start">
                                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg border border-white/10">
                                                    <Key size={20} strokeWidth={2.5} />
                                                </div>
                                                <Badge 
                                                    variant={deal.status === 'completed' ? 'success' : deal.status === 'paid' ? 'primary' : 'warning'}
                                                    className="uppercase tracking-widest text-[9px] font-black px-3 py-1.5 border-slate-200/50"
                                                >
                                                    {deal.status}
                                                </Badge>
                                            </div>

                                            <div className="p-8 space-y-6 flex-1 flex flex-col">
                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tightest line-clamp-1 group-hover:text-brand-600 transition-colors">
                                                        {deal.dataset?.title || deal.request?.title || `Requirement Fulfillment`}
                                                    </h3>
                                                    <p className="text-slate-500 font-medium text-sm">
                                                        Trace_ID: {String(deal.id ?? '').padStart(8, '0')} · {user?.role === 'buyer' ? `@${deal.seller_username}` : `@${deal.buyer_username}`}
                                                    </p>
                                                </div>

                                                <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Veracity Audit</span>
                                                        {deal.delivery_status === 'delivered' && (
                                                            <button 
                                                                onClick={() => viewReport(deal)}
                                                                className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors flex items-center"
                                                            >
                                                                View Report <ArrowRight className="ml-1 w-3 h-3" />
                                                            </button>
                                                        )}
                                                        {deal.delivery_status !== 'delivered' && (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Awaiting Delivery</span>
                                                        )}
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${deal.veracity_report?.final_score || 0}%` }}
                                                            className="h-full bg-audit-500 shadow-[0_0_10px_rgba(29,185,84,0.3)]"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Settlement</p>
                                                        <p className="text-2xl font-display font-bold text-slate-900 tracking-tightest">
                                                            ${deal.price}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Buyer Action Flow */}
                                                    {user?.role === 'buyer' && (
                                                        <div className="flex gap-4">
                                                            {deal.payment_status === 'pending' && (
                                                                <Button 
                                                                    variant="glow"
                                                                    onClick={() => handlePay(deal.id)}
                                                                    className="rounded-xl px-6 h-12"
                                                                >
                                                                    {deal.delivery_status === 'delivered' ? 'Verify & Pay' : 'Pay'} <DollarSign className="ml-2 w-4 h-4" />
                                                                </Button>
                                                            )}
                                                            
                                                            {deal.delivery_status === 'delivered' && (
                                                                <Button 
                                                                    variant={deal.payment_status === 'escrowed' ? "success" : "secondary"}
                                                                    onClick={() => deal.payment_status === 'escrowed' ? handleDownload(deal.id) : toast.error('Payment required to unlock download.')}
                                                                    className={`rounded-xl px-6 h-12 ${deal.payment_status === 'escrowed' ? 'bg-audit-500 hover:bg-audit-600 text-white shadow-[0_10px_20px_-10px_rgba(29,185,84,0.4)]' : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'}`}
                                                                >
                                                                    {deal.payment_status === 'escrowed' ? 'Download' : 'Locked'} {deal.payment_status === 'escrowed' ? <Download className="ml-2 w-4 h-4" /> : <Lock className="ml-2 w-4 h-4" />}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Seller Action Flow */}
                                                    {user?.role === 'seller' && deal.delivery_status !== 'delivered' && (
                                                        <Button
                                                            variant="glow"
                                                            onClick={() => { setSelectedDeal(deal); setShowDeliveryModal(true); }}
                                                            className="rounded-xl px-6 h-12 bg-brand-600 hover:bg-brand-700"
                                                        >
                                                            Deliver <UploadCloud className="ml-2 w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* ── EMPTY STATE ── */}
                {!loading && deals.length === 0 && (
                    <div className="py-32 text-center space-y-6 max-w-md mx-auto">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <ShoppingCart className="text-slate-200 w-12 h-12" />
                        </div>
                        <h3 className="text-3xl font-display font-bold text-slate-900 tracking-tightest">Ledger is void.</h3>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            No transactional handshakes have been localized for your node yet.
                        </p>
                        <Button variant="secondary" className="rounded-full px-8" onClick={() => window.location.href='/dashboard'}>
                            Explore Marketplace
                        </Button>
                    </div>
                )}
            </div>

            <ValidationReportModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                reportData={selectedReport}
            />

            {/* ── DELIVERY MODAL ── */}
            <AnimatePresence>
                {showDeliverModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => !isDelivering && setShowDeliverModal(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
                        >
                            <div className="p-10 space-y-8">
                                {/* Header */}
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest">
                                        <Zap size={12} /> Dataset Delivery Protocol
                                    </div>
                                    <h2 className="text-3xl font-display font-bold tracking-tightest text-slate-900">Upload Dataset</h2>
                                    <p className="text-slate-500 font-medium text-sm">The ML validation engine will automatically audit your CSV before delivery to the buyer.</p>
                                </div>

                                {/* File Upload Zone */}
                                {!deliveryResult && (
                                    <div className="space-y-6">
                                        <div className="relative group">
                                            <input
                                                type="file"
                                                accept=".csv"
                                                onChange={e => setDeliveryFile(e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                disabled={isDelivering}
                                            />
                                            <div className={`w-full p-10 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${
                                                deliveryFile ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-brand-400'
                                            }`}>
                                                <UploadCloud className={`w-12 h-12 ${deliveryFile ? 'text-brand-500' : 'text-slate-300'}`} />
                                                <span className="font-bold text-slate-700">{deliveryFile ? deliveryFile.name : 'Drop CSV or click to browse'}</span>
                                                <span className="text-[11px] text-slate-400 font-black uppercase tracking-widest">CSV Only • Max 100MB</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowDeliverModal(false)}
                                                disabled={isDelivering}
                                                className="flex-1 h-14 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDeliver}
                                                disabled={!deliveryFile || isDelivering}
                                                className="flex-[2] h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isDelivering ? (
                                                    <><span className="animate-spin mr-2">⟳</span> Validating...</>
                                                ) : (
                                                    <>Run ML Validation <Zap size={16} /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Validation Result */}
                                {deliveryResult && (
                                    <div className="space-y-6">
                                        <div className="p-8 rounded-3xl bg-audit-50 border border-audit-500/20 text-center space-y-3">
                                            <CheckCircle2 className="w-12 h-12 text-audit-500 mx-auto" />
                                            <h3 className="text-2xl font-display font-bold text-slate-900">Validation Passed!</h3>
                                            <div className="text-5xl font-bold text-audit-500">{deliveryResult.score?.toFixed(1)}%</div>
                                            <p className="text-slate-500 font-medium">Dataset has been delivered to the buyer. Escrow will release upon buyer confirmation.</p>
                                        </div>
                                        <div className="p-6 bg-slate-50 rounded-2xl">
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3">Report Summary</p>
                                            <div className="space-y-2">
                                                {deliveryResult.report?.all_reports && Object.entries(deliveryResult.report.all_reports).map(([key, data]) => (
                                                    <div key={key} className="flex justify-between items-center">
                                                        <span className="text-sm font-medium text-slate-600 capitalize">{key.replace(/_/g, ' ').replace('report', '')}</span>
                                                        <span className="text-sm font-bold text-slate-900">{(data.score || 0).toFixed(0)}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowDeliverModal(false)}
                                            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DealsPage;
