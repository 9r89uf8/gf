// store/chatSlice.js
export const createChatSlice = (set) => ({
    conversationHistory: [],
    messageSent: false,
    audios: [],
    setConversationHistory: (conversationHistory) => set({ conversationHistory }),
    setMessageSent: (messageSent) => set({ messageSent }),
    setAudios: (audios) => set({ audios }),
    updateMessage: (updatedMessage) => set((state) => ({
        conversationHistory: state.conversationHistory.map((message) =>
            message.id === updatedMessage.id ? updatedMessage : message
        ),
    })),
    clearAll: () => set({
        conversationHistory: [],
        messageSent: false,
        audios: []
    }),
});
