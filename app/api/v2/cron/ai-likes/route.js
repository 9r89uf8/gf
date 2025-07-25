import { NextResponse } from 'next/server';
import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';
import { getRecentUserPosts, addAILike } from '@/app/api/v2/services/postsService';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }



        // Get all AI girls
        const allGirls = await getAllGirlsCached();
        
        // Filter for AI girls that are not private
        const aiGirls = allGirls.filter(girl => !girl.private);
        
        if (aiGirls.length === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No AI girls available for liking' 
            });
        }
        
        // Select a random AI girl
        const randomGirl = aiGirls[Math.floor(Math.random() * aiGirls.length)];
        
        // Get the 20 most recent user posts
        const recentPosts = await getRecentUserPosts(20);
        
        if (recentPosts.length === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No posts available to like' 
            });
        }
        
        // Track results
        let likedCount = 0;
        let alreadyLikedCount = 0;
        const errors = [];
        
        // Like each post with the selected AI girl
        for (const post of recentPosts) {
            try {
                await addAILike(post.id, {
                    girlId: randomGirl.id,
                    name: randomGirl.name,
                    profilePic: randomGirl.profilePic
                });
                likedCount++;
            } catch (error) {
                if (error.message.includes('already liked')) {
                    alreadyLikedCount++;
                } else {
                    errors.push({
                        postId: post.id,
                        error: error.message
                    });
                }
            }
        }
        
        console.log(`[AI Likes Cron] Completed: ${likedCount} new likes, ${alreadyLikedCount} already liked, ${errors.length} errors`);
        console.log(`[AI Likes Cron] AI Girl: ${randomGirl.name} (${randomGirl.id})`);
        
        return NextResponse.json({
            success: true,
            aiGirl: {
                id: randomGirl.id,
                name: randomGirl.name
            },
            stats: {
                totalPosts: recentPosts.length,
                newLikes: likedCount,
                alreadyLiked: alreadyLikedCount,
                errors: errors.length
            },
            errors: errors.length > 0 ? errors : undefined
        });
        
    } catch (error) {
        console.error('[AI Likes Cron] Error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message || 'Failed to process AI likes' 
            },
            { status: 500 }
        );
    }
}