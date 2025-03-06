// store/chatSlice.js
export const createChatSlice = (set) => ({
    conversationHistory: [],
    conversationLimits:null,
    messageSent: false,
    chats: [],
    audios: [],
    setConversationHistory: (conversationHistory) => set({ conversationHistory }),
    setConversationLimits: (conversationLimits) => set({ conversationLimits }),
    setMessageSent: (messageSent) => set({ messageSent }),
    setAudios: (audios) => set({ audios }),
    setChats: (chats) => set({ chats }),
    updateMessage: (updatedMessage) => set((state) => ({
        conversationHistory: state.conversationHistory.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message
        ),
    })),
    clearAll: () => set({
        conversationHistory: [],
        messageSent: false,
        audios: [],
        chats: []
    }),
    updateChatList: (payload) => set((state) => ({
        chats: state.chats.map((chat) =>
            chat.girlId === payload.girlId
                ? { ...chat, isActive: payload.isActive, lastSeenGirl: payload.lastSeenGirl, girlOfflineUntil: payload.girlOfflineUntil }
                : chat
        ),
    })),
});
