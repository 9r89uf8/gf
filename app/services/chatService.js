// chatService.js
import { useStore } from '../store/store';

// V2 API Functions

export const loadConversation = async (userId, girlId) => {
    const { setConversationV2, setMessagesV2, setLimitsV2, setErrorV2 } = useStore.getState();
    
    try {
        const response = await fetch(`/api/v2/conversations/get-conversation?userId=${userId}&girlId=${girlId}`);
        const data = await response.json();
        
        if (response.ok) {
            const conversationId = `${userId}_${girlId}`;
            
            // Update store with conversation data
            if (data.conversation) {
                setConversationV2(conversationId, data.conversation);
                setLimitsV2(conversationId, {
                    freeAudio: data.conversation.freeAudio || 0,
                    freeImages: data.conversation.freeImages || 0,
                    freeMessages: data.conversation.freeMessages || 0
                });
            }
            
            // Set messages in store
            setMessagesV2(conversationId, data.messages || []);
            setErrorV2(null);
            
            return data;
        } else {
            setErrorV2(data.error);
            throw new Error(data.error);
        }
    } catch (err) {
        setErrorV2('Failed to load conversation');
        console.error('Error loading conversation:', err);
        throw err;
    }
};

export const sendMessage = async ({ userId, girlId, message, selectedMedia, userData, girlData, limits }) => {
    const { setSendingMessageV2, setErrorV2 } = useStore.getState();
    
    setSendingMessageV2(true);
    setErrorV2(null);
    
    try {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('girlId', girlId);
        
        if (selectedMedia) {
            formData.append('media', selectedMedia.file);
            formData.append('mediaType', selectedMedia.type);
        } else {
            formData.append('userMessage', message);
        }

        // Add cached data
        formData.append('userData', JSON.stringify(userData));
        formData.append('girlData', JSON.stringify(girlData));
        formData.append('currentLimits', JSON.stringify(limits));

        const response = await fetch('/api/v2/conversations/save-message', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        return data;
        
    } catch (err) {
        setErrorV2(err.message);
        console.error('Error sending message:', err);
        throw err;
    } finally {
        setSendingMessageV2(false);
    }
};

export const likeMessage = async ({ userId, girlId, messageId }) => {
    const { updateMessageV2, getMessagesV2 } = useStore.getState();
    const conversationId = `${userId}_${girlId}`;
    
    // Get current message state to check if already liked
    const messages = getMessagesV2(conversationId);
    const currentMessage = messages.find(msg => msg.id === messageId);
    const wasLiked = currentMessage?.liked || false;
    
    // Optimistic update - immediately update UI
    updateMessageV2(conversationId, messageId, { liked: true });
    
    try {
        const response = await fetch('/api/v2/conversations/update-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                girlId,
                messageId,
                updates: { liked: true }
            })
        });

        if (response.ok) {
            // Backend confirmed - no need to update again since we already did optimistically
            return await response.json();
        } else {
            // Backend failed - revert the optimistic update
            updateMessageV2(conversationId, messageId, { liked: wasLiked });
            throw new Error('Failed to like message');
        }
    } catch (err) {
        // Network or other error - revert the optimistic update
        updateMessageV2(conversationId, messageId, { liked: wasLiked });
        console.error('Error liking message:', err);
        throw err;
    }
};

export const clearMessages = async ({ userId, girlId }) => {
    const { setErrorV2 } = useStore.getState();
    
    setErrorV2(null);
    
    try {
        const response = await fetch('/api/v2/conversations/clear-messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                girlId
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error);
        }

        const data = await response.json();
        return data;
        
    } catch (err) {
        setErrorV2(err.message);
        console.error('Error clearing messages:', err);
        throw err;
    }
};


export const getChatList = async () => {
    const { setChatsV2 } = useStore.getState();

    try {
        const response = await fetch(`/api/v2/userChatList`, {
            method: 'GET'
        });
        if (response.ok) {
            const data = await response.json();
            setChatsV2(data);
            return data;
        } else {
            throw new Error('Failed to fetch chat list');
        }
    } catch (error) {
        console.error('Error fetching chat list:', error.message);
        return null;
    }
};
