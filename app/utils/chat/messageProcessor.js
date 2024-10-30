// app/utils/chat/messageProcessor.js
import { adminDb } from '@/app/utils/firebaseAdmin';

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

export const markMessagesAsSeen = async (userId, girlId, likedMessageByAssistant) => {
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