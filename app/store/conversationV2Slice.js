// store/conversationV2Slice.js - Zustand version
export const createConversationV2Slice = (set, get) => ({
    // V2 Conversation State
    conversationsV2: {}, // Store conversations by conversationId
    activeConversationV2Id: null,
    messagesV2: {}, // Store messages by conversationId
    limitsV2: {}, // Store limits by conversationId
    chatsV2: [], // Store chat list for DM page
    loadingV2: false,
    sendingMessageV2: false,
    processingResponseV2: false,
    errorV2: null,

    // V2 Actions
    setActiveConversationV2: (conversationId) => set({ activeConversationV2Id: conversationId }),
    
    setConversationV2: (conversationId, conversation) => set((state) => ({
        conversationsV2: {
            ...state.conversationsV2,
            [conversationId]: conversation
        }
    })),
    
    updateConversationV2: (conversationId, updates) => set((state) => ({
        conversationsV2: {
            ...state.conversationsV2,
            [conversationId]: {
                ...state.conversationsV2[conversationId],
                ...updates
            }
        }
    })),
    
    setMessagesV2: (conversationId, messages) => set((state) => ({
        messagesV2: {
            ...state.messagesV2,
            [conversationId]: messages
        }
    })),
    
    addMessageV2: (conversationId, message) => set((state) => ({
        messagesV2: {
            ...state.messagesV2,
            [conversationId]: [
                ...(state.messagesV2[conversationId] || []),
                message
            ]
        }
    })),
    
    updateMessageV2: (conversationId, messageId, updates) => set((state) => ({
        messagesV2: {
            ...state.messagesV2,
            [conversationId]: (state.messagesV2[conversationId] || []).map(msg =>
                msg.id === messageId ? { ...msg, ...updates } : msg
            )
        }
    })),
    
    setLimitsV2: (conversationId, limits) => set((state) => ({
        limitsV2: {
            ...state.limitsV2,
            [conversationId]: limits
        }
    })),
    
    setChatsV2: (chats) => set({ chatsV2: chats }),
    
    setLoadingV2: (loading) => set({ loadingV2: loading }),
    setSendingMessageV2: (sending) => set({ sendingMessageV2: sending }),
    setProcessingResponseV2: (processing) => set({ processingResponseV2: processing }),
    setErrorV2: (error) => set({ errorV2: error }),
    clearErrorV2: () => set({ errorV2: null }),
    
    // Selectors
    getConversationV2: (conversationId) => get().conversationsV2[conversationId],
    getActiveConversationV2: () => {
        const state = get();
        return state.activeConversationV2Id ? state.conversationsV2[state.activeConversationV2Id] : null;
    },
    getMessagesV2: (conversationId) => get().messagesV2[conversationId] || [],
    getActiveMessagesV2: () => {
        const state = get();
        return state.activeConversationV2Id ? state.messagesV2[state.activeConversationV2Id] || [] : [];
    },
    getLimitsV2: (conversationId) => get().limitsV2[conversationId] || {
        freeAudio: 0,
        freeImages: 0,
        freeMessages: 0
    },
    getActiveLimitsV2: () => {
        const state = get();
        return state.activeConversationV2Id ? state.limitsV2[state.activeConversationV2Id] || {
            freeAudio: 0,
            freeImages: 0,
            freeMessages: 0
        } : {
            freeAudio: 0,
            freeImages: 0,
            freeMessages: 0
        };
    },
    
    // Clear all conversation data
    clearConversationsV2: () => set({
        conversationsV2: {},
        activeConversationV2Id: null,
        messagesV2: {},
        limitsV2: {},
        chatsV2: [],
        loadingV2: false,
        sendingMessageV2: false,
        processingResponseV2: false,
        errorV2: null
    })
});