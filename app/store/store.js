// store/store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUserSlice } from './userSlice';
import { createChatSlice } from './chatSlice';
import { createGirlSlice } from './girlSlice';
import { createStripeSlice } from './stripeSlice';
import { createClipsSlice } from './clipsSlice';
import { createGirlsSlice } from './girlsSlice';
import { createPostsSlice } from './postsSlice';
import { createMembershipSlice } from './membershipSlice';
import { createNotificationsSlice } from './notificationsSlice';
import {createReelsSlice} from "@/app/store/reelSlice";

export const useStore = create(
    persist(
        (set, get) => ({
            ...createUserSlice(set, get),
            ...createChatSlice(set, get),
            ...createGirlSlice(set, get),
            ...createStripeSlice(set, get),
            ...createGirlsSlice(set, get),
            ...createPostsSlice(set, get),
            ...createMembershipSlice(set, get),
            ...createClipsSlice(set, get),
            ...createReelsSlice(set, get),
            ...createNotificationsSlice(set, get),
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




