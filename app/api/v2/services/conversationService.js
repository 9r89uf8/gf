// app/api/v2/services/conversationService.js
import { adminDb } from '@/app/utils/firebaseAdmin';

/**
 * Create or get existing conversation
 * @param {string} userId - The unique identifier of the user
 * @param {string} girlId - The unique identifier of the AI character
 * @returns {Promise<{conversationRef: FirebaseFirestore.DocumentReference, conversation: Object, isNew: boolean}>}
 * @throws {Error} If database operation fails
 */
export async function createOrGetConversation(userId, girlId) {
    const db = adminDb.firestore();
    const conversationId = `${userId}_${girlId}`;
    const conversationRef = db.collection('conversations').doc(conversationId);
    
    const conversationDoc = await conversationRef.get();
    
    if (!conversationDoc.exists) {
        const newConversation = {
            userId,
            girlId,
            lastActivity: adminDb.firestore.FieldValue.serverTimestamp(),
            latestMessage: null,
            freeAudio: 5,
            freeImages: 3,
            freeMessages: 30,
            messages: [],
            sentMedia: [] // Track sent image/video IDs to prevent duplicates
        };
        await conversationRef.set(newConversation);
        return { conversationRef, conversation: newConversation, isNew: true };
    }
    
    return { conversationRef, conversation: conversationDoc.data(), isNew: false };
}

/**
 * Save user message to conversation
 * @param {FirebaseFirestore.DocumentReference} conversationRef - Reference to the conversation document
 * @param {Object} userMessage - The user message object to save
 * @param {string} userMessage.id - Unique message identifier
 * @param {string} userMessage.content - Message content
 * @param {string|null} mediaType - Type of media ('image', 'audio', 'video', or null)
 * @param {boolean} isPremium - Whether the user has premium status
 * @returns {Promise<{userMessage: Object, conversation: Object, updatedLimits: Object}>}
 * @throws {Error} If transaction fails
 */
export async function saveUserMessage(conversationRef, userMessage, mediaType, isPremium) {
    const db = adminDb.firestore();
    
    return await db.runTransaction(async (transaction) => {
        const conversationDoc = await transaction.get(conversationRef);
        let conversation = conversationDoc.data();
        
        // Add user message to messages array
        const messages = conversation.messages || [];
        messages.push(userMessage);
        
        // Calculate limit decrements
        let updateData = {
            messages: messages,
            lastActivity: adminDb.firestore.FieldValue.serverTimestamp(),
            latestMessage: {
                content: userMessage.content || 'Media message',
                sender: 'user',
                mediaType: mediaType,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            }
        };

        // Only decrement limits for non-premium users
        if (!isPremium) {
            updateData.freeMessages = Math.max(0, (conversation.freeMessages || 0) - 1);
            
            if (mediaType === 'image') {
                updateData.freeImages = Math.max(0, (conversation.freeImages || 0) - 1);
            }
            
            if (mediaType === 'audio') {
                updateData.freeAudio = Math.max(0, (conversation.freeAudio || 0) - 1);
            }
        }

        transaction.update(conversationRef, updateData);

        // Return updated limits
        return {
            userMessage: userMessage,
            conversation: {
                ...conversation,
                ...updateData
            },
            updatedLimits: {
                freeAudio: updateData.freeAudio !== undefined ? updateData.freeAudio : conversation.freeAudio,
                freeImages: updateData.freeImages !== undefined ? updateData.freeImages : conversation.freeImages,
                freeMessages: updateData.freeMessages !== undefined ? updateData.freeMessages : conversation.freeMessages
            }
        };
    });
}

/**
 * Save assistant message to conversation
 * @param {FirebaseFirestore.DocumentReference} conversationRef - Reference to the conversation document
 * @param {Object} assistantMessage - The assistant message object to save
 * @param {string} userMessageId - ID of the user message to update status
 * @param {Object} responseData - Response data containing media information
 * @param {Object} currentLimits - Current usage limits
 * @param {boolean} isPremium - Whether the user has premium status
 * @returns {Promise<{assistantMessage: Object, conversationLimits: Object}>}
 * @throws {Error} If transaction fails
 */
