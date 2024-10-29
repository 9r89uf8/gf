// app/utils/chat/conversationHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';
export const updateConversation = async (conversationRef, conversationHistory, girlData, doc) => {
    const updateData = {
        messages: conversationHistory,
        lastMessage: {
            content: `${girlData.name} te respondió`,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
            sender: 'assistant'
        },
        lastSeen: adminDb.firestore.FieldValue.serverTimestamp(),
        girlIsTyping: false
    };

    if (doc.exists) {
        const data = doc.data();
        updateData.isGirlOnline = typeof data.isGirlOnline === 'boolean' ? data.isGirlOnline : true;
        updateData.girlOfflineUntil = data.girlOfflineUntil instanceof adminDb.firestore.Timestamp
            ? data.girlOfflineUntil
            : null;
    } else {
        updateData.isGirlOnline = true;
        updateData.girlOfflineUntil = null;
    }

    await conversationRef.set(updateData, { merge: true });
};