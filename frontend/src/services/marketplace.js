import api from './api';

const marketplaceService = {
    // Buyer: Create a new dataset request
    createRequest: async (data) => {
        return await api.post('/market/request', data);
    },

    // Buyer: Get list of my requests
    getMyRequests: async () => {
        return await api.get('/market/my_requests');
    },

    // Seller: Get all buyer requests (The Marketplace)
    getAllRequests: async () => {
        return await api.get('/market/broadcasts');
    },

    // Buyer: Get all available datasets
    getAllDatasets: async () => {
        return await api.get('/market/datasets');
    },

    // Seller: Create a new dataset (Asset Initialization)
    createDataset: async (data) => {
        return await api.post('/market/datasets', data);
    },

    // Buyer: Request to purchase a dataset (Escrow Initialization)
    requestDataset: async (datasetId) => {
        return await api.post(`/market/request_dataset/${datasetId}`);
    },

    // Seller: Submit an offer for a request
    createOffer: async (data) => {
        return await api.post('/market/offer', data);
    },

    // Buyer: Get offers for a specific request
    getOffers: async (requestId) => {
        return await api.get(`/market/offers/${requestId}`);
    },

    // Buyer: Accept an offer to create a deal
    acceptOffer: async (offerId) => {
        return await api.post(`/market/accept/${offerId}`);
    },

    // Both: Get list of active deals
    getMyDeals: async () => {
        return await api.get('/market/my_deals');
    },

    // Buyer: Pay into escrow
    payEscrow: async (dealId) => {
        return await api.post(`/market/pay/${dealId}`);
    },

    // Seller: Mark dataset as delivered (Upload & Validate)
    markDelivered: async (dealId, formData) => {
        return await api.post(`/market/deliver/${dealId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // Buyer: Download dataset
    downloadDataset: async (dealId) => {
        return await api.get(`/market/download/${dealId}`, {
            responseType: 'blob', // Important for file download
        });
    },

    // Raise a dispute
    raiseDispute: async (dealId, reason) => {
        return await api.post(`/market/dispute/${dealId}`, { reason });
    },

    // Admin: Get all disputes
    getDisputesAdmin: async () => {
        return await api.get('/admin/disputes');
    },

    // Admin: Resolve dispute
    resolveDispute: async (disputeId, action) => {
        return await api.post(`/admin/resolve/${disputeId}/${action}`);
    },

    // Buyer: Confirm delivery and release escrow
    confirmDelivery: async (dealId) => {
        return await api.post(`/market/confirm/${dealId}`);
    },

    // Admin: Get all validations
    getValidations: async () => {
        return await api.get('/admin/validations');
    },

    // Get specific validation report by ID
    getValidationReportById: async (reportId) => {
        return await api.get(`/history/report/id/${reportId}`);
    },

    // Get validation report by Deal ID
    getValidationReportByDeal: async (dealId) => {
        return await api.get(`/history/report/deal/${dealId}`);
    },

    // Buyer: Get real-time personal stats
    getBuyerStats: async () => {
        return await api.get('/market/buyer_stats');
    },

    // Seller: Get real-time personal stats
    getSellerStats: async () => {
        return await api.get('/market/seller_stats');
    },

    // Get all validation history for the user
    getValidationHistory: async () => {
        return await api.get('/history/');
    }
};

export default marketplaceService;
