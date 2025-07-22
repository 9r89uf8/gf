// app/api/posts/route.js
import { getAllPostsCached } from '@/app/api/v2/services/postsServerService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const posts = await getAllPostsCached();

        return new Response(JSON.stringify(posts), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // Allow CDN caching
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}