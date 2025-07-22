# Redis Rate Limiting Implementation Plan for Auth API

## Overview
This document outlines the implementation of Redis-based rate limiting for the NextAI GF authentication API endpoints.

## Objectives
- Prevent brute force attacks on login/register endpoints
- Protect against API abuse
- Maintain good user experience with reasonable limits
- Simple, maintainable implementation

## Implementation Strategy

### 1. Redis Connection
Create a centralized Redis client that can be reused across the application:
- Location: `/app/api/v2/utils/redis.js`
- Singleton pattern to ensure single connection
- Error handling and reconnection logic

### 2. Rate Limiting Middleware
Create a flexible rate limiting middleware:
- Location: `/app/api/v2/middleware/rateLimiter.js`
- Configurable limits per endpoint
- Uses sliding window algorithm
- Returns standard HTTP 429 (Too Many Requests) when limit exceeded

### 3. Rate Limiting Configuration

#### Endpoint Limits

**Authentication Endpoints:**
- **Login**: 5 attempts per IP per minute
- **Register**: 3 attempts per IP per 5 minutes
- **Reset Password**: 3 attempts per IP per 15 minutes
- **Verify**: 20 requests per IP per minute
- **Edit User**: 10 requests per user per minute
- **Delete**: 2 requests per user per hour

**Conversation Endpoints:**
- **Save Message**: 20 messages per user per minute

### 4. Redis Key Structure
- Pattern: `rate:${endpoint}:${identifier}:${timestamp}`
- Examples:
  - `rate:login:ip:192.168.1.1:1703001600` (IP-based)
  - `rate:edit-user:uid:user123:1703001600` (User-based)
  - `rate:conversations:save-message:user123:1703001600` (User-based)

### 5. Implementation Steps

#### Step 1: Redis Client Setup
```javascript
// /app/api/v2/utils/redis.js
import { createClient } from 'redis';

let redisClient = null;

export async function getRedisClient() {
  if (redisClient) return redisClient;
  
  redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    }
  });
  
  redisClient.on('error', err => console.error('Redis Client Error:', err));
  await redisClient.connect();
  
  return redisClient;
}
```

#### Step 2: Rate Limiter Middleware
```javascript
// /app/api/v2/middleware/rateLimiter.js
export async function createRateLimiter(options) {
  const { windowMs, maxRequests, keyPrefix, getKey } = options;
  
  return async (req) => {
    const redis = await getRedisClient();
    const key = `rate:${keyPrefix}:${getKey(req)}:${Math.floor(Date.now() / windowMs)}`;
    
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    
    if (current > maxRequests) {
      return new Response(JSON.stringify({ 
        error: 'Too many requests, please try again later' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return null; // Continue processing
  };
}
```

#### Step 3: Apply to Endpoints
Example for login endpoint:
```javascript
// /app/api/v2/auth/login/route.js
import { createRateLimiter } from '../../middleware/rateLimiter';

const loginRateLimiter = await createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5,
  keyPrefix: 'login',
  getKey: (req) => req.headers.get('x-forwarded-for') || 'unknown'
});

export async function POST(req) {
  const rateLimitResponse = await loginRateLimiter(req);
  if (rateLimitResponse) return rateLimitResponse;
  
  // Continue with existing login logic...
}
```

## Environment Variables
Add to `.env.local`:
```
REDIS_HOST=redis-12036.c270.us-east-1-3.ec2.redns.redis-cloud.com
REDIS_PORT=12036
REDIS_PASSWORD=zj0MCyaQpzN8X9JF5icXDzUEsHiij6zr
```

## Testing Strategy
1. Unit tests for rate limiter logic
2. Integration tests for each endpoint
3. Load testing to verify limits work correctly
4. Error scenario testing (Redis connection failures)

## Monitoring
- Log rate limit hits for security monitoring
- Track Redis connection health
- Alert on unusual patterns

## Fallback Strategy
If Redis connection fails:
- Log the error
- Optionally: Allow requests through (fail open) or block all (fail closed)
- Recommended: Fail open with increased logging for auth endpoints

## Future Enhancements
- Dynamic rate limits based on user tier
- IP whitelist for trusted sources
- Distributed rate limiting across multiple servers
- Rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining)