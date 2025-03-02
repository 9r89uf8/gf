// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { handleLLMInteraction } from "@/app/utils/tweets/llHandler";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { girlId } = await req.json();

        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Get girl data
        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlData = girlDoc.data();

        // Check if there's an existing tweet for this girl
        const tweetDocRef = adminDb.firestore().collection('tweet').doc(girlId);
        const tweetDocSnapshot = await tweetDocRef.get();
        const existingTweetData = tweetDocSnapshot.exists ? tweetDocSnapshot.data() : null;

        // Get the initial LLM message and remove double quotes
        let llMMessage = await handleLLMInteraction(girlData, existingTweetData);
        llMMessage = llMMessage.replace(/"/g, '');

        // Retry up to 3 times if the message is too long (>100 characters)
        let attempts = 1;
        while (llMMessage.length > 200 && attempts < 3) {
            llMMessage = await handleLLMInteraction(girlData, existingTweetData);
            llMMessage = llMMessage.replace(/"/g, '');
            attempts++;
        }

        // If the message is still too long after 3 attempts, do not save it; just return "ok"
        if (llMMessage.length > 150) {
            return new Response("ok", { status: 200 });
        }

        const tweetRecord = {
            girlId: girlId,
            text: llMMessage,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        };

        if (tweetDocSnapshot.exists) {
            // Update the existing tweet
            await tweetDocRef.update(tweetRecord);
        } else {
            // Create a new tweet with the document id as girlId
            await tweetDocRef.set(tweetRecord);
        }

        return new Response(JSON.stringify({
            id: girlId,
            ...tweetRecord,
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Error updating tweet:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}