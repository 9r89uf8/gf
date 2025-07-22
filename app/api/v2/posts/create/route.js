import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import cloudflareService from '@/app/api/v2/services/cloudflareService';
import { invalidatePostsCache } from '@/app/api/v2/services/postsServerService';
import { invalidateGirlCache } from '@/app/api/v2/services/girlsServerService';
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
        const { girlId, text, mediaType } = data;

        if (!girlId || !text || !mediaType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['image', 'video', 'text'].includes(mediaType)) {
            return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
        }

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        const girlData = girlDoc.data();

        let uploadURL = null;
        let uploadId = null;
        let isVideo = false;
        let cloudflareUploadPending = false;

        if (mediaType !== 'text') {
            const uploadMetadata = {
                girlId,
                girlUsername: girlData.username,
                uploadedBy: userId,
                mediaType,
                timestamp: new Date().toISOString()
            };

            const uploadResult = await cloudflareService.getDirectUploadUrl(uploadMetadata, mediaType);
            uploadURL = uploadResult.uploadURL;
            uploadId = uploadResult.id;
            isVideo = uploadResult.isVideo || false;
            cloudflareUploadPending = true;
        }

        const postRecord = {
            girlId,
            girlUsername: girlData.username,
            girlPictureUrl: girlData.pictureUrl,
            text,
            mediaType,
            uploadId,
            isVideo,
            cloudflareUploadPending,
            likes: [],
            likesAmount: Math.floor(Math.random() * (30000 - 14000 + 1)) + 14000,
            createdAt: adminDb.firestore.FieldValue.serverTimestamp(),
            createdBy: userId
        };

        const postRef = await adminDb.firestore().collection('girls-posts').add(postRecord);

        // Invalidate posts cache after creating new post
        await invalidatePostsCache();
        
        // Also invalidate the specific girl's posts cache
        await invalidateGirlCache(girlId);

        return NextResponse.json({
            success: true,
            postId: postRef.id,
            uploadURL,
            uploadId
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to create post' 
        }, { 
            status: 500 
        });
    }
}