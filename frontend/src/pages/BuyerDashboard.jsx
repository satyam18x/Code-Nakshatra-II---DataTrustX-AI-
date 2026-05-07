import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    Search, 
    Filter, 
    ShoppingCart, 
    ShieldCheck, 
    TrendingUp, 
    Globe, 
    Clock, 
    ChevronRight,
    Activity,
    Database,
    Zap,
    Lock,
    Cpu,
    ArrowUpRight,
    Layers,
    BarChart3,
    DollarSign
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import marketplaceService from '../services/marketplace';
import { toast } from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const BuyerDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [datasets, setDatasets] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestType, setRequestType] = useState('text'); // 'text' or 'similar'
    const [selectedFile, setSelectedFile] = useState(null);
    const [newRequest, setNewRequest] = useState({ title: '', description: '', budget: '', domain: 'General' });

    const [selectedRequestOffers, setSelectedRequestOffers] = useState(null);
    const [showOffersModal, setShowOffersModal] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [datasetsRes, myRequestsRes, statsRes] = await Promise.all([
                marketplaceService.getAllDatasets(),
                marketplaceService.getMyRequests(),
                marketplaceService.getBuyerStats()
            ]);
            setDatasets(datasetsRes);
            setMyRequests(myRequestsRes);
            setStatsData(statsRes);
        } catch (err) {
            toast.error('Failed to synchronize with Global Intelligence Grid.');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchaseRequest = async (datasetId) => {
        const tid = toast.loading('Initiating non-custodial escrow...');
        try {
            await marketplaceService.requestDataset(datasetId);
            toast.success('Escrow initialized. Verification engine active.', { id: tid });
        } catch (err) {
            toast.error('Request rejected: Protocol constraint violation.', { id: tid });
        }
    };

    const handlePostRequest = async (e) => {
        e.preventDefault();
        const tid = toast.loading('Broadcasting data requirement...');
        try {
            const formData = new FormData();
            formData.append('title', newRequest.title);
            formData.append('description', newRequest.description);
            formData.append('budget', newRequest.budget);
            formData.append('domain', newRequest.domain);
            formData.append('request_type', requestType);
            if (requestType === 'similar' && selectedFile) {
                formData.append('file', selectedFile);
            }

            await marketplaceService.createRequest(formData);
            toast.success('Requirement localized. Awaiting node fulfillment.', { id: tid });
            setShowRequestModal(false);
            setNewRequest({ title: '', description: '', budget: '', domain: 'General' });
            setRequestType('text');
            setSelectedFile(null);
            fetchDashboardData();
        } catch (err) {
            toast.error('Broadcast failed: Requirement rejected by protocol.', { id: tid });
        }
    };

    const handleViewOffers = async (request) => {
        const tid = toast.loading('Synchronizing incoming offers...');
        try {
            const offers = await marketplaceService.getOffers(request.id);
            setSelectedRequestOffers({ request, offers });
            setShowOffersModal(true);
            toast.dismiss(tid);
        } catch (err) {
            toast.error('Failed to retrieve offers.', { id: tid });
        }
    };

    const handleAcceptOffer = async (offerId) => {
        const tid = toast.loading('Authorizing cryptographic handshake...');
        try {
            await marketplaceService.acceptOffer(offerId);
            toast.success('Offer accepted. Deal localized on transaction ledger.', { id: tid });
            setShowOffersModal(false);
            navigate('/deals');
        } catch (err) {
            toast.error('Failed to authorize handshake.', { id: tid });
        }
    };

    const stats = [
        { label: "Active Assets", value: statsData?.completed_assets.toString().padStart(2, '0') || "00", icon: Lock, color: "text-brand-500", bg: "bg-brand-50" },
        { label: "Incoming Offers", value: statsData?.verified_offers.toString().padStart(2, '0') || "00", icon: Activity, color: "text-audit-500", bg: "bg-audit-50" },
        { label: "Capital Deployed", value: `$${statsData?.capital_deployed || 0}`, icon: DollarSign, color: "text-brand-500", bg: "bg-brand-50" },
        { label: "Requirements", value: statsData?.pending_requirements.toString().padStart(2, '0') || "00", icon: Database, color: "text-audit-500", bg: "bg-audit-50" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-sans selection:bg-brand-100 selection:text-brand-900">
            <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
                
                {/* ── HEADER & SEARCH ── */}
                <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-600">
                            <Layers size={18} strokeWidth={2.5} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Intelligence Environment</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-display font-bold tracking-tightest text-slate-900">
                            Welcome, <span className="text-brand-500">{user?.username}</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-lg">
                            Acquire high-fidelity assets or post a custom requirement to the grid.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Search Global Intelligence Grid..."
                                className="w-full h-14 pl-12 pr-6 rounded-2xl bg-white border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-[15px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button 
                            variant="glow" 
                            className="h-14 rounded-2xl px-8 shadow-glow"
                            onClick={() => setShowRequestModal(true)}
                        >
                            Request Custom Data <Zap className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* ── QUICK STATS BENTO ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-8 rounded-[2rem] border border-slate-200 bg-white hover:border-brand-500/30 hover:shadow-soft-xl transition-all duration-500 group">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={2.5} />
                                </div>
                                <ArrowUpRight className="text-slate-300 group-hover:text-brand-500 transition-colors" />
                            </div>
                            <p className="text-3xl font-display font-bold text-slate-900 tracking-tightest">{stat.value}</p>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── ACTIVE REQUIREMENTS ── */}
                {myRequests.length > 0 && (
                    <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Zap className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                                <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Active Requirements</h2>
                            </div>
                            <Badge variant="warning" className="bg-amber-50 text-amber-600 border-amber-200/50 px-4 py-1.5 uppercase tracking-widest text-[9px] font-black">Awaiting Fulfillment</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {myRequests.map((request, idx) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="p-8 border-slate-200 hover:border-brand-500/40 transition-all duration-500 bg-slate-50/30 group">
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="primary" className="bg-brand-50 text-brand-600 border-brand-200/50 px-3 py-1">
                                                        {request.domain}
                                                    </Badge>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Req_ID: {String(request.id).padStart(8, '0')}</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-display font-bold text-slate-900 tracking-tightest line-clamp-1">{request.title}</h3>
                                                    <p className="text-slate-500 font-medium text-sm line-clamp-2">{request.description}</p>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target Budget</p>
                                                        <p className="text-lg font-display font-bold text-slate-900">${request.budget}</p>
                                                    </div>
                                                    <Button 
                                                        variant="glow"
                                                        onClick={() => handleViewOffers(request)}
                                                        className="rounded-xl px-5 h-10 text-sm"
                                                    >
                                                        View Offers
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

                {/* ── DATASET GRID ── */}
                <div className="space-y-8 bg-white p-8 lg:p-12 rounded-[3rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Database className="text-brand-600 w-5 h-5" strokeWidth={2.5} />
                            <h2 className="text-2xl font-display font-bold tracking-tightest text-slate-900 uppercase">Available Assets</h2>
                        </div>
                        <Badge variant="primary" className="bg-brand-50 text-brand-600 border-brand-200/50 px-4 py-1.5">Live Synchronization</Badge>
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
                                {datasets.map((dataset, idx) => (
                                    <motion.div
                                        key={dataset.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card className="p-0 overflow-hidden border-slate-200 hover:border-brand-500/40 transition-all duration-500 group flex flex-col h-full bg-slate-50/30 hover:bg-white shadow-sm">
                                            <div className="p-8 space-y-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:rotate-6 transition-transform border border-white/10">
                                                        <Cpu size={24} strokeWidth={2.5} />
                                                    </div>
                                                    <Badge variant="success" className="bg-audit-50 text-audit-500 border-audit-200/50 uppercase tracking-widest text-[9px] font-black">Verified</Badge>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tightest line-clamp-1 group-hover:text-brand-600 transition-colors">{dataset.title}</h3>
                                                    <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed">{dataset.description}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-200/60">
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Veracity Score</p>
                                                        <div className="flex items-center space-x-2 text-audit-500 font-bold">
                                                            <Activity size={14} />
                                                            <span>98.5%</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provenance</p>
                                                        <div className="flex items-center space-x-2 text-brand-500 font-bold">
                                                            <Globe size={14} />
                                                            <span>Institutional</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Acquisition Cost</p>
                                                        <p className="text-2xl font-display font-bold text-slate-900 tracking-tightest">
                                                            ${dataset.price} <span className="text-sm font-sans text-slate-400 uppercase">USD</span>
                                                        </p>
                                                    </div>
                                                    <Button 
                                                        variant="glow"
                                                        onClick={() => handlePurchaseRequest(dataset.id)}
                                                        className="rounded-xl px-6 h-12"
                                                    >
                                                        Acquire <Zap className="ml-2 w-4 h-4 fill-current" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* ── REQUEST MODAL ── */}
            <AnimatePresence>
                {showRequestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setShowRequestModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
                        >
                            <div className="p-10 sm:p-16 space-y-12">
                                <div className="space-y-4">
                                    <Badge variant="primary" className="px-4 py-1.5">New Data Requirement</Badge>
                                    <h2 className="text-4xl font-display text-slate-900 font-bold tracking-tightest">Request Asset</h2>
                                    <p className="text-slate-500 font-medium">Broadcast your specific data needs to the Global Intelligence Grid.</p>
                                </div>

                                <form onSubmit={handlePostRequest} className="space-y-8">
                                    <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
                                        <button 
                                            type="button"
                                            onClick={() => setRequestType('text')}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${requestType === 'text' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Text Request
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => setRequestType('similar')}
                                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${requestType === 'similar' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Similar Dataset
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <Input 
                                            label="Requirement Title" 
                                            placeholder="e.g. 50k+ Real Estate Leads (Mumbai)"
                                            icon={Database}
                                            required
                                            value={newRequest.title}
                                            onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                                        />

                                        {requestType === 'similar' && (
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">Reference Dataset (CSV)</label>
                                                <div className="relative group">
                                                    <input 
                                                        type="file" 
                                                        accept=".csv"
                                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        required={requestType === 'similar'}
                                                    />
                                                    <div className={`w-full p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 ${selectedFile ? 'border-brand-500 bg-brand-50/30' : 'border-slate-200 bg-slate-50 group-hover:border-brand-400'}`}>
                                                        <Database className={`w-8 h-8 ${selectedFile ? 'text-brand-500' : 'text-slate-300'}`} />
                                                        <span className="text-sm font-medium text-slate-600">{selectedFile ? selectedFile.name : 'Upload reference CSV for similarity matching'}</span>
                                                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Max 50MB • CSV format only</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">Description & Constraints</label>
                                            <textarea 
                                                className="w-full h-32 p-6 rounded-2xl bg-slate-50 border border-slate-100 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none font-medium text-[15px]"
                                                placeholder="Detail the specific veracity and volume requirements..."
                                                required
                                                value={newRequest.description}
                                                onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <Input 
                                                label="Acquisition Budget (USD)" 
                                                type="number"
                                                placeholder="1000.00"
                                                icon={DollarSign}
                                                required
                                                value={newRequest.budget}
                                                onChange={(e) => setNewRequest({...newRequest, budget: e.target.value})}
                                            />
                                            <Input 
                                                label="Target Domain" 
                                                placeholder="e.g. Finance, Healthcare"
                                                icon={Globe}
                                                required
                                                value={newRequest.domain}
                                                onChange={(e) => setNewRequest({...newRequest, domain: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button type="button" variant="secondary" className="flex-1 h-14 rounded-2xl border-slate-100 font-bold" onClick={() => setShowRequestModal(false)}>Abort</Button>
                                        <Button type="submit" variant="glow" className="flex-[2] h-14 rounded-2xl font-bold">Broadcast Requirement <Zap className="ml-2 w-4 h-4" /></Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── OFFERS MODAL ── */}
            <AnimatePresence>
                {showOffersModal && selectedRequestOffers && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setShowOffersModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh]"
                        >
                            <div className="p-10 sm:p-14 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="primary" className="px-4 py-1.5 uppercase tracking-widest text-[9px] font-black">Offer Ledger</Badge>
                                        <button onClick={() => setShowOffersModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                            <Zap size={24} className="rotate-45" />
                                        </button>
                                    </div>
                                    <h2 className="text-3xl font-display text-slate-900 font-bold tracking-tightest">
                                        Offers for: <span className="text-brand-500">{selectedRequestOffers.request.title}</span>
                                    </h2>
                                    <p className="text-slate-500 font-medium">Evaluate proposals from verified intelligence nodes.</p>
                                </div>

                                <div className="space-y-6">
                                    {selectedRequestOffers.offers.length === 0 ? (
                                        <div className="py-20 text-center space-y-4 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                            <Activity className="mx-auto text-slate-300 w-12 h-12" />
                                            <p className="text-slate-500 font-medium italic">No offers localized for this requirement yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-6">
                                            {selectedRequestOffers.offers.map((offer, idx) => (
                                                <motion.div
                                                    key={offer.offer_id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-brand-500/20 transition-all group"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                        <div className="space-y-4 flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-bold">{offer.seller[0].toUpperCase()}</div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-slate-900">@{offer.seller}</p>
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Node</p>
                                                                </div>
                                                            </div>
                                                            <p className="text-slate-600 font-medium text-sm leading-relaxed italic">"{offer.message}"</p>
                                                        </div>
                                                        <div className="flex items-center gap-8">
                                                            <div className="text-right">
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Proposal Price</p>
                                                                <p className="text-3xl font-display font-bold text-slate-900 tracking-tightest">${offer.price}</p>
                                                            </div>
                                                            <Button variant="glow" onClick={() => handleAcceptOffer(offer.offer_id)} className="rounded-2xl px-8 h-14 font-bold">Accept Offer</Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BuyerDashboard;
