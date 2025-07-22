// store/store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUserSlice } from './userSlice';
import { createGirlSlice } from './girlSlice';
import { createGirlsSlice } from './girlsSlice';
import { createPostsSlice } from './postsSlice';
import { createNotificationsSlice } from './notificationsSlice';
import { createConversationV2Slice } from './conversationV2Slice';
import { createPaymentSlice } from './paymentSlice';

export const useStore = create(
    persist(
        (set, get) => ({
            ...createUserSlice(set, get),
            ...createGirlSlice(set, get),
            ...createGirlsSlice(set, get),
            ...createPostsSlice(set, get),
            ...createNotificationsSlice(set, get),
            ...createConversationV2Slice(set, get),
            ...createPaymentSlice(set, get),
            hasHydrated: false,
            setHasHydrated: (state) => set({ hasHydrated: state }),
        }),
        {
            name: 'aigf',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state, error) => {
                if (error) {
                    console.log('An error occurred during hydration', error);
                } else {
                    state.setHasHydrated(true);
                }
            },
        }
    )
);

export default useStore;




