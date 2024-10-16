export const createGirlSlice = (set) => ({
    girl: null,
    loadingGirl: false,
    setGirl: (girl) => set({ girl }),
    clearGirl: () => set({ girl: null }),
    setLoadingGirl: (loadingGirl) => set({ loadingGirl }),
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
    })),
    updateFollowers: (newFollowers, newCount) => set((state) => {
        if (!state.girl) return state;
        return {
            girl: {
                ...state.girl,
                followers: newFollowers,
                followersCount: newCount
            }
        };
    }),
    removeFollower: (newFollowers, newCount) => set((state) => {
        if (!state.girl) return state;
        return {
            girl: {
                ...state.girl,
                followers: newFollowers,
                followersCount: newCount
            }
        };
    }),
    updateGirlPost: (updatedPost) => set((state) => {
        if (!state.girl) return state;
        return {
            girl: {
                ...state.girl,
                posts: state.girl.posts.map(post =>
                    post.id === updatedPost.id ? { ...post, ...updatedPost } : post
                )
            }
        };
    })
});