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

        // Convert snapshot to an array
        const girls = girlsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const results = [];
        const errors = [];

        // Process each girl to generate and save tweets
        for (const girlData of girls) {
            try {
                const girlId = girlData.id;

                // Check if there's an existing tweet for this girl
                const tweetDocRef = adminDb.firestore().collection('tweet').doc(girlId);
                const tweetDocSnapshot = await tweetDocRef.get();
                const existingTweetData = tweetDocSnapshot.exists ? tweetDocSnapshot.data() : null;

                // Get the initial LLM message and remove double quotes
                let llMMessage = await handleLLMInteraction(girlData, existingTweetData);
                llMMessage = llMMessage.replace(/"/g, '');

                // Retry up to 3 times if the message is too long (>150 characters)
                let attempts = 1;
                while (llMMessage.length > 150 && attempts < 3) {
                    llMMessage = await handleLLMInteraction(girlData, existingTweetData);
                    llMMessage = llMMessage.replace(/"/g, '');
                    attempts++;
                }

                // If the message is still too long after 3 attempts, skip this girl
                if (llMMessage.length > 150) {
                    errors.push({
                        girlId,
                        error: "Generated tweet too long after multiple attempts"
                    });
                    continue;
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

                results.push({
                    id: girlId,
                    ...tweetRecord
                });
            } catch (error) {
                errors.push({
                    girlId: girlData.id,
                    error: error.message
                });
            }
        }

        return new Response(JSON.stringify({
            success: true,
            processed: girls.length,
            successful: results.length,
            errors: errors.length,
            results,
            errorDetails: errors
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Error updating tweets:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
