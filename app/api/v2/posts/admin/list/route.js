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
        
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const girlId = searchParams.get('girlId');
        const limit = parseInt(searchParams.get('limit') || '20');
        const startAfter = searchParams.get('startAfter');

        let query = adminDb.firestore()
            .collection('girls-posts')
            .orderBy('createdAt', 'desc')
            .limit(limit);

        if (girlId) {
            query = query.where('girlId', '==', girlId);
        }

        if (startAfter) {
            const startAfterDoc = await adminDb.firestore()
                .collection('girls-posts')
                .doc(startAfter)
                .get();
            
            if (startAfterDoc.exists) {
                query = query.startAfter(startAfterDoc);
            }
        }

        const snapshot = await query.get();
        const posts = [];

        snapshot.forEach(doc => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.() || data.createdAt
            });
        });

        const hasMore = posts.length === limit;
        const lastPostId = posts.length > 0 ? posts[posts.length - 1].id : null;

        return NextResponse.json({
            posts,
            hasMore,
            lastPostId
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to fetch posts' 
        }, { 
            status: 500 
        });
    }
}