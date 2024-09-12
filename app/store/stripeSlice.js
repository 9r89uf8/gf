// store/stripeSlice.js
export const createStripeSlice = (set) => ({
    loading: false,
    error: null,
    status: null,
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setStatus: (status) => set({ status }),
});
