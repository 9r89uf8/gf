// store/store.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createUserSlice } from './userSlice';
import { createChatSlice } from './chatSlice';
import { createGirlSlice } from './girlSlice';
import { createStripeSlice } from './stripeSlice';
import { createNotificationsSlice } from './notificationsSlice';
export const useStore = create(
    persist(
        (...a) => ({
            ...createUserSlice(...a),
            ...createChatSlice(...a),
            ...createGirlSlice(...a),
            ...createStripeSlice(...a),
            ...createNotificationsSlice(...a)
        }),
        {
            name: 'aigf', // unique name for the storage
            storage: createJSONStorage(() => localStorage), // use local storage
        }
    )
);

export default useStore;



