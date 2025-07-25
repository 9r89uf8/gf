import { NextResponse } from 'next/server';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { deletePost } from '@/app/api/v2/services/postsService';

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');
        
        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }
        
        const result = await deletePost(postId, userId);
        
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('Delete post error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete post' },
            { status: error.message === 'Post not found' ? 404 : 
                     error.message.includes('Unauthorized') ? 403 : 500 }
        );
    }
}