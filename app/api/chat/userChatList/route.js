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

        const girlsCollection = await adminDb
            .firestore()
            .collection('girls')
            .orderBy('priority', 'desc')
            .get();

        const userId = authResult.user.uid;
        const chatsRef = adminDb.firestore().collection('users').doc(userId).collection('conversations');
        const chatsDocs = await chatsRef.get();
        const chatDataArray = [];
        const girlIds = [];

        // Collect all girlIds
        chatsDocs.docs.forEach(doc => {
            girlIds.push(doc.id);
        });

        // Check if girlIds is not empty before querying
        let girlsData = {};
        if (girlIds.length > 0) {
            // Fetch all girl documents in a single query (batch if more than 10)
            const girlsQuery = adminDb.firestore().collection('girls')
                .where(adminDb.firestore.FieldPath.documentId(), 'in', girlIds.slice(0, 10)); // Adjust for batches
            const girlsSnapshot = await girlsQuery.get();

            // Map girl data by girlId
            girlsSnapshot.forEach(doc => {
                girlsData[doc.id] = doc.data();
            });
        }

        // Build the chat data array
        chatsDocs.docs.forEach(doc => {
            const girlId = doc.id;
            const chatData = doc.data();
            const girlData = girlsData[girlId];
            let finalIsActive;
            let finalLastSeen;
            if(!girlData.isActive){
                finalIsActive = false;
                finalLastSeen = girlData.lastSeenGirl
            }
            if(girlData.isActive&&chatData.isGirlOnline){
                finalIsActive = chatData.isGirlOnline
                finalLastSeen = chatData.lastSeen
            }

            if (girlData) {
                chatDataArray.push({
                    girlId: girlId,
                    picture: girlData.picture,
                    isActive: finalIsActive,
                    lastSeenGirl: finalLastSeen,
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

