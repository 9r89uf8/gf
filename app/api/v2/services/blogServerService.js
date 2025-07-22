import { adminDb } from '@/app/utils/firebaseAdmin';
import { redis } from '@/app/api/v2/utils/redis';

const BLOG_CACHE_PREFIX = 'blog:';
const BLOG_LIST_CACHE_KEY = 'blog:posts:list';
const CACHE_TTL = 3600; // 1 hour

// Get blog posts with caching
export async function getBlogPostsForSSR(limit = 9, offset = 0) {
    try {
        // Try to get from cache first
        const cacheKey = `${BLOG_LIST_CACHE_KEY}:${limit}:${offset}`;
        const cached = await redis.get(cacheKey);
        
        if (cached) {
            return JSON.parse(cached);
        }

        // If not in cache, fetch from Firestore
        const query = adminDb.firestore()
            .collection('blog-posts')
            .where('published', '==', true)
            .orderBy('publishedAt', 'desc')
            .limit(limit);

        if (offset > 0) {
            query.offset(offset);
        }

        const snapshot = await query.get();
        
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

        // Cache the results
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(posts));

        return posts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        // Return empty array on error
        return [];
    }
}

// Get single blog post by slug with caching
export async function getBlogPostBySlug(slug) {
    try {
        // Try to get from cache first
        const cacheKey = `${BLOG_CACHE_PREFIX}${slug}`;
        const cached = await redis.get(cacheKey);
        
        if (cached) {
            return JSON.parse(cached);
        }

        // If not in cache, fetch from Firestore
        const snapshot = await adminDb.firestore()
            .collection('blog-posts')
            .where('slug', '==', slug)
            .where('published', '==', true)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        
        const post = {
            id: doc.id,
            ...data,
            publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
            updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        };

        // Cache the result
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(post));

        return post;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// Get all blog slugs for static generation
export async function getAllBlogSlugs() {
    try {
        const snapshot = await adminDb.firestore()
            .collection('blog-posts')
            .where('published', '==', true)
            .select('slug')
            .get();

        const slugs = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.slug) {
                slugs.push(data.slug);
            }
        });

        return slugs;
    } catch (error) {
        console.error('Error fetching blog slugs:', error);
        return [];
    }
}

// Invalidate blog cache
export async function invalidateBlogCache(slug = null) {
    try {
        if (slug) {
            // Invalidate specific post
            await redis.del(`${BLOG_CACHE_PREFIX}${slug}`);
        }
        
        // Always invalidate list caches
        const listKeys = await redis.keys(`${BLOG_LIST_CACHE_KEY}:*`);
        if (listKeys.length > 0) {
            await redis.del(...listKeys);
        }
    } catch (error) {
        console.error('Error invalidating blog cache:', error);
    }
}