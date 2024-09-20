export const createClipsSlice = (set) => ({
    clips: null,
    setClips: (clips) => set({ clips }),
    clearClips: () => set({ clips: null }),

});