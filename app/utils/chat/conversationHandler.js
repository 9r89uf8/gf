// app/utils/chat/conversationHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';

export const updateConversation = async (conversationRef, conversationHistory, girlData, doc, typeOfMessage, typeOfMessageContent) => {
    // Create message content based on the type of message
    let contentMessage;

    switch(typeOfMessage) {
        case 'audio':
            contentMessage = `${girlData.name} te envió un audio`;
            break;
        case 'video':
            contentMessage = `${girlData.name} te envió un video`;
            break;
        case 'image':
            contentMessage = `${girlData.name} te envió una image`;
            break;
        case 'text':
        default:
            contentMessage = `${girlData.name} te envió un texto`;
            break;
    }

    const updateData = {
        messages: conversationHistory,
        lastMessage: {
            content: contentMessage,
            message: typeOfMessageContent?typeOfMessageContent:'',
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
            sender: 'assistant',
            mediaType: typeOfMessage
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