import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
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
        
        // Admin check - only allow admin user
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const data = await req.json();
        const { itemId } = data;

        // Validate required fields
        if (!itemId) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        // Get the gallery item to verify it exists
        const itemRef = adminDb.firestore().collection('girls-gallery').doc(itemId);
        const itemDoc = await itemRef.get();

        if (!itemDoc.exists) {
            return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
        }

        const itemData = itemDoc.data();

        // TODO: In a production environment, you might want to also delete the media from Cloudflare
        // For now, we'll just delete the database record
        
        // Delete the gallery item
        await itemRef.delete();

        // Log the deletion for audit purposes
        console.log(`Gallery item ${itemId} deleted by ${userId}`, {
            girlId: itemData.girlId,
            mediaType: itemData.mediaType,
            isPremium: itemData.isPremium
        });

        return NextResponse.json({
            success: true,
            message: 'Gallery item deleted successfully'
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error deleting gallery item:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to delete gallery item' 
        }, { 
            status: 500 
        });
    }
}