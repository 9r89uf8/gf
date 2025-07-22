import { adminDb } from '@/app/utils/firebaseAdmin';
import { getRedisClient } from '@/app/api/v2/utils/redis';

const CACHE_TTL = 5 * 60 * 60; // 5 hours in seconds
const ALL_GIRLS_CACHE_KEY = 'girls:all';
const GIRL_CACHE_PREFIX = 'girl:';
const GIRL_POSTS_CACHE_PREFIX = 'girl:posts:';

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
 * Get all girls with Redis caching
 * @returns {Promise<Array>} Array of girls
 */
export async function getAllGirlsCached() {
    try {
        // Try to get from Redis cache first
        try {
            const redis = await getRedisClient();
            const cachedData = await redis.get(ALL_GIRLS_CACHE_KEY);
            if (cachedData) {
                console.log('[GirlsService] Cache hit for all girls');
                return JSON.parse(cachedData);
            }
        } catch (redisError) {
            console.error('[GirlsService] Redis error, falling back to Firestore:', redisError);
        }

        // Cache miss or Redis error - fetch from Firestore
        console.log('[GirlsService] Cache miss, fetching girls from Firestore');
        const girlsSnapshot = await adminDb.firestore()
            .collection('girls')
            .orderBy('priority', 'desc')
            .get();

        const girls = [];
        girlsSnapshot.forEach(doc => {
            try {
                const data = doc.data();
                const serializedData = {
                    id: doc.id,
                    ...serializeFirestoreData(data)
                };
                girls.push(serializedData);
            } catch (error) {
                console.error(`[GirlsService] Error serializing girl ${doc.id}:`, error);
            }
        });

        // Try to cache the result
        if (girls.length > 0) {
            try {
                const redis = await getRedisClient();
                await redis.setEx(ALL_GIRLS_CACHE_KEY, CACHE_TTL, JSON.stringify(girls));
                console.log(`[GirlsService] Cached ${girls.length} girls for ${CACHE_TTL} seconds`);
            } catch (redisError) {
                console.error('[GirlsService] Failed to cache girls:', redisError);
            }
        }

        return girls;
    } catch (error) {
        console.error('[GirlsService] Error fetching girls:', error);
        throw error;
    }
}

/**
 * Get a specific girl by ID with Redis caching
 * @param {string} girlId - The girl's ID
 * @returns {Promise<Object|null>} Girl data or null
 */
export async function getGirlByIdCached(girlId) {
    const cacheKey = `${GIRL_CACHE_PREFIX}${girlId}`;
    
    try {
        // Try to get from Redis cache first
        try {
            const redis = await getRedisClient();
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                console.log(`[GirlsService] Cache hit for girl ${girlId}`);
                return JSON.parse(cachedData);
            }
        } catch (redisError) {
            console.error('[GirlsService] Redis error, falling back to Firestore:', redisError);
        }

        // Cache miss or Redis error - fetch from Firestore
        console.log(`[GirlsService] Cache miss, fetching girl ${girlId} from Firestore`);
        const girlDoc = await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .get();

        if (!girlDoc.exists) {
            return null;
        }

        const girlData = {
            id: girlDoc.id,
            ...serializeFirestoreData(girlDoc.data())
        };

        // Try to cache the result
        try {
            const redis = await getRedisClient();
            await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(girlData));
            console.log(`[GirlsService] Cached girl ${girlId} for ${CACHE_TTL} seconds`);
        } catch (redisError) {
            console.error('[GirlsService] Failed to cache girl:', redisError);
        }

        return girlData;
    } catch (error) {
        console.error(`[GirlsService] Error fetching girl ${girlId}:`, error);
        throw error;
    }
}

/**
 * Get posts for a specific girl with Redis caching
 * @param {string} girlId - The girl's ID
 * @returns {Promise<Array>} Array of posts
 */
