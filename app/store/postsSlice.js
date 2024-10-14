export const createPostsSlice = (set) => ({
    posts: [],
    setPosts: (posts) => set({ posts }),
    clear: () => set({ posts: null })
});