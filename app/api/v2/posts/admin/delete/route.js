import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import cloudflareService from '@/app/api/v2/services/cloudflareService';
import { invalidatePostsCache } from '@/app/api/v2/services/postsServerService';
import { invalidateGirlCache } from '@/app/api/v2/services/girlsServerService';
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const postRef = adminDb.firestore().collection('girls-posts').doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const postData = postDoc.data();

        // Only try to delete from Cloudflare if it's not a text post and has an uploadId
        if (postData.mediaType !== 'text' && postData.uploadId && !postData.cloudflareUploadPending) {
            try {
                await cloudflareService.deleteMedia(postData.uploadId, postData.isVideo || false);
            } catch (cloudflareError) {
                console.error('Error deleting from Cloudflare:', cloudflareError);
            }
        }

        await postRef.delete();

        // Invalidate posts cache after deleting post
        await invalidatePostsCache();
        
        // Also invalidate the specific girl's posts cache
        await invalidateGirlCache(postData.girlId);

        return NextResponse.json({
            success: true,
            message: 'Post deleted successfully'
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to delete post' 
        }, { 
            status: 500 
        });
    }
}