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
    })),
    updateFollowers: (userId) => set((state) => {
        if (!state.girl) return state;
        const newFollowers = state.girl.followers ? [...state.girl.followers] : [];
        if (!newFollowers.includes(userId)) {
            newFollowers.push(userId);
        }
        return {
            girl: {
                ...state.girl,
                followers: newFollowers,
                followersCount: (state.girl.followersCount || 0) + 1
            }
        };
    }),
    removeFollower: (userId) => set((state) => {
        if (!state.girl) return state;
        const newFollowers = state.girl.followers ? state.girl.followers.filter(id => id !== userId) : [];
        return {
            girl: {
                ...state.girl,
                followers: newFollowers,
                followersCount: Math.max((state.girl.followersCount || 0) - 1, 0)
            }
        };
    })
});