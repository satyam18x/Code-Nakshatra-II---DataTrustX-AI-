import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Filter, Database, TrendingUp, Activity, 
    DollarSign, Clock, ShieldCheck, ChevronRight, ArrowUpRight,
    BarChart3, Layers, Cpu, Lock, Download, Zap, Globe
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import marketplaceService from '../services/marketplace';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const SellerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [myDatasets, setMyDatasets] = useState([]);
    const [marketRequests, setMarketRequests] = useState([]);
    const [activeDeals, setActiveDeals] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newDataset, setNewDataset] = useState({ title: '', description: '', price: '', file_url: 'mock_url_placeholder' });

    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [offerForm, setOfferForm] = useState({ price: '', message: '' });

    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState(null);
    const [deliveryFile, setDeliveryFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [datasets, requests, deals, stats] = await Promise.all([
                marketplaceService.getAllDatasets(),
                marketplaceService.getAllRequests(),
                marketplaceService.getMyDeals(),
                marketplaceService.getSellerStats()
            ]);

            console.log("DEBUG: Seller Dashboard Data", { datasets, requests, deals, stats });

            setMyDatasets(Array.isArray(datasets) ? datasets : []);
            setMarketRequests(Array.isArray(requests) ? requests : []);
            setActiveDeals(Array.isArray(deals) ? deals : []);
            setStatsData(stats);
            
            if (requests.length > 0) {
                toast.success(`Synchronized: ${requests.length} broadcasts found.`);
            }
        } catch (err) {
            console.error("CRITICAL: Dashboard synchronization failed.", err);
            // If it's a 401, the interceptor in api.js will handle redirect
            if (err.response?.status !== 401) {
                toast.error('Global Grid synchronization failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const tid = toast.loading('Establishing neural asset handshake...');
        try {
            await marketplaceService.createDataset(newDataset);
            toast.success('Asset localized. Veracity engine queued.', { id: tid });
            setShowUploadModal(false);
            fetchData();
        } catch (err) {
            toast.error('Initialization failed: Asset rejected by protocol.', { id: tid });
        }
    };

    const handleCreateOffer = async (e) => {
        e.preventDefault();
        const tid = toast.loading('Transmitting proposal to buyer node...');
        const price = parseFloat(offerForm.price);
        if (isNaN(price)) {
            toast.error('Please enter a valid numeric price.', { id: tid });
            return;
        }

        try {
            await marketplaceService.createOffer({
                request_id: selectedRequest.id,
                price: price,
                message: offerForm.message
            });
            toast.success('Offer successfully broadcasted.', { id: tid });
            setShowOfferModal(false);
            setOfferForm({ price: '', message: '' });
        } catch (err) {
            const detail = err.response?.data?.detail || 'Transmission failed: Offer protocol mismatch.';
            toast.error(detail, { id: tid });
        }
    };

    const openOfferModal = (request) => {
        setSelectedRequest(request);
        setShowOfferModal(true);
    };

    const handleDeliver = async (e) => {
        e.preventDefault();
        if (!deliveryFile) return toast.error('Selection of intelligence asset required.');

        const tid = toast.loading('Initiating ML validation and transmission...');
        try {
            const formData = new FormData();
            formData.append('file', deliveryFile);
            
            // Fixed: use .id instead of .deal_id
            await marketplaceService.markDelivered(selectedDeal.id, formData);
            toast.success('Asset validated and transmitted. Awaiting buyer confirmation.', { id: tid });
            setShowDeliveryModal(false);
            setDeliveryFile(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.detail || 'Handshake failed: Validation rejected.', { id: tid });
        }
    };

    const stats = [
        { label: "Total Revenue", value: `$${statsData?.total_revenue || 0}`, icon: DollarSign, color: "text-audit-500", bg: "bg-audit-50" },
        { label: "Market Requests", value: marketRequests.length.toString().padStart(2, '0'), icon: Activity, color: "text-brand-500", bg: "bg-brand-50" },
        { label: "Node Veracity", value: "98.5%", icon: ShieldCheck, color: "text-audit-500", bg: "bg-audit-50" },
        { label: "Active Handshakes", value: activeDeals.filter(d => d.delivery_status !== 'confirmed').length.toString().padStart(2, '0'), icon: Layers, color: "text-brand-500", bg: "bg-brand-50" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
                
                {/* HEADER */}
                <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-600">
                            <Zap size={18} strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Monetization Environment</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tightest text-slate-900">
                            Seller <span className="text-brand-500">Terminal</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-lg">
                            Fulfill market requirements or initialize new assets for monetization.
                        </p>
                    </div>
                    <Button variant="glow" size="xl" className="rounded-full px-10 h-16" onClick={() => setShowUploadModal(true)}>
                        Initialize Asset <Plus className="ml-3 w-5 h-5" strokeWidth={3} />
                    </Button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border border-slate-200 bg-white hover:border-brand-500/30 transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center border border-slate-100`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
                                </div>
                                <ArrowUpRight className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                            </div>
                            <p className="text-3xl font-display font-bold text-slate-900 tracking-tightest">{stat.value}</p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ACTIVE HANDSHAKES (Allowed before payment) */}
                {activeDeals.filter(d => d.delivery_status !== 'delivered').length > 0 && (
                    <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Layers className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                                <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Active Deals</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {activeDeals.filter(d => d.delivery_status !== 'delivered').map((deal, idx) => (
                                    <motion.div key={deal.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                                        <Card className="p-8 border-slate-200 bg-slate-50/30">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <Badge 
                                                        variant={deal.payment_status === 'escrowed' ? "success" : "warning"} 
                                                        className="px-3 py-1 uppercase text-[9px] font-black"
                                                    >
                                                        {deal.payment_status === 'escrowed' ? "Escrow Paid" : "Payment Pending"}
                                                    </Badge>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">Deal_ID: {String(deal.id).padStart(8, '0')}</span>
                                                </div>
                                                <h3 className="text-xl font-display font-bold text-slate-900 tracking-tightest">Deal with @{deal.buyer_username}</h3>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                                                    <p className="text-lg font-display font-bold text-slate-900">${deal.price}</p>
                                                    <Button variant="glow" onClick={() => { setSelectedDeal(deal); setShowDeliveryModal(true); }} className="rounded-xl px-5 h-10 text-sm">
                                                        Deliver Asset <Download className="ml-2 w-3 h-3 rotate-180" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* MARKET REQUIREMENTS */}
                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Activity className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                            <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Market Requirements</h2>
                        </div>
                    </div>
                    <Card className="p-0 overflow-hidden border-slate-200 bg-slate-50/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-100/50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Title</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {marketRequests.map((request, idx) => (
                                        <tr key={request.id} className="hover:bg-white transition-colors">
                                            <td className="px-8 py-6 font-bold text-slate-900">{request.title}</td>
                                            <td className="px-8 py-6 font-display font-bold text-slate-900 text-xl">${request.budget}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button onClick={() => openOfferModal(request)} className="p-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-all">
                                                    <Plus size={18} strokeWidth={2.5} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {marketRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="px-8 py-12 text-center text-slate-400 font-medium">
                                                No market requirements detected in the protocol.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* NODE INVENTORY */}
                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Database className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                            <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Node Inventory</h2>
                        </div>
                    </div>
                    <Card className="p-0 overflow-hidden border-slate-200 bg-slate-50/20">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-slate-200">
                                    {myDatasets.map((dataset, idx) => (
                                        <tr key={dataset.id} className="hover:bg-white transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shrink-0">
                                                        <Cpu size={20} strokeWidth={2.5} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 tracking-tight">{dataset.title}</p>
                                                        <p className="text-[11px] text-slate-400 font-medium">Node_ID: {String(dataset.id ?? '').padStart(8, '0')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 font-display font-bold text-slate-900 text-xl">${dataset.price}</td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-3 bg-white border border-slate-200 rounded-xl hover:border-brand-500 transition-all">
                                                    <ArrowUpRight size={18} strokeWidth={2.5} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

            </div>

            {/* MODALS */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 sm:p-16 space-y-12">
                            <h2 className="text-4xl font-display font-bold text-slate-900">Define Data Node</h2>
                            <form onSubmit={handleUpload} className="space-y-8">
                                <Input label="Node Title" required value={newDataset.title} onChange={(e) => setNewDataset({...newDataset, title: e.target.value})} />
                                <textarea className="w-full h-32 p-6 rounded-2xl bg-slate-50 border border-slate-100 outline-none" placeholder="Description..." required value={newDataset.description} onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}></textarea>
                                <Input label="Asset Value (USD)" type="number" required value={newDataset.price} onChange={(e) => setNewDataset({...newDataset, price: e.target.value})} />
                                <div className="flex gap-4">
                                    <Button type="button" variant="secondary" className="flex-1 h-14" onClick={() => setShowUploadModal(false)}>Abort</Button>
                                    <Button type="submit" variant="glow" className="flex-[2] h-14">Transmit to Grid</Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showOfferModal && selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowOfferModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 sm:p-14 space-y-10">
                            <h2 className="text-3xl font-display font-bold text-slate-900">Submit Offer</h2>
                            <form onSubmit={handleCreateOffer} className="space-y-6">
                                <Input label="Your Price (USD)" type="number" required value={offerForm.price} onChange={e => setOfferForm({...offerForm, price: e.target.value})} />
                                <textarea required rows={4} placeholder="Message..." value={offerForm.message} onChange={e => setOfferForm({...offerForm, message: e.target.value})} className="w-full p-4 rounded-2xl bg-slate-50 border outline-none resize-none"></textarea>
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowOfferModal(false)} className="flex-1 h-14 rounded-2xl border font-bold">Abort</button>
                                    <button type="submit" className="flex-[2] h-14 rounded-2xl bg-brand-600 text-white font-bold">Transmit Offer</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeliveryModal && selectedDeal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowDeliveryModal(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white rounded-[3rem] p-10 sm:p-14 space-y-10">
                            <h2 className="text-3xl font-display font-bold text-slate-900">Fulfill Deal</h2>
                            <form onSubmit={handleDeliver} className="space-y-8">
                                <input type="file" accept=".csv" onChange={(e) => setDeliveryFile(e.target.files[0])} required />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowDeliveryModal(false)} className="flex-1 h-14 rounded-2xl border font-bold">Abort</button>
                                    <button type="submit" className="flex-[2] h-14 rounded-2xl bg-audit-500 text-white font-bold">Confirm Delivery</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default SellerDashboard;
