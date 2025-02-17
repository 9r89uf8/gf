// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import {NextResponse} from "next/server";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { messageUid, girlId } = await req.json();

        // Reference to the specific message in the 'displayMessages' subcollection
        let messageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
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