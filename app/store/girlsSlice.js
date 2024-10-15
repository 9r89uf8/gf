export const createGirlsSlice = (set) => ({
    girls: [],
    setGirls: (girls) => set({ girls }),
    clear: () => set({ girls: null }),
    removeGirl: (id) => set((state) => ({
        girls: state.girls.filter(girl => girl.id !== id)
    }))
});