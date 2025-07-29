import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(req) {
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
        const { itemId, text, isPremium, displayToGallery } = data;

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

        const currentData = itemDoc.data();

        // Prepare update data
        const updateData = {
            updatedAt: adminDb.firestore.FieldValue.serverTimestamp()
        };

        // Only update fields that were provided
        if (text !== undefined) {
            updateData.text = text;
        }
        if (isPremium !== undefined) {
            updateData.isPremium = isPremium;
        }
        if (displayToGallery !== undefined) {
            updateData.displayToGallery = displayToGallery;
        }

        // Update the gallery item
        await itemRef.update(updateData);

        // Log the update for audit purposes
        console.log(`Gallery item ${itemId} updated by ${userId}`, {
            girlId: currentData.girlId,
            changes: {
                text: text !== undefined ? `${currentData.text || 'none'} → ${text || 'none'}` : 'unchanged',
                isPremium: isPremium !== undefined ? `${currentData.isPremium} → ${isPremium}` : 'unchanged',
                displayToGallery: displayToGallery !== undefined ? `${currentData.displayToGallery} → ${displayToGallery}` : 'unchanged'
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Gallery item updated successfully',
            updated: updateData
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error updating gallery item:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to update gallery item' 
        }, { 
            status: 500 
        });
    }
}