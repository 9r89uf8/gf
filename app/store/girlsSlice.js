export const createGirlsSlice = (set) => ({
    girls: [],
    setGirls: (girls) => set({ girls }),
    clear: () => set({ girls: null })
});