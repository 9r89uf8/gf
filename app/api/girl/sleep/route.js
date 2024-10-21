import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const girlsCollection = await adminDb
            .firestore()
            .collection('girls')
            .orderBy('priority', 'desc')
            .get();

        const girls = [];
        const batch = adminDb.firestore().batch();

        girlsCollection.forEach(doc => {
            const girlData = doc.data();
            const girlRef = adminDb.firestore().collection('girls').doc(doc.id);

            // Generate a random timestamp between 5-20 minutes ago
            const now = new Date();
            const randomMinutes = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
            const lastSeenTimestamp = new Date(now.getTime() - randomMinutes * 60000);

            // Set girlOfflineUntil to 8 hours from now
            const girlOfflineUntil = new Date(now.getTime() + 8 * 60 * 60 * 1000);

            // Update the girl's data
            const updatedGirlData = {
                ...girlData,
                isActive: false,
                lastSeenGirl: lastSeenTimestamp,
                girlOfflineUntil: girlOfflineUntil
            };

            // Add the update operation to the batch
            batch.update(girlRef, updatedGirlData);

            // Add the updated girl data to the girls array
            girls.push({
                id: doc.id,
                ...updatedGirlData
            });
        });

        // Commit the batch update
        await batch.commit();

        return new Response(JSON.stringify(girls), {
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