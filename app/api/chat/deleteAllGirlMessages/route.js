// app/api/auth/register/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }
        const userId = authResult.user.uid;

        const { girlId } = await req.json();

        if (!girlId) {
            return NextResponse.json({ error: 'girlId parameter is required' }, { status: 400 });
        }

        // Get reference to the user's conversation with the specific girl
        const conversationRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId);

        // Function to delete all documents in a collection
        async function deleteCollection(collectionRef) {
            const batchSize = 100; // Firestore batch limit
            let snapshot = await collectionRef.limit(batchSize).get();
            while (!snapshot.empty) {
                const batch = adminDb.firestore().batch();
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                await batch.commit();

                snapshot = await collectionRef.limit(batchSize).get();
            }
        }

        // Function to delete a document and its subcollections
        async function deleteDocumentAndSubcollections(docRef) {
            // List subcollections under this document
            const subcollections = await docRef.listCollections();
            for (const subcollection of subcollections) {
                await deleteCollection(subcollection);
            }
            // Delete the document itself
            await docRef.delete();
        }

        // Delete the conversation and its subcollections
        await deleteDocumentAndSubcollections(conversationRef);

        return NextResponse.json({ message: 'Data for the girl deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user data:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
