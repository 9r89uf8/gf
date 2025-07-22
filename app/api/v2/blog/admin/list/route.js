import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req) {
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

        // Get all blog posts (including drafts) for admin
        const snapshot = await adminDb.firestore()
            .collection('blog-posts')
            .orderBy('updatedAt', 'desc')
            .get();
        
        const posts = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                ...data,
                publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
                updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
            });
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Error fetching admin blog posts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        );
    }
}