import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        // Check if the user is admin
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { girlId } = await req.json();

        // Reference to the specific girl document
        const girlRef = adminDb.firestore().collection('girls').doc(girlId);

        // Get the girl document
        const girlDoc = await girlRef.get();

        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        // Reference to the posts collection
        const postsRef = adminDb.firestore().collection('posts');

        // Query for all posts with the given girlId
        const postsQuery = await postsRef.where('girlId', '==', girlId).get();

        // Delete all associated posts
        const batch = adminDb.firestore().batch();
        postsQuery.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Delete the girl document
        batch.delete(girlRef);

        // Commit the batch
        await batch.commit();

        // Return the ID of the deleted girl and the number of deleted posts
        return NextResponse.json({
            deletedGirlId: girlId,
            deletedPostsCount: postsQuery.size
        }, { status: 200 });
    } catch (error) {
        console.error('Error deleting girl and associated posts:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}