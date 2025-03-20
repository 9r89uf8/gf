// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';

export const maxDuration = 100; // Function can run for a maximum of 300 seconds (5 minutes)

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {
        const rateLimitRef = adminDb.firestore().collection('rateLimits');
        const snapshot = await rateLimitRef.get(); // Get all entries

        const batch = adminDb.firestore().batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        let deletedCount = snapshot.size;
        if (deletedCount > 0) {
            await batch.commit();
            console.log(`Cleaned up ${deletedCount} rate limit entries`);
        }

        return new Response(JSON.stringify({ message: `Cleaned up ${deletedCount} rate limit entries` }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

