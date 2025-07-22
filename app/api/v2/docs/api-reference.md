# V2 API Reference

## Table of Contents
- [Save Message](#save-message)
- [Get Conversation](#get-conversation)
- [Update Message](#update-message)
- [Error Responses](#error-responses)
- [Rate Limits](#rate-limits)

---

## Save Message

Send a message in a conversation with support for text and media.

### Endpoint
```
POST /api/v2/conversations/save-message
```

### Request

#### Headers
```
Content-Type: multipart/form-data
```

#### Form Data Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier of the user |
| `girlId` | string | Yes | Unique identifier of the AI character |
| `userMessage` | string | Yes | The message content (can be empty for media-only messages) |
| `media` | file | No | Media file (image/audio/video) |
| `mediaType` | string | No | Type of media: 'image', 'audio', or 'video' |
| `userData` | JSON string | Yes | Cached user data object |
| `girlData` | JSON string | Yes | Cached AI character data object |
| `currentLimits` | JSON string | Yes | Current usage limits object |

#### userData Object Structure
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "premium": false,
  "name": "John Doe"
}
```

#### girlData Object Structure
```json
{
  "id": "girl123",
  "name": "Sophia",
  "audioId": "voice_id_123",
  "isPrivate": false,
  "isActive": true
}
```

#### currentLimits Object Structure
```json
{
  "freeMessages": 10,
  "freeImages": 3,
  "freeAudio": 5
}
```

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": {
    "id": "msg_123",
    "role": "user",
    "content": "Hello there!",
    "mediaUrl": null,
    "mediaType": null,
    "liked": false,
    "timestamp": "2024-01-15T10:30:00Z",
    "displayLink": false,
    "audioData": null,
    "status": "completed"
  },
  "assistantMessage": {
    "id": "msg_124",
    "role": "assistant",
    "content": "Hi! How are you doing today?",
    "mediaUrl": null,
    "mediaType": null,
    "liked": false,
    "timestamp": "2024-01-15T10:30:02Z",
    "displayLink": false,
    "audioData": "base64_audio_data...",
    "status": "completed"
  },
  "conversationLimits": {
    "freeMessages": 9,
    "freeImages": 3,
    "freeAudio": 4
  },
  "girlName": "Sophia"
}
```

### Example Requests

#### Text Message
```javascript
const formData = new FormData();
formData.append('userId', 'user123');
formData.append('girlId', 'girl123');
formData.append('userMessage', 'Hello, how are you?');
formData.append('userData', JSON.stringify(userData));
formData.append('girlData', JSON.stringify(girlData));
formData.append('currentLimits', JSON.stringify(limits));

const response = await fetch('/api/v2/conversations/save-message', {
  method: 'POST',
  body: formData
});
```

#### Image Message
```javascript
const formData = new FormData();
formData.append('userId', 'user123');
formData.append('girlId', 'girl123');
formData.append('userMessage', 'Check out this photo!');
formData.append('media', imageFile);
formData.append('mediaType', 'image');
formData.append('userData', JSON.stringify(userData));
formData.append('girlData', JSON.stringify(girlData));
formData.append('currentLimits', JSON.stringify(limits));
```

#### Audio Message
```javascript
const formData = new FormData();
formData.append('userId', 'user123');
formData.append('girlId', 'girl123');
formData.append('userMessage', ''); // Will be transcribed
formData.append('media', audioBlob);
formData.append('mediaType', 'audio');
formData.append('userData', JSON.stringify(userData));
formData.append('girlData', JSON.stringify(girlData));
formData.append('currentLimits', JSON.stringify(limits));
```

---

## Get Conversation

Retrieve conversation history and metadata.

### Endpoint
```
GET /api/v2/conversations/get-conversation
```

### Request

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier of the user |
| `girlId` | string | Yes | Unique identifier of the AI character |

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "conversation": {
    "userId": "user123",
    "girlId": "girl123",
    "lastActivity": "2024-01-15T10:30:02Z",
    "latestMessage": {
      "content": "Hi! How are you doing today?",
      "sender": "assistant",
      "timestamp": "2024-01-15T10:30:02Z"
    },
    "freeAudio": 4,
    "freeImages": 3,
    "freeMessages": 9,
    "messages": [
      {
        "id": "msg_123",
        "role": "user",
        "content": "Hello there!",
        "timestamp": "2024-01-15T10:30:00Z"
      },
      {
        "id": "msg_124",
        "role": "assistant",
        "content": "Hi! How are you doing today?",
        "timestamp": "2024-01-15T10:30:02Z"
      }
    ]
  }
}
```

### Example Request
```javascript
const response = await fetch('/api/v2/conversations/get-conversation?userId=user123&girlId=girl123');
const data = await response.json();
```

---

## Update Message

Update message properties like like/unlike status.

### Endpoint
```
POST /api/v2/conversations/update-message
```

### Request

#### Headers
```
Content-Type: application/json
```

#### Body Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier of the user |
| `girlId` | string | Yes | Unique identifier of the AI character |
| `messageId` | string | Yes | ID of the message to update |
| `action` | string | Yes | Action to perform: 'like' or 'unlike' |

### Response

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Message updated successfully"
}
```

### Example Request
```javascript
const response = await fetch('/api/v2/conversations/update-message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user123',
    girlId: 'girl123',
    messageId: 'msg_124',
    action: 'like'
  })
});
```

---

## Error Responses

All endpoints return consistent error responses:

### Error Response Structure
```json
{
  "error": "Error message description",
  "type": "ERROR_TYPE",
  "details": {} // Optional, only in development
}
```

### Common Error Types

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid request parameters |
| 403 | PERMISSION_ERROR | User lacks required permissions |
| 429 | RATE_LIMIT_ERROR | Rate limit exceeded |
| 500 | AI_GENERATION_ERROR | AI response generation failed |
| 500 | TRANSCRIPTION_ERROR | Audio transcription failed |
| 500 | DATABASE_ERROR | Database operation failed |
| 503 | SERVICE_UNAVAILABLE | External service temporarily down |

### Example Error Responses

#### Validation Error (400)
```json
{
  "error": "Message content is required",
  "type": "VALIDATION_ERROR"
}
```

#### Permission Error (403)
```json
{
  "error": "This character is not available",
  "type": "PERMISSION_ERROR"
}
```

#### Rate Limit Error (429)
```json
{
  "error": "No free messages left. Upgrade to premium for unlimited messaging!",
  "type": "RATE_LIMIT_ERROR"
}
```

---

## Rate Limits

### Default Limits

| User Type | Requests/Minute | Daily Limits |
|-----------|-----------------|--------------|
| Anonymous | 10 | N/A |
| Authenticated | 300 | 10 messages, 3 images, 5 audio |
| Premium | 300 | Unlimited |

### Rate Limit Headers

Responses include rate limit information:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1705319460
```

### Handling Rate Limits

When rate limited, you'll receive a 429 status code:

```json
{
  "error": "Too many requests, please try again later",
  "type": "RATE_LIMIT_ERROR",
  "retryAfter": 60
}
```

## Media Specifications

### Supported Formats

| Media Type | Formats | Max Size |
|------------|---------|----------|
| Image | JPEG, PNG, GIF, WebP | 10MB |
| Audio | MP3, WAV, M4A, WebM | 25MB |
| Video | MP4, WebM, MOV | 100MB |

### Media Processing

- **Images**: Analyzed for content moderation
- **Audio**: Transcribed to text automatically
- **Video**: Flagged as explicit by default

## Best Practices

1. **Cache Data**: Always send cached user and girl data to reduce database reads
2. **Handle Errors**: Implement proper error handling for all response types
3. **Respect Limits**: Monitor usage limits and upgrade prompts
4. **Media Validation**: Validate media files before uploading
5. **Retry Logic**: Implement exponential backoff for 503 errors