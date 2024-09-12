// app/api/posts/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export async function GET(req) {
    try {
        await authMiddleware(req);

        // Get reference to user's 'audios' subcollection
        let audioRef = adminDb.firestore().collection('users').doc(req.user.uid).collection('displayAudios').orderBy('timestamp', 'asc');

        // Get the documents from the 'audios' subcollection
        let audioDocs = await audioRef.get();

        // Create an array to store the audio data
        let audioDataArray = [];

        // Loop through the documents and push the audio data to the array
        audioDocs.forEach((doc) => {
            let audioData = doc.data()
            audioDataArray.push(audioData);
        });


        return new Response(JSON.stringify(audioDataArray), {
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