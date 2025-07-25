# AI Blog Generation Endpoint

## Overview
This endpoint uses OpenAI to automatically generate blog articles in Spanish for NoviaChat.com.

## Endpoint
`POST /api/v2/blog/admin/ai-generate`

## Authentication
- Requires admin authentication
- Uses JWT token in Authorization header
- Admin UID: `3UaQ4dtkNthHMq9VKqDCGA0uPix2`

## Request Body
```json
{
  "topic": "Optional specific topic for the article",
  "category": "guias", // Optional, defaults to "guias"
  "autoPublish": false  // Optional, if true publishes immediately and posts to Reddit
}
```

## Response
### Success (200)
```json
{
  "success": true,
  "message": "Artículo generado como borrador exitosamente",
  "article": {
    "id": "firebase-document-id",
    "title": "Generated article title",
    "slug": "generated-article-slug",
    "excerpt": "Article excerpt",
    "category": "guias",
    "tags": ["tag1", "tag2"],
    "content": "Full HTML content",
    "published": false,
    "publishedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "viewCount": 0,
    "readTime": 10,
    "author": {
      "name": "Equipo NoviaChat.com",
      "avatar": "/team-avatar.png"
    }
  },
  "redditUrl": "https://reddit.com/r/noviavirtuales/..." // Only if autoPublish is true
}
```

### Error Responses
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - User is not admin
- `500 Internal Server Error` - OpenAI API error or other server errors

## Usage Example

### Generate Draft Article
```bash
curl -X POST https://www.noviachat.com/api/v2/blog/admin/ai-generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Beneficios de tener una novia virtual para personas tímidas"
  }'
```

### Generate and Auto-Publish with Reddit
```bash
curl -X POST https://www.noviachat.com/api/v2/blog/admin/ai-generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Cómo la IA está revolucionando las relaciones virtuales",
    "category": "tecnologia",
    "autoPublish": true
  }'
```

## Features
- Automatically generates 2000-3000 word articles
- Avoids duplicate titles by checking existing posts
- SEO optimized content in Spanish
- Proper HTML formatting (h2, h3, lists, links)
- Includes internal links to noviachat.com
- Optional automatic Reddit posting
- Uses GPT-4 for high-quality content

## Environment Variables Required
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 access
- All standard Firebase and Reddit environment variables