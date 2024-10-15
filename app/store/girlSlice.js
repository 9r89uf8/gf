export const createGirlSlice = (set) => ({
    girl: null,
    setGirl: (girl) => set({ girl }),
    clearGirl: () => set({ girl: null }),
    removePost: (postId) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                posts: state.girl.posts.filter(post => post.id !== postId)
            }
            : null
    })),
    removePicture: (postId) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                pictures: state.girl.pictures.filter(post => post.id !== postId)
            }
            : null
    }))
});