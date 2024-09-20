// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export async function GET() {
    try {

        const rafflesSnapshot = await adminDb.firestore().collection('clips').get();

        let activeRaffles = rafflesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fisher-Yates (aka Knuth) Shuffle
        let currentIndex = activeRaffles.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = activeRaffles[currentIndex];
            activeRaffles[currentIndex] = activeRaffles[randomIndex];
            activeRaffles[randomIndex] = temporaryValue;
        }

        return new Response(JSON.stringify(activeRaffles), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}