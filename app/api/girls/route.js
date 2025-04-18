
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET() {
    try {
        const girlsCollection = await adminDb
            .firestore()
            .collection('girls')
            .orderBy('priority', 'desc')  // Add this line to sort by priority in descending order
            .get();

        const girls = [];
        girlsCollection.forEach(doc => {
            girls.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return new Response(JSON.stringify(girls), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}