// app/utils/chat/messageProcessor.js
import { adminDb } from '@/app/utils/firebaseAdmin';

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