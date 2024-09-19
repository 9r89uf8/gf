// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";

export async function GET(req) {
    try {
        await authMiddleware(req);
        const userId = req.user.uid;

        // Get references to user's subcollections
        const userRef = adminDb.firestore().collection('users').doc(userId);
        const subcollections = ['conversations', 'displayMessages', 'displayAudios'];

        // Function to delete all documents in a collection
        async function deleteCollection(collectionRef) {
            const batch = adminDb.firestore().batch();
            const snapshot = await collectionRef.get();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }

        // Delete documents from each subcollection
        for (const subcollection of subcollections) {
            const collectionRef = userRef.collection(subcollection);
            await deleteCollection(collectionRef);
        }

        return new Response(JSON.stringify({ message: 'All user data deleted successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error deleting user data:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}