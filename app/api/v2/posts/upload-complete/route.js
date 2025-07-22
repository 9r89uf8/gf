import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const data = await req.json();
        const { postId, uploadId, mediaUrl } = data;

        if (!postId || !uploadId || !mediaUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const postsRef = adminDb.firestore().collection('girls-posts');
        const postDoc = await postsRef.doc(postId).get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const postData = postDoc.data();
        
        if (postData.mediaType === 'text') {
            return NextResponse.json({ error: 'Text posts do not require upload completion' }, { status: 400 });
        }
        
        if (postData.uploadId !== uploadId) {
            return NextResponse.json({ error: 'Upload ID mismatch' }, { status: 400 });
        }

        // Ensure we're storing the proper URL format
        let publicUrl = mediaUrl;
        
        // Check if this is a video or image based on the post data
        if (postData.isVideo) {
            // For videos, ensure we have the proper iframe URL format
            if (!mediaUrl.includes('iframe.videodelivery.net')) {
                // Extract video ID and construct proper URL
                const videoId = postData.uploadId;
                publicUrl = `https://iframe.videodelivery.net/${videoId}`;
            } else {
                publicUrl = mediaUrl;
            }
        } else if (!mediaUrl.includes('/public')) {
            // For images, ensure we're using the public variant
            const urlParts = mediaUrl.split('/');
            const imageId = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
            publicUrl = `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_HASH}/${imageId}/public`;
        }

        const updateData = {
            mediaUrl: publicUrl,
            cloudflareUploadPending: false,
            updatedAt: adminDb.firestore.FieldValue.serverTimestamp()
        };

        await postsRef.doc(postId).update(updateData);

        return NextResponse.json({
            success: true,
            postId,
            mediaUrl
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error completing upload:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to complete upload' 
        }, { 
            status: 500 
        });
    }
}