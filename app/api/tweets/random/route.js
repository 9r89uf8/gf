// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { handleLLMInteraction } from "@/app/utils/tweets/llHandler";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {

        // Fetch all girls from the collection
        const girlsSnapshot = await adminDb.firestore().collection('girls').get();
        if (girlsSnapshot.empty) {
            return new Response(JSON.stringify({ error: 'No girls available' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Convert snapshot to an array and choose a random girl
        const girls = girlsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const randomIndex = Math.floor(Math.random() * girls.length);
        const randomGirl = girls[randomIndex];
        const girlId = randomGirl.id;
        const girlData = randomGirl;

        // Get the initial LLM message and remove double quotes
        let llMMessage = await handleLLMInteraction(girlData);
        llMMessage = llMMessage.replace(/"/g, '');

        // Retry up to 3 times if the message is too long (>100 characters)
        let attempts = 1;
        while (llMMessage.length > 100 && attempts < 3) {
            llMMessage = await handleLLMInteraction(girlData);
            llMMessage = llMMessage.replace(/"/g, '');
            attempts++;
        }

        // If the message is still too long after 3 attempts, do not save it; just return "ok"
        if (llMMessage.length > 100) {
            return new Response("ok", { status: 200 });
        }

        const tweetRecord = {
            girlId: girlId,
            text: llMMessage,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        };

        // Reference the tweet document by girlId
        const tweetDocRef = adminDb.firestore().collection('tweet').doc(girlId);
        const tweetDocSnapshot = await tweetDocRef.get();

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
