// In your createClipsSlice
export const createClipsSlice = (set) => ({
    clips: null,
    currentClipIndex: 0,
    setClips: (clips) => set({ clips }),
    clearClips: () => set({ clips: null }),
    setCurrentClipIndex: (update) =>
        set((state) => ({
            currentClipIndex:
                typeof update === 'function' ? update(state.currentClipIndex) : update,
        })),
});
