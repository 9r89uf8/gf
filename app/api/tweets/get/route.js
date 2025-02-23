// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const { id } = await req.json();

        // Fetch only the first tweet for the given girlId
        const tweetSnapshot = await adminDb.firestore().collection('tweet')
            .where('girlId', '==', id)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get();

        if (tweetSnapshot.empty) {
            return new Response(JSON.stringify({ message: "No tweet found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get the first tweet document
        const tweetDoc = tweetSnapshot.docs[0];
        const tweetData = tweetDoc.data();

        // Combine tweet data with its document id
        const responseData = {
            id: tweetDoc.id,
            ...tweetData,
        };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            },
        });
    } catch (error) {
        console.error(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
