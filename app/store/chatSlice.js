// store/chatSlice.js
export const createChatSlice = (set) => ({
    conversationHistory: [],
    messageSent: false,
    chats: [],
    audios: [],
    audioBoolean: false,
    setConversationHistory: (conversationHistory) => set({ conversationHistory }),
    setMessageSent: (messageSent) => set({ messageSent }),
    setAudios: (audios) => set({ audios }),
    setChats: (chats) => set({ chats }),
    setAudioBoolean: (audioBoolean) => set({ audioBoolean }),
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
