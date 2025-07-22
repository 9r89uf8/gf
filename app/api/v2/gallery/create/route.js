import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import cloudflareService from '@/app/api/v2/services/cloudflareService';
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
        
        // Admin check - only allow admin user
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const data = await req.json();
        const { girlId, mediaType, isPremium = false, text = '', displayToGallery = true } = data;

        // Validate required fields
        if (!girlId || !mediaType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate media type
        if (!['image', 'video'].includes(mediaType)) {
            return NextResponse.json({ error: 'Invalid media type. Must be image or video' }, { status: 400 });
        }

        // Get girl data
        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        const girlData = girlDoc.data();

        // Get upload URL from Cloudflare
        const uploadMetadata = {
            girlId,
            girlUsername: girlData.username,
            uploadedBy: userId,
            mediaType,
            isPremium,
            timestamp: new Date().toISOString()
        };

        const uploadResult = await cloudflareService.getDirectUploadUrl(uploadMetadata, mediaType);
        const uploadURL = uploadResult.uploadURL;
        const uploadId = uploadResult.id;
        const isVideo = uploadResult.isVideo || false;

        // Create gallery item record
        const galleryItem = {
            girlId,
            girlUsername: girlData.username,
            girlPictureUrl: girlData.pictureUrl,
            mediaType,
            mediaUrl: '', // Will be updated after upload
            uploadId,
            isVideo,
            isPremium,
            text: text || '', // Overlay text for the media
            displayToGallery, // Whether to show in public gallery
            cloudflareUploadPending: true,
            createdAt: adminDb.firestore.FieldValue.serverTimestamp(),
            createdBy: userId
        };

        // Add to girls-gallery collection
        const itemRef = await adminDb.firestore().collection('girls-gallery').add(galleryItem);

        return NextResponse.json({
            success: true,
            itemId: itemRef.id,
            uploadURL,
            uploadId
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error creating gallery item:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to create gallery item' 
        }, { 
            status: 500 
        });
    }
}