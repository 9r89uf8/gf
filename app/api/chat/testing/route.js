// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import {authMiddleware} from "@/app/middleware/authMiddleware";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        let girlId = 'BgHd9LWDnFFhS6BoaqwL'
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

        // Get all users first
        const usersSnapshot = await adminDb.firestore()
            .collection('users')
            .orderBy('timestamp', 'asc')
            .get();

        // Extract all user IDs
        const userIds = usersSnapshot.docs.map(doc => doc.id);

        // If no users found, return error
        if (userIds.length === 0) {
            console.error('Users not found');
            return new Response(JSON.stringify({ error: 'No users found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Randomly select a user ID
        const randomIndex = Math.floor(Math.random() * userIds.length);
        const randomUserId = userIds[randomIndex];

        // Get reference to the randomly selected user's messages
        const messagesRef = adminDb.firestore()
            .collection('users')
            .doc(randomUserId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages')
            .orderBy('timestamp', 'asc');

        // Get the messages
        const messagesDocs = await messagesRef.get();

        // Transform the messages data
        const messageDataArray = messagesDocs.docs.map(doc => ({
            id: doc.id,
            userId: randomUserId, // Including the userId for reference
            ...doc.data()
        }));

        // If no messages found for this user and girlId combination
        if (messageDataArray.length === 0) {
            console.error('No messages found');
            return new Response(JSON.stringify({ error: 'No messages found for the selected user' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(messageDataArray), {
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