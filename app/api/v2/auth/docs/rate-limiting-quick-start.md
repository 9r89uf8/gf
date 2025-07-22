# Rate Limiting Quick Start Guide

## Overview
Rate limiting has been implemented for all authentication endpoints using Redis.

## Environment Setup
Add these to your `.env.local`:
```bash
REDIS_HOST=redis-12036.c270.us-east-1-3.ec2.redns.redis-cloud.com
REDIS_PORT=12036
REDIS_PASSWORD=zj0MCyaQpzN8X9JF5icXDzUEsHiij6zr
```

## Testing
Run the test script:
```bash
node app/api/v2/auth/test-rate-limiting.js
```

## Implementation Files
- **Redis Client**: `/app/api/v2/utils/redis.js`
- **Rate Limiter**: `/app/api/v2/middleware/rateLimiter.js`
- **Test Script**: `/app/api/v2/auth/test-rate-limiting.js`

## Rate Limits
| Endpoint | Limit | Window | Tracking |
|----------|-------|---------|----------|
| Login | 5 attempts | 1 minute | IP |
| Register | 3 attempts | 5 minutes | IP |
| Reset Password | 3 attempts | 15 minutes | IP |
| Verify | 20 requests | 1 minute | IP |
| Edit User | 10 requests | 1 minute | User ID |
| Delete | 2 requests | 1 hour | User ID |

## Response Headers
When rate limited, endpoints return:
- Status: `429 Too Many Requests`
- Headers: `Retry-After`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`