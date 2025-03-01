// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const { id } = await req.json();

        // Directly get the tweet document using the girlId as the document id
        const tweetDoc = await adminDb.firestore().collection('tweet').doc(id).get();

        if (!tweetDoc.exists) {
            return new Response(JSON.stringify({ message: "No tweet found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const tweetData = tweetDoc.data();
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