export async function saveAssistantMessage(conversationRef, assistantMessage, userMessageId, responseData, currentLimits, isPremium) {
    const db = adminDb.firestore();
    
    return await db.runTransaction(async (transaction) => {
        const conversationDoc = await transaction.get(conversationRef);
        const conversationData = conversationDoc.data();
        const messages = conversationData.messages || [];
        const sentMedia = conversationData.sentMedia || [];
        
        // Add assistant message
        messages.push(assistantMessage);

        // Update user message status to completed
        const userMsgIndex = messages.findIndex(m => m.id === userMessageId);
        if (userMsgIndex !== -1) {
            messages[userMsgIndex].status = 'completed';
        }

        // Track sent media ID if media was sent
        if (responseData.mediaId && (responseData.mediaType === 'image' || responseData.mediaType === 'video')) {
            sentMedia.push(responseData.mediaId);
        }

        // Final update data
        let finalUpdateData = {
            messages: messages,
            sentMedia: sentMedia,
            lastActivity: adminDb.firestore.FieldValue.serverTimestamp(),
            latestMessage: {
                content: assistantMessage.content || 'Assistant response',
                sender: 'assistant',
                mediaType: assistantMessage.mediaType,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            }
        };

        // Decrement limits if applicable (for non-premium users)
        if (!isPremium) {
            if (responseData.mediaType === 'audio' && responseData.audioData) {
                finalUpdateData.freeAudio = Math.max(0, (currentLimits.freeAudio || 0) - 1);
            }
            if (responseData.mediaType === 'image' && responseData.mediaUrl) {
                finalUpdateData.freeImages = Math.max(0, (currentLimits.freeImages || 0) - 1);
            }
        }

        transaction.update(conversationRef, finalUpdateData);

        // Calculate final limits
        return {
            assistantMessage: assistantMessage,
            conversationLimits: {
                freeAudio: finalUpdateData.freeAudio !== undefined ? finalUpdateData.freeAudio : currentLimits.freeAudio,
                freeImages: finalUpdateData.freeImages !== undefined ? finalUpdateData.freeImages : currentLimits.freeImages,
                freeMessages: currentLimits.freeMessages
            }
        };
    });
}

/**
 * Update message status
 * @param {FirebaseFirestore.DocumentReference} conversationRef - Reference to the conversation document
 * @param {string} messageId - ID of the message to update
 * @param {string} status - New status ('processing', 'completed', 'failed')
 * @returns {Promise<void>}
 * @throws {Error} If transaction fails
 */
export async function updateMessageStatus(conversationRef, messageId, status) {
    const db = adminDb.firestore();
    
    return await db.runTransaction(async (transaction) => {
        const conversationDoc = await transaction.get(conversationRef);
        const messages = conversationDoc.data().messages || [];
        
        const messageIndex = messages.findIndex(m => m.id === messageId);
        if (messageIndex !== -1) {
            messages[messageIndex].status = status;
        }
        
        transaction.update(conversationRef, { messages: messages });
    });
}

/**
 * Add out of credits message
 * @param {FirebaseFirestore.DocumentReference} conversationRef - Reference to the conversation document
 * @param {Object} outOfCreditsMessage - The out of credits message to add
 * @param {string} userMessageId - ID of the user message to mark as completed
 * @returns {Promise<void>}
 * @throws {Error} If transaction fails
 */
export async function addOutOfCreditsMessage(conversationRef, outOfCreditsMessage, userMessageId) {
    const db = adminDb.firestore();
    
    return await db.runTransaction(async (transaction) => {
        const conversationDoc = await transaction.get(conversationRef);
        const messages = conversationDoc.data().messages || [];
        
        // Add out of credits message
        messages.push(outOfCreditsMessage);
        
        // Update user message status to completed
        const userMsgIndex = messages.findIndex(m => m.id === userMessageId);
        if (userMsgIndex !== -1) {
            messages[userMsgIndex].status = 'completed';
        }

        transaction.update(conversationRef, {
            messages: messages,
            lastActivity: adminDb.firestore.FieldValue.serverTimestamp(),
            latestMessage: {
                content: outOfCreditsMessage.content,
                sender: 'assistant',
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            }
        });
    });
}

/**
 * Clear all messages from a conversation while preserving user quotas
 * @param {string} userId - The unique identifier of the user
 * @param {string} girlId - The unique identifier of the AI character
 * @returns {Promise<{success: boolean, conversationId: string}>}
 * @throws {Error} If conversation doesn't exist or transaction fails
 */
export async function clearConversationMessages(userId, girlId) {
    const db = adminDb.firestore();
    const conversationId = `${userId}_${girlId}`;
    const conversationRef = db.collection('conversations').doc(conversationId);
    
    return await db.runTransaction(async (transaction) => {
        const conversationDoc = await transaction.get(conversationRef);
        
        if (!conversationDoc.exists) {
            throw new Error('Conversation not found');
        }
        
        // Only update messages and latestMessage, preserve all other fields
        transaction.update(conversationRef, {
            messages: [],
            sentMedia: [], // Reset sent media tracking when clearing conversation
            latestMessage: null,
            lastActivity: adminDb.firestore.FieldValue.serverTimestamp()
        });
        
        return {
            success: true,
            conversationId: conversationId
        };
    });
}