import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export async function GET(req) {
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

        // Fetch girl data from Firestore
        const girlDoc = await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .get();

        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        const girlData = {
            id: girlDoc.id,
            ...girlDoc.data()
        };

        // Convert Firestore timestamps to ISO strings if needed
        if (girlData.createdAt && girlData.createdAt.toDate) {
            girlData.createdAt = girlData.createdAt.toDate().toISOString();
        }

        return NextResponse.json({
            success: true,
            girl: girlData
        });

    } catch (error) {
        console.error('Get girl error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch girl data' },
            { status: 500 }
        );
    }
}