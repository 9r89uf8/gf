// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import {NextResponse} from "next/server";
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const chatsRef = adminDb.firestore().collection('users').doc(userId).collection('conversations');
        const chatsDocs = await chatsRef.get();
        const chatDataArray = [];
        const girlIds = [];

        // Collect all girlIds
        chatsDocs.docs.forEach(doc => {
            girlIds.push(doc.id);
        });

        // Fetch all girl documents in a single query (batch if more than 10)
        const girlsQuery = adminDb.firestore().collection('girls')
            .where(adminDb.firestore.FieldPath.documentId(), 'in', girlIds.slice(0, 10)); // Adjust for batches
        const girlsSnapshot = await girlsQuery.get();

        // Map girl data by girlId
        const girlsData = {};
        girlsSnapshot.forEach(doc => {
            girlsData[doc.id] = doc.data();
        });

        // Build the chat data array
        chatsDocs.docs.forEach(doc => {
            const girlId = doc.id;
            const chatData = doc.data();
            const girlData = girlsData[girlId];

            if (girlData) {
                chatDataArray.push({
                    girlId: girlId,
                    picture: girlData.picture,
                    lastMessage: chatData.lastMessage
                });
            }
        });

        return new Response(JSON.stringify(chatDataArray), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}