export const createReelsSlice = (set) => ({
    reels: [],

    // Function to set the entire posts array
    setReels: (reels) => set({ reels }),

    // Function to clear all posts by resetting to an empty array
    clear: () => set({ reels: [] }),

    // Function to update a single post within the posts array
    updateReel: (updatedPost) => set((state) => ({
        reels: state.reels.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        ),
    })),
});