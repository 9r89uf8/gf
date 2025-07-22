import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
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

        // Get girlId from query params
        const { searchParams } = new URL(req.url);
        const girlId = searchParams.get('girlId');

        if (!girlId) {
            return NextResponse.json({ error: 'Girl ID is required' }, { status: 400 });
        }

        // Query gallery items for the specified girl
        const galleryRef = adminDb.firestore().collection('girls-gallery');
        const snapshot = await galleryRef
            .where('girlId', '==', girlId)
            .orderBy('createdAt', 'desc')
            .get();

        const items = [];
        snapshot.forEach((doc) => {
            items.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return NextResponse.json({
            success: true,
            items,
            count: items.length
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error fetching gallery items:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to fetch gallery items' 
        }, { 
            status: 500 
        });
    }
}