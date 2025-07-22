import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import cloudflareService from '@/app/api/v2/services/cloudflareService';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        // Verify authentication
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        // Check if user is admin
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { postId, uploadId } = await req.json();

        if (!postId || !uploadId) {
            return NextResponse.json({ error: 'Missing postId or uploadId' }, { status: 400 });
        }

        // Get the uploaded image info from Cloudflare
        const imageInfo = await cloudflareService.getImageInfo(uploadId);
        
        if (!imageInfo || !imageInfo.success) {
            return NextResponse.json({ error: 'Failed to verify upload' }, { status: 400 });
        }

        // Update the blog post with the featured image URL
        const postRef = adminDb.firestore().collection('blog-posts').doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        const postData = postDoc.data();

        // Update with the Cloudflare image URL
        await postRef.update({
            featuredImage: imageInfo.result.variants[0], // Use the first variant
            cloudflareUploadPending: false,
            uploadId: null,
            updatedAt: adminDb.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            featuredImage: imageInfo.result.variants[0]
        });
    } catch (error) {
        console.error('Error completing blog image upload:', error);
        return NextResponse.json(
            { error: 'Failed to complete upload' },
            { status: 500 }
        );
    }
}