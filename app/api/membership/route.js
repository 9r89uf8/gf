// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {


        const docRef = adminDb.firestore().collection('membership').doc('aux7IacA81ktapWe1hrr');
        const doc = await docRef.get();

        if (!doc.exists) {
            return new Response(JSON.stringify({ error: 'Document not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = {
            id: doc.id,
            ...doc.data()
        };

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}