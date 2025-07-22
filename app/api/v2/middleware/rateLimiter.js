import { getRedisClient } from '../utils/redis.js';

export async function createRateLimiter(options) {
  const { 
    windowMs = 60000, // 1 minute default
    maxRequests = 10, 
    keyPrefix, 
    getKey,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;
  
  return async function rateLimiter(req) {
    try {
      const redis = await getRedisClient();
      const identifier = getKey(req);
      
      if (!identifier || identifier === '') {
        console.warn('Rate limiter: Unable to determine identifier, using fallback');
        const fallbackIdentifier = 'fallback-' + Math.random().toString(36).substring(7);
        const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
        const key = `rate:${keyPrefix}:${fallbackIdentifier}:${windowStart}`;
        console.log('Rate limiter key (fallback):', key);
        return null; // Allow request if we can't identify it properly
      }
      
      const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
      const key = `rate:${keyPrefix}:${identifier}:${windowStart}`;
      
      
      // Get current count
      const current = await redis.incr(key);
      
      // Set expiry on first request in the window
      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }
      
      // Check if limit exceeded
      if (current > maxRequests) {
        const retryAfter = Math.ceil((windowStart + windowMs - Date.now()) / 1000);
        
        return new Response(JSON.stringify({ 
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          retryAfter
        }), {
          status: 429,
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(windowStart + windowMs).toISOString()
          }
        });
      }
      
      // Add rate limit headers to successful responses
      req.rateLimitInfo = {
        limit: maxRequests,
        remaining: Math.max(0, maxRequests - current),
        reset: new Date(windowStart + windowMs).toISOString()
      };
      
      return null; // Allow request to continue
      
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow request if Redis is down
      return null;
    }
  };
}

// Helper function to get IP address from request
export function getIpAddress(req) {
  try {
    
    // Try different header variations
    const forwardedFor = req.headers.get('x-forwarded-for') || 
                        req.headers.get('X-Forwarded-For');
    if (forwardedFor) {
      const ip = forwardedFor.split(',')[0].trim();
      // Handle IPv6 localhost
      if (ip === '::1') {
        return '127.0.0.1';
      }
      if (ip) {
        return ip;
      }
    }
    
    const realIp = req.headers.get('x-real-ip') || 
                   req.headers.get('X-Real-IP');
    if (realIp) {
      if (realIp === '::1') {
        return '127.0.0.1';
      }
      return realIp;
    }
    
    // Try CF-Connecting-IP for Cloudflare
    const cfIp = req.headers.get('cf-connecting-ip') || 
                 req.headers.get('CF-Connecting-IP');
    if (cfIp) {
      if (cfIp === '::1') {
        return '127.0.0.1';
      }
      return cfIp;
    }
    
    // Next.js specific: check x-forwarded-host
    const forwardedHost = req.headers.get('x-forwarded-host');
    if (forwardedHost && forwardedHost.includes('localhost')) {
      return '127.0.0.1';
    }
    
    // For localhost/development
    const host = req.headers.get('host');
    if (host && (host.includes('localhost') || host.includes('127.0.0.1'))) {
      return '127.0.0.1';
    }
    
    // Get connection info from the request URL
    const url = new URL(req.url);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1') {
      return '127.0.0.1';
    }
  } catch (error) {
    console.error('Error getting IP address:', error);
  }
  
  // Always return a valid identifier
  return '127.0.0.1';
}

// Create a rate limiter for authenticated endpoints
export function createAuthenticatedRateLimiter(options) {
  const limiter = createRateLimiter({
    ...options,
    getKey: (req) => req.userId || 'unknown'
  });
  
  return async function(req, userId) {
    // Attach userId to request for rate limiting
    req.userId = userId;
    return limiter(req);
  };
}

// Pre-configured rate limiters for common use cases
// Initialize on first use to avoid top-level await
let rateLimitersCache = null;

export async function getRateLimiters() {
  if (rateLimitersCache) return rateLimitersCache;
  
  rateLimitersCache = {
    login: await createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5,
      keyPrefix: 'auth:login',
      getKey: getIpAddress
    }),
    
    register: await createRateLimiter({
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxRequests: 3,
      keyPrefix: 'auth:register',
      getKey: getIpAddress
    }),
    
    resetPassword: await createRateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3,
      keyPrefix: 'auth:reset-password',
      getKey: getIpAddress
    }),
    
    verify: await createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20,
      keyPrefix: 'auth:verify',
      getKey: getIpAddress
    }),
    
    editUser: await createAuthenticatedRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
      keyPrefix: 'auth:edit-user'
    }),
    
    deleteUser: await createAuthenticatedRateLimiter({
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 2,
      keyPrefix: 'auth:delete'
    }),
    
    // Conversation rate limiters
    saveMessage: await createRateLimiter({
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20, // 20 messages per minute
      keyPrefix: 'conversations:save-message',
      getKey: (req) => req.userId || 'unknown'
    })
  };
  
  return rateLimitersCache;
}

// Export for backward compatibility with auth endpoints
export async function getAuthRateLimiters() {
  const limiters = await getRateLimiters();
  return {
    login: limiters.login,
    register: limiters.register,
    resetPassword: limiters.resetPassword,
    verify: limiters.verify,
    editUser: limiters.editUser,
    deleteUser: limiters.deleteUser
  };
}
