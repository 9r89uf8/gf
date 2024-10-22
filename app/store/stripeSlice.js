// store/stripeSlice.js
export const createStripeSlice = (set) => ({
    loading: false,
    verifying: true,
    error: null,
    status: null,
    setLoading: (loading) => set({ loading }),
    setVerifying: (verifying) => set({ verifying }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
});
