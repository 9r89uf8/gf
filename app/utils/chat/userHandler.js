// app/utils/chat/userHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';
export const updateUserMessages = async (userId) => {
    const userRef = adminDb.firestore().collection('users').doc(userId);
    await userRef.update({
        freeMessages: adminDb.firestore.FieldValue.increment(-1)
    });

    const updatedUserDoc = await userRef.get();
    return updatedUserDoc.data();
};