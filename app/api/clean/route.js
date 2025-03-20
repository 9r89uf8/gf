// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';

export const maxDuration = 100; // Function can run for a maximum of 300 seconds (5 minutes)

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {
        const now = Date.now();
        const oneDayAgo = now - (24 * 60 * 60 * 1000);

        const rateLimitRef = await adminDb.firestore().collection('rateLimits');
        const snapshot = await rateLimitRef.where('lastRequest', '<', oneDayAgo).get();

        const batch = adminDb.firestore().batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        if (snapshot.size > 0) {
            await batch.commit();
            console.log(`Cleaned up ${snapshot.size} old rate limit entries`);
        }

        return null;
    } catch (error) {
        console.error('Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}