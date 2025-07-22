export const createGirlSlice = (set) => ({
    girl: null,
    loadingGirl: false,
    setGirl: (girl) => set({ girl }),
    clearGirl: () => set({ girl: null }),
    setLoadingGirl: (loadingGirl) => set({ loadingGirl })

});