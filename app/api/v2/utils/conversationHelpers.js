// app/api/v2/utils/conversationHelpers.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate conversation ID from userId and girlId
 */
export function generateConversationId(userId, girlId) {
    return `${userId}_${girlId}`;
}


/**
 * Update message in conversation array
 */
export async function updateMessageInConversation(userId, girlId, messageId, updates) {
    const conversationId = generateConversationId(userId, girlId);
    const conversationRef = adminDb.firestore().collection('conversations').doc(conversationId);
    
    // Get current conversation
    const doc = await conversationRef.get();
    if (!doc.exists) {
        throw new Error('Conversation not found');
    }
    
    const conversation = doc.data();
    const messages = conversation.messages || [];
    
    // Find and update the message
    const updatedMessages = messages.map(msg => {
        if (msg.id === messageId) {
            return { ...msg, ...updates };
        }
        return msg;
    });
    
    // Update the conversation
    await conversationRef.update({
        messages: updatedMessages,
        lastActivity: adminDb.firestore.FieldValue.serverTimestamp()
    });
    
    return updatedMessages.find(msg => msg.id === messageId);
}


/**
 * Get conversation by ID
 */
export async function getConversationById(userId, girlId) {
    const conversationId = generateConversationId(userId, girlId);
    const conversationRef = adminDb.firestore().collection('conversations').doc(conversationId);
    
    const doc = await conversationRef.get();
    if (!doc.exists) {
        return null;
    }
    
    return { id: conversationId, ...doc.data() };
}


