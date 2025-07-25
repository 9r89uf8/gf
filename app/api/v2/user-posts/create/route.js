import { NextResponse } from 'next/server';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { createPost } from '@/app/api/v2/services/postsService';
import { getRateLimiters } from '@/app/api/v2/middleware/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        
        // Apply rate limiting
        const rateLimiters = await getRateLimiters();
        const rateLimitResponse = await rateLimiters.createPost(req, userId);
        if (rateLimitResponse) return rateLimitResponse;
        const formData = await req.formData();
        
        const image = formData.get('image');
        const text = formData.get('text') || '';
        
        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }
        
        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!supportedTypes.includes(image.type)) {
            return NextResponse.json({ 
                error: 'Invalid file type. Only JPEG and PNG images are allowed' 
            }, { status: 400 });
        }
        
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (image.size > maxSize) {
            return NextResponse.json({ 
                error: 'Image size must be less than 10MB' 
            }, { status: 400 });
        }
        
        const post = await createPost(userId, image, text);
        
        return NextResponse.json({
            success: true,
            post
        });
        
    } catch (error) {
        console.error('Create post error:', error);
        
        if (error.message === 'Images containing children are not allowed') {
            return NextResponse.json({ 
                error: error.message 
            }, { status: 400 });
        }
        
        return NextResponse.json(
            { error: error.message || 'Failed to create post' },
            { status: 500 }
        );
    }
}