// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;

        // Get all conversations for this user from the top-level conversations collection
        const conversationsRef = adminDb.firestore().collection('conversations');
        const conversationsQuery = conversationsRef.where('userId', '==', userId);
        const conversationsSnapshot = await conversationsQuery.get();

        // Collect all unique girlIds
        const girlIds = new Set();
        const conversations = [];

        conversationsSnapshot.forEach(doc => {
            const data = doc.data();
            girlIds.add(data.girlId);
            conversations.push(data);
        });

        // Convert Set to Array
        const girlIdsArray = Array.from(girlIds);

        // Fetch all girls data
        let girlsData = {};
        if (girlIdsArray.length > 0) {
            // Firestore 'in' query has a limit of 10, so we need to batch if there are more
            const batchSize = 10;
            for (let i = 0; i < girlIdsArray.length; i += batchSize) {
                const batch = girlIdsArray.slice(i, i + batchSize);
                const girlsQuery = adminDb.firestore().collection('girls')
                    .where(adminDb.firestore.FieldPath.documentId(), 'in', batch);
                const girlsSnapshot = await girlsQuery.get();

                girlsSnapshot.forEach(doc => {
                    girlsData[doc.id] = doc.data();
                });
            }
        }

        // Build the response array with only the data you want
        const chatDataArray = conversations
            .filter(conversation => {
                // Only include conversations that have at least one message
                return conversation.messages && conversation.messages.length > 0;
            })
            .map(conversation => {
                const girlData = girlsData[conversation.girlId];

                if (!girlData) {
                    return null; // Skip if girl data not found
                }

                return {
                    girlId: conversation.girlId,
                    picture: girlData.pictureUrl,
                    girlName: girlData.username,
                    lastMessage: conversation.latestMessage, // Note: using latestMessage from new structure
                    // You can add other fields from the conversation here if needed
                    freeAudio: conversation.freeAudio,
                    freeImages: conversation.freeImages,
                    freeMessages: conversation.freeMessages,
                    lastActivity: conversation.lastActivity,
                    messageCount: conversation.messages.length // Optional: include message count
                };
            })
            .filter(Boolean); // Remove any null entries

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