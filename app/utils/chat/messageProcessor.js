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

// Get the last processed message (keep for backward compatibility)
export const getLastProcessedMessage = async (userId, girlId) => {
    const displayMessageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages');

    const query = displayMessageRef
        .where('role', '==', 'user')
        .where('processed', '==', true)
        .orderBy('timestamp', 'desc')
        .limit(1);

    const messageSnapshot = await query.get();

    if (messageSnapshot.empty) {
        return null;
    }

    // Return the first (and only) document with its ID and data
    const doc = messageSnapshot.docs[0];
    return {
        id: doc.id,
        ...doc.data()
    };
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
        liked: liked || false
    });
};

// Mark all unprocessed messages as seen (keep for backward compatibility)
export const markMessagesAsSeen = async (userId, girlId, likedMessageByAssistant = false) => {
    const displayMessageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages');

    const query = displayMessageRef
        .where('role', '==', 'user')
        .where('seen', '==', false)
        .orderBy('timestamp', 'desc');

    const messagesSnapshot = await query.get();

    if (!messagesSnapshot.empty) {
        const batch = adminDb.firestore().batch();
        let isFirstDoc = true;

        messagesSnapshot.forEach((doc) => {
            if (isFirstDoc && likedMessageByAssistant) {
                batch.update(doc.ref, {
                    seen: true,
                    processed: true,
                    liked: true
                });
            } else {
                batch.update(doc.ref, {
                    seen: true,
                    processed: true
                });
            }
            isFirstDoc = false;
        });

        await batch.commit();
    }
};