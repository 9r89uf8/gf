export const createGirlSlice = (set) => ({
    girl: null,
    setGirl: (girl) => set({ girl }),
    clear: () => set({ girl: null }),
    updatePost: (updatedPost) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                posts: state.girl.posts.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                ),
            }
            : null,
    })),
});