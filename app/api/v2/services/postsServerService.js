import { adminDb } from '@/app/utils/firebaseAdmin';
import { getRedisClient } from '@/app/api/v2/utils/redis';

const CACHE_KEY = 'posts:all';
const CACHE_TTL = 5 * 60 * 60; // 5 hours in seconds

/**
 * Serialize Firestore document data to ensure it's safe for client components
 * @param {Object} data - Raw Firestore document data
 * @returns {Object} Serialized data
 */
function serializeFirestoreData(data) {
    const serialized = {};
    
    for (const key in data) {
        const value = data[key];
        
        if (value === null || value === undefined) {
            serialized[key] = null;
        } else if (value?.toDate && typeof value.toDate === 'function') {
            // Handle Firestore Timestamp
            serialized[key] = value.toDate().toISOString();
        } else if (value?._firestore) {
            // Handle Firestore references
            serialized[key] = value.id || null;
        } else if (Array.isArray(value)) {
            // Handle arrays recursively
            serialized[key] = value.map(item => {
                if (typeof item === 'object' && item !== null) {
                    return serializeFirestoreData(item);
                }
                return item;
            });
        } else if (typeof value === 'object' && value !== null && value.constructor === Object) {
            // Handle nested objects recursively
            serialized[key] = serializeFirestoreData(value);
        } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            // Primitive types are safe
            serialized[key] = value;
        } else {
            // Convert any other types to string
            serialized[key] = String(value);
        }
    }
    
    return serialized;
}

/**
 * Get all posts with Redis caching
 * @returns {Promise<Array>} Array of posts
 */
export async function getAllPostsCached() {
    try {
        // Try to get from Redis cache first
        try {
            const redis = await getRedisClient();
            const cachedData = await redis.get(CACHE_KEY);
            if (cachedData) {
                console.log('[PostsService] Cache hit for posts');
                return JSON.parse(cachedData);
            }
        } catch (redisError) {
            console.error('[PostsService] Redis error, falling back to Firestore:', redisError);
        }

        // Cache miss or Redis error - fetch from Firestore
        console.log('[PostsService] Cache miss, fetching from Firestore');
        const postsCollection = await adminDb
            .firestore()
            .collection('girls-posts')
            .orderBy('createdAt', 'desc')
            .get();

        const posts = [];
        postsCollection.forEach(doc => {
            try {
                const data = doc.data();
                // Serialize all data to ensure it's safe for client components
                const serializedData = {
                    id: doc.id,
                    ...serializeFirestoreData(data)
                };
                posts.push(serializedData);
            } catch (error) {
                console.error(`[PostsService] Error serializing post ${doc.id}:`, error);
                console.error('[PostsService] Problematic data:', doc.data());
            }
        });

        // Try to cache the result
        if (posts.length > 0) {
            try {
                const redis = await getRedisClient();
                await redis.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(posts));
                console.log(`[PostsService] Cached ${posts.length} posts for ${CACHE_TTL} seconds`);
            } catch (redisError) {
                console.error('[PostsService] Failed to cache posts:', redisError);
                // Continue anyway - caching is not critical
            }
        }

        return posts;
    } catch (error) {
        console.error('[PostsService] Error fetching posts:', error);
        throw error;
    }
}

/**
 * Invalidate posts cache
 * @returns {Promise<boolean>} Success status
 */
export async function invalidatePostsCache() {
    try {
        const redis = await getRedisClient();
        await redis.del(CACHE_KEY);
        console.log('[PostsService] Posts cache invalidated');
        return true;
    } catch (error) {
        console.error('[PostsService] Error invalidating cache:', error);
        // Don't throw - cache invalidation failure shouldn't break the operation
        return false;
    }
}

/**
 * Get posts for server-side rendering with pagination
 * @param {number} limit - Number of posts to fetch
 * @param {number} offset - Number of posts to skip
 * @returns {Promise<Array>} Array of posts
 */
export async function getPostsForSSR(limit = 15, offset = 0) {
    const allPosts = await getAllPostsCached();
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    
    // Final serialization to ensure data is safe for client components
    // This removes any remaining non-serializable objects
    return JSON.parse(JSON.stringify(paginatedPosts));
}