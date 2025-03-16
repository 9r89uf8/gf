// app/utils/chat/messageProcessor.js
import { adminDb } from '@/app/utils/firebaseAdmin';

// Get all unprocessed user messages, ordered by timestamp
export const getUnprocessedMessages = async (userId, girlId) => {
    const displayMessageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages');

    const query = displayMessageRef
        .where('role', '==', 'user')
        .where('processed', '==', false)
        .where('status', '==', 'normal')
        .where('isProcessing', '==', false)  // Exclude messages that are being processed
        .orderBy('timestamp', 'asc'); // Process oldest messages first

    const messagesSnapshot = await query.get();

    if (messagesSnapshot.empty) {
        return [];
    }

    // Return all unprocessed messages with their IDs
    // Replace content with mediaContent for image and video types
    return messagesSnapshot.docs.map(doc => {
        const data = doc.data();

        // Check if mediaType is 'image' or 'video' and replace content with mediaContent
        if (data.mediaType === 'image' || data.mediaType === 'video') {
            if (data.mediaContent) {
                data.content = data.mediaContent;
            }
        }

        return {
            id: doc.id,
            ...data
        };
    });
};

// Mark a message as currently being processed
export const markMessageAsProcessing = async (userId, girlId, messageId) => {
    const messageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages')
        .doc(messageId);

    await messageRef.update({
        isProcessing: true,
        processingStartTime: adminDb.firestore.FieldValue.serverTimestamp()
    });
};

// Mark a single message as seen
export const markMessageAsSeen = async (userId, girlId, messageId) => {
    const messageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages')
        .doc(messageId);

    await messageRef.update({
        seen: true
    });
};

// Mark a single message as processed
export const markMessageAsProcessed = async (userId, girlId, messageId, liked = false) => {
    const messageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages')
        .doc(messageId);

    await messageRef.update({
        processed: true,
        isProcessing: false,  // Clear processing flag
        liked: liked || false
    });
};

// Reset "stuck" processing messages (processing for more than X minutes)
export const resetStuckProcessingMessages = async (userId, girlId, maxProcessingTimeMinutes = 5) => {
    const displayMessageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages');

    // Calculate cutoff time (X minutes ago)
    const cutoffTime = new Date();
    cutoffTime.setMinutes(cutoffTime.getMinutes() - maxProcessingTimeMinutes);

    // Get messages that have been processing for too long
    const query = displayMessageRef
        .where('isProcessing', '==', true)
        .where('processingStartTime', '<', cutoffTime);

    const stuckMessages = await query.get();

    // Reset all stuck messages
    const batch = adminDb.firestore().batch();
    stuckMessages.docs.forEach(doc => {
        const messageRef = displayMessageRef.doc(doc.id);
        batch.update(messageRef, {
            isProcessing: false,
            processingError: 'Processing timed out and was reset'
        });
    });

    if (!stuckMessages.empty) {
        await batch.commit();
        console.log(`Reset ${stuckMessages.size} stuck processing messages`);
    }

    return stuckMessages.size;
};
