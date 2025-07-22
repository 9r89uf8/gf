import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { invalidateGirlCache } from '@/app/api/v2/services/girlsServerService';

export async function DELETE(req) {
    try {
        // Verify admin authentication
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') { // Replace with your admin check logic
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Get girl ID from query params
        const { searchParams } = new URL(req.url);
        const girlId = searchParams.get('id');

        if (!girlId) {
            return NextResponse.json({ error: 'Girl ID is required' }, { status: 400 });
        }

        // Start a batch operation for atomic deletion
        const batch = adminDb.firestore().batch();

        // Check if girl exists
        const girlRef = adminDb.firestore().collection('girls').doc(girlId);
        const girlDoc = await girlRef.get();

        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        const girlData = girlDoc.data();
        console.log(`[DeleteGirl] Deleting girl: ${girlData.name} (${girlId})`);

        // 1. Delete the girl document
        batch.delete(girlRef);

        // 2. Delete all posts from girls-posts collection
        const postsSnapshot = await adminDb.firestore()
            .collection('girls-posts')
            .where('girlId', '==', girlId)
            .get();

        console.log(`[DeleteGirl] Found ${postsSnapshot.size} posts to delete`);
        postsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });


        // 6. Delete all gallery items
        const gallerySnapshot = await adminDb.firestore()
            .collection('gallery')
            .where('girlId', '==', girlId)
            .get();

        console.log(`[DeleteGirl] Found ${gallerySnapshot.size} gallery items to delete`);
        gallerySnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });


        // Commit the batch
        await batch.commit();

        // Invalidate Redis cache
        await invalidateGirlCache(girlId);

        console.log(`[DeleteGirl] Successfully deleted girl ${girlData.name} and all related data`);

        return NextResponse.json({
            success: true,
            message: 'Girl and all related data deleted successfully',
            deletedCounts: {
                posts: postsSnapshot.size,
                gallery: gallerySnapshot.size
            }
        });

    } catch (error) {
        console.error('[DeleteGirl] Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete girl' },
            { status: 500 }
        );
    }
}