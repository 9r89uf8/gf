import { NextResponse } from 'next/server';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { addAILike } from '@/app/api/v2/services/postsService';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        
        // Only admin can trigger AI likes for now
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const data = await req.json();
        const { postId, girlId, girlName, girlProfilePic } = data;
        
        if (!postId || !girlId || !girlName || !girlProfilePic) {
            return NextResponse.json({ 
                error: 'Missing required fields: postId, girlId, girlName, girlProfilePic' 
            }, { status: 400 });
        }
        
        const result = await addAILike(postId, {
            girlId,
            name: girlName,
            profilePic: girlProfilePic
        });
        
        return NextResponse.json(result);
        
    } catch (error) {
        console.error('AI like error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to add AI like' },
            { status: error.message === 'Post not found' ? 404 : 
                     error.message.includes('already liked') ? 409 : 500 }
        );
    }
}