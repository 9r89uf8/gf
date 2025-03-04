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

        const userDocF = await adminDb.firestore()
            .collection('users')
            .doc(userId)
            .get();
        const userData = userDocF.data();

        // Prepare basic data for archiving
        const archiveData = {
            userData,
            girlId,
            archivedAt: adminDb.firestore.FieldValue.serverTimestamp()
        };

        // Get reference to the displayMessages subcollection
        const displayMessagesRef = conversationRef.collection('displayMessages');

        // Reference to the archived conversation document
        const archivedConversationId = `${userId}_${girlId}`;
        const archivedConversationRef = adminDb.firestore()
            .collection('archivedConversations')
            .doc(archivedConversationId);

        // Check if archive already exists
        const existingArchive = await archivedConversationRef.get();

        // If archive exists, delete it and all subcollections first
        if (existingArchive.exists) {
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

            // Delete the subcollections of the existing archive
            const subcollections = await archivedConversationRef.listCollections();
            for (const subcollection of subcollections) {
                await deleteCollection(subcollection);
            }
        }

        // Save the conversation data (creates new or overwrites existing)
        await archivedConversationRef.set(archiveData);

        // Save all display messages as a subcollection
        const archivedMessagesRef = archivedConversationRef.collection('displayMessages');

        // Fetch and save messages in batches
        const batchSize = 100; // Firestore batch limit
        let messageSnapshot = await displayMessagesRef.limit(batchSize).get();

        while (!messageSnapshot.empty) {
            const batch = adminDb.firestore().batch();

            messageSnapshot.docs.forEach((doc) => {
                const messageRef = archivedMessagesRef.doc(doc.id);
                batch.set(messageRef, doc.data());
            });

            await batch.commit();

            // Get the last document processed
            const lastDoc = messageSnapshot.docs[messageSnapshot.docs.length - 1];

            // Get the next batch
            messageSnapshot = await displayMessagesRef
                .startAfter(lastDoc)
                .limit(batchSize)
                .get();
        }

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

        return NextResponse.json({
            message: 'Data for the girl deleted successfully and archived',
            archivedConversationId: archivedConversationRef.id
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting and archiving user data:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
