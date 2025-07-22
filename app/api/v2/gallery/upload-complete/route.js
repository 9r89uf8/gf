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
        
        // Admin check - only allow admin user
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const data = await req.json();
        const { itemId, uploadId, mediaUrl } = data;

        // Validate required fields
        if (!itemId || !uploadId || !mediaUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get the gallery item
        const itemRef = adminDb.firestore().collection('girls-gallery').doc(itemId);
        const itemDoc = await itemRef.get();

        if (!itemDoc.exists) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        const itemData = itemDoc.data();

        // Verify the upload ID matches
        if (itemData.uploadId !== uploadId) {
            return NextResponse.json({ error: 'Upload ID mismatch' }, { status: 400 });
        }

        // Update the gallery item with the final media URL
        await itemRef.update({
            mediaUrl,
            cloudflareUploadPending: false,
            updatedAt: adminDb.firestore.FieldValue.serverTimestamp()
        });

        return NextResponse.json({
            success: true,
            message: 'Gallery item updated successfully'
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error completing gallery upload:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to complete gallery upload' 
        }, { 
            status: 500 
        });
    }
}