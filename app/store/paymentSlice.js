// store/paymentSlice.js
export const createPaymentSlice = (set, get) => ({
    // Payment state
    paymentLoading: false,
    paymentError: null,
    clientSecret: null,
    checkoutSessionId: null,
    paymentStatus: 'idle', // idle, loading, processing, succeeded, failed
    selectedProduct: null,
    quantity: 1,
    customerEmail: '',
    products: [],
    sessionData: null,

    // Actions
    setPaymentLoading: (loading) => set({ paymentLoading: loading }),
    setPaymentError: (error) => set({ paymentError: error }),
    setClientSecret: (clientSecret) => set({ clientSecret }),
    setCheckoutSessionId: (sessionId) => set({ checkoutSessionId: sessionId }),
    setPaymentStatus: (status) => set({ paymentStatus: status }),
    setSelectedProduct: (productId) => set({ selectedProduct: productId }),
    setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),
    setCustomerEmail: (email) => set({ customerEmail: email }),
    setProducts: (products) => set({ products }),
    setSessionData: (sessionData) => set({ sessionData }),

    // Complex actions
    createCheckoutSession: async (productId, quantity = 1, customerEmail = '') => {
        set({ 
            paymentLoading: true, 
            paymentError: null, 
            paymentStatus: 'loading' 
        });
        
        try {
            // Get current user from store
            const state = get();
            const userId = state.user?.uid || state.userId || null;
            const userEmail = customerEmail || state.user?.email || '';
            
            const response = await fetch('/api/v2/payments/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    customerEmail: userEmail,
                    userId: userId,
                    metadata: {
                        source: 'embedded_checkout',
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const data = await response.json();
            
            set({
                clientSecret: data.clientSecret,
                checkoutSessionId: data.sessionId,
                paymentStatus: 'processing',
                paymentLoading: false,
                selectedProduct: productId,
                quantity,
                customerEmail,
            });

            return data;
        } catch (error) {
            set({
                paymentError: error.message,
                paymentStatus: 'failed',
                paymentLoading: false,
            });
            throw error;
        }
    },

    fetchSessionStatus: async (sessionId) => {
        set({ paymentLoading: true, paymentError: null });
        
        try {
            const response = await fetch(`/api/v2/payments/session-status?session_id=${sessionId}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch session status');
            }

            const data = await response.json();
            const session = data.session;
            
            let paymentStatus = 'processing';
            if (session.payment_status === 'paid') {
                paymentStatus = 'succeeded';
            } else if (session.status === 'expired') {
                paymentStatus = 'failed';
            }
            
            set({
                paymentStatus,
                paymentLoading: false,
                checkoutSessionId: sessionId,
                sessionData: session,
            });

            return session;
        } catch (error) {
            set({
                paymentError: error.message,
                paymentLoading: false,
            });
            throw error;
        }
    },

    fetchProducts: async () => {
        set({ paymentLoading: true, paymentError: null });
        
        try {
            const response = await fetch('/api/v2/payments/products');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch products');
            }

            const data = await response.json();
            
            set({
                products: data.products,
                paymentLoading: false,
            });

            return data.products;
        } catch (error) {
            set({
                paymentError: error.message,
                paymentLoading: false,
            });
            throw error;
        }
    },

    resetPaymentCheckout: () => {
        set({
            clientSecret: null,
            checkoutSessionId: null,
            paymentStatus: 'idle',
            selectedProduct: null,
            quantity: 1,
            customerEmail: '',
            paymentLoading: false,
            paymentError: null,
            sessionData: null,
        });
    },

    // Getters
    getCheckoutSession: () => {
        const state = get();
        return {
            clientSecret: state.clientSecret,
            sessionId: state.checkoutSessionId,
        };
    },

    getSelectedProduct: () => {
        const state = get();
        const product = state.products.find(p => p.id === state.selectedProduct);
        return {
            product,
            quantity: state.quantity,
        };
    },
});