export async function getGirlPostsCached(girlId) {
    const cacheKey = `${GIRL_POSTS_CACHE_PREFIX}${girlId}`;
    
    try {
        // Try to get from Redis cache first
        try {
            const redis = await getRedisClient();
            const cachedData = await redis.get(cacheKey);
            if (cachedData) {
                console.log(`[GirlsService] Cache hit for girl posts ${girlId}`);
                return JSON.parse(cachedData);
            }
        } catch (redisError) {
            console.error('[GirlsService] Redis error, falling back to Firestore:', redisError);
        }

        // Cache miss or Redis error - fetch from Firestore
        console.log(`[GirlsService] Cache miss, fetching posts for girl ${girlId} from Firestore`);
        const postsSnapshot = await adminDb.firestore()
            .collection('girls-posts')
            .where('girlId', '==', girlId)
            .orderBy('createdAt', 'desc')
            .get();

        const posts = [];
        postsSnapshot.forEach(doc => {
            try {
                const data = doc.data();
                const serializedData = {
                    id: doc.id,
                    ...serializeFirestoreData(data)
                };
                posts.push(serializedData);
            } catch (error) {
                console.error(`[GirlsService] Error serializing post ${doc.id}:`, error);
            }
        });

        // Try to cache the result
        try {
            const redis = await getRedisClient();
            await redis.setEx(cacheKey, CACHE_TTL, JSON.stringify(posts));
            console.log(`[GirlsService] Cached ${posts.length} posts for girl ${girlId}`);
        } catch (redisError) {
            console.error('[GirlsService] Failed to cache girl posts:', redisError);
        }

        return posts;
    } catch (error) {
        console.error(`[GirlsService] Error fetching posts for girl ${girlId}:`, error);
        throw error;
    }
}

/**
 * Invalidate all girls-related caches
 * @returns {Promise<void>}
 */
export async function invalidateGirlsCache() {
    try {
        const redis = await getRedisClient();
        
        // Delete all girls cache
        await redis.del(ALL_GIRLS_CACHE_KEY);
        
        // Delete individual girl caches (pattern matching)
        const girlKeys = await redis.keys(`${GIRL_CACHE_PREFIX}*`);
        if (girlKeys.length > 0) {
            await redis.del(...girlKeys);
        }
        
        // Delete girl posts caches
        const postKeys = await redis.keys(`${GIRL_POSTS_CACHE_PREFIX}*`);
        if (postKeys.length > 0) {
            await redis.del(...postKeys);
        }
        
        console.log('[GirlsService] All girls caches invalidated');
    } catch (error) {
        console.error('[GirlsService] Error invalidating caches:', error);
    }
}

/**
 * Invalidate cache for a specific girl
 * @param {string} girlId - The girl's ID
 * @returns {Promise<void>}
 */
export async function invalidateGirlCache(girlId) {
    try {
        const redis = await getRedisClient();
        
        // Delete all girls cache (since one girl changed)
        await redis.del(ALL_GIRLS_CACHE_KEY);
        
        // Delete specific girl cache
        await redis.del(`${GIRL_CACHE_PREFIX}${girlId}`);
        
        // Delete girl's posts cache
        await redis.del(`${GIRL_POSTS_CACHE_PREFIX}${girlId}`);
        
        console.log(`[GirlsService] Cache invalidated for girl ${girlId}`);
    } catch (error) {
        console.error('[GirlsService] Error invalidating girl cache:', error);
    }
}

/**
 * Get girl data for server-side rendering with posts
 * @param {string} girlId - The girl's ID
 * @returns {Promise<Object>} Girl data with posts
 */
export async function getGirlDataForSSR(girlId) {
    const girl = await getGirlByIdCached(girlId);
    
    if (!girl) {
        return null;
    }
    
    // Get the girl's posts
    const posts = await getGirlPostsCached(girlId);
    
    // Combine girl data with posts
    const girlWithPosts = {
        ...girl,
        posts: posts || []
    };
    
    // Final serialization to ensure data is safe for client components
    return JSON.parse(JSON.stringify(girlWithPosts));
}