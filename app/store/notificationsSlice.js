// store/notificationsSlice.js
export const createNotificationsSlice = (set) => ({
    notifications: [],
    addNotification: (notification) => set((state) => ({
        notifications: [...state.notifications, notification],
    })),
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((notification) => notification.id !== id),
    })),
});
