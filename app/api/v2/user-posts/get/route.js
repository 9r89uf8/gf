import { NextResponse } from 'next/server';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { getUserPosts } from '@/app/api/v2/services/postsService';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 20;
        
        const posts = await getUserPosts(userId, limit);
        
        return NextResponse.json({
            success: true,
            posts
        });
        
    } catch (error) {
        console.error('Get user posts error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}