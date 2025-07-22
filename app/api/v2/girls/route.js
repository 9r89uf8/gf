import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const girls = await getAllGirlsCached();

        return new Response(JSON.stringify(girls), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' // Allow CDN caching
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}