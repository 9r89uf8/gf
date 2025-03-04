// app/api/archivedConversation
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
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
        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Calculate the date 5 days ago
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        // Get all archived conversations
        const archivedConversationsSnapshot = await adminDb.firestore()
            .collection('archivedConversations')
            .get();

        // Extract recent users (created less than 5 days ago)
        const recentUsers = [];

        for (const doc of archivedConversationsSnapshot.docs) {
            const userData = doc.data();

            // Check if archivedAt exists and is less than 5 days ago
            if (userData.archivedAt &&
                userData.archivedAt.toDate() > fiveDaysAgo) {

                // Get user's display messages
                const messagesRef = doc.ref
                    .collection('displayMessages')
                    .orderBy('timestamp', 'asc');

                const messagesSnapshot = await messagesRef.get();

                // Extract message data
                const messageDataArray = messagesSnapshot.docs.map(msgDoc => {
                    const data = msgDoc.data();
                    return {
                        id: msgDoc.id,
                        ...data,
                        timestamp: data.timestamp?.toDate().toISOString() || null
                    };
                });

                // Add user with their messages to the result
                recentUsers.push({
                    userId: doc.id,
                    userData: {
                        ...userData,
                        archivedAt: userData.archivedAt.toDate().toISOString()
                    },
                    messages: messageDataArray
                });
            }
        }

        // If no recent users found
        if (recentUsers.length === 0) {
            return new Response(JSON.stringify({ message: 'No users found that were archived in the last 5 days' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Return all recent users with their messages
        return new Response(JSON.stringify({
            recentUsers,
            count: recentUsers.length
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}