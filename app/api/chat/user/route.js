// app/api/posts/create/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const { userId } = await req.json();


        // Get reference to user's 'audios' subcollection
        let messagesRef = adminDb.firestore().collection('users').doc(userId).collection('displayMessages').orderBy('timestamp', 'asc');

        // Get the documents from the 'audios' subcollection
        let messagesDocs = await messagesRef.get();

        // Create an array to store the audio data
        let messageDataArray = [];

        // Loop through the documents and push the audio data to the array
        messageDataArray = messagesDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return new Response(JSON.stringify(messageDataArray), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

