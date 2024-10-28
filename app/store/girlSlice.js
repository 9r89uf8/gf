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
    // Method to update girl.isActive
    setGirlIsActive: (isActive) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                isActive,
            }
            : null,
    })),

    // Method to update girl.girlOfflineUntil
    setGirlOfflineUntil: (offlineUntil) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                girlOfflineUntil: offlineUntil,
            }
            : null,
    })),

    // Method to update girl.lastSeen
    setLastSeen: (lastSeen) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                lastSeenGirl: lastSeen,
            }
            : null,
    })),
    // Modified setGirlIsTyping to work independently of girl object
    setGirlIsTyping: (isTyping) => set((state) => {
        // Update both the separate status and the girl object if it exists
        return {
            girl: state.girl
                ? {
                    ...state.girl,
                    girlIsTyping: isTyping,
                }
                : null
        };
    }),
    removePicture: (postId) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                pictures: state.girl.pictures.filter(post => post.id !== postId)
            }
            : null
    })),
    removeVideo: (postId) => set((state) => ({
        girl: state.girl
            ? {
                ...state.girl,
                videos: state.girl.videos.filter(post => post.id !== postId)
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