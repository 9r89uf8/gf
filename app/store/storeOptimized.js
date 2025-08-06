// store/storeOptimized.js
// Optimized Zustand store with lazy hydration for better INP
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Create a lightweight initial store without persistence
export const useLightStore = create((set, get) => ({
    // Essential state only
    user: null,
    setUser: (user) => set({ user }),
    hasHydrated: false,
    setHasHydrated: (state) => set({ hasHydrated: state }),
}));

// Lazy-load the full store with all slices
let fullStore = null;
export const useStore = () => {
    if (typeof window === 'undefined') {
        return useLightStore();
    }

    if (!fullStore) {
        // Dynamically import and create the full store on first client-side access
        import('./store').then(({ useStore: store }) => {
            fullStore = store;
        });
        return useLightStore();
    }

    return fullStore();
};

// Export a hook to check if store is ready
export const useIsStoreReady = () => {
    const hasHydrated = useLightStore((state) => state.hasHydrated);
    return hasHydrated && fullStore !== null;
};