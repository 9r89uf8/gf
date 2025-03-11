// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        let girlIds = ['uerQ5TMDanh1wex83HIE', 'BgHd9LWDnFFhS6BoaqwL']
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

        // Calculate date 5 days ago
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        // Get users with timestamps from last 5 days
        const usersSnapshot = await adminDb.firestore()
            .collection('users')
            .where('timestamp', '>=', fiveDaysAgo)
            .orderBy('timestamp', 'desc')
            .get();

        // Return error if no recent users found
        if (usersSnapshot.empty) {
            console.error('No users found from the last 5 days');
            return new Response(JSON.stringify({ error: 'No recent users found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Process each user and their messages
        const results = [];

        for (const userDoc of usersSnapshot.docs) {
            const userData = {
                id: userDoc.id,
                ...userDoc.data()
            };

            // Try to find messages for any girl ID
            let foundMessages = false;

            // We'll check each girl ID in order until we find messages
            for (const girlId of girlIds) {
                // Get the user's messages for this specific girl
                const messagesRef = adminDb.firestore()
                    .collection('users')
                    .doc(userDoc.id)
                    .collection('conversations')
                    .doc(girlId)
                    .collection('displayMessages')
                    .orderBy('timestamp', 'asc');

                const messagesDocs = await messagesRef.get();

                // If messages exist for this girl
                if (!messagesDocs.empty) {
                    // Transform the messages data
                    const displayMessages = messagesDocs.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Add this user and their messages to results
                    results.push({
                        userData,
                        displayMessages,
                        girlId // Include which girl these messages are for
                    });

                    foundMessages = true;
                    break; // Stop checking other girl IDs for this user
                }
            }

        }

        // If no results found
        if (results.length === 0) {
            console.error('No messages found for any recent users');
            return new Response(JSON.stringify({ error: 'No messages found for recent users' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(results), {
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