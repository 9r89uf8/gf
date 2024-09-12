// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
    try {
        await authMiddleware(req);
        const { messageUid } = await req.json();

        // Reference to the specific message in the 'displayMessages' subcollection
        let messageRef = adminDb.firestore()
            .collection('users')
            .doc(req.user.uid)
            .collection('displayMessages')
            .doc(messageUid)

        // Transaction to ensure atomic update of the 'liked' status
        await adminDb.firestore().runTransaction(async (transaction) => {
            const messageDoc = await transaction.get(messageRef);

            if (!messageDoc.exists) {
                throw new Error('Message not found');
            }

            // Toggle the 'liked' status
            const wasLiked = messageDoc.data().liked || false;
            transaction.update(messageRef, { liked: !wasLiked });
        });

        // Fetch the updated message
        const updatedMessageDoc = await messageRef.get();
        const updatedMessageData = { id: updatedMessageDoc.id, ...updatedMessageDoc.data() };

        return new Response(JSON.stringify(updatedMessageData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}