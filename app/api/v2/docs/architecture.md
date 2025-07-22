# V2 API Architecture Guide

## Overview

The V2 API follows a layered architecture pattern that separates concerns and promotes maintainability, testability, and scalability.

## Architecture Layers

```
┌─────────────────────────────────────────┐
│          API Routes Layer               │
│   (HTTP handlers, request/response)     │
├─────────────────────────────────────────┤
│         Services Layer                  │
│    (Business logic, orchestration)      │
├─────────────────────────────────────────┤
│          Utils Layer                    │
│   (Helpers, validators, processors)     │
├─────────────────────────────────────────┤
│        External Services                │
│  (Firebase, AWS, OpenAI, ElevenLabs)    │
└─────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. API Routes Layer (`/conversations/*`)

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:
- Parse incoming requests (FormData, JSON)
- Validate request structure
- Call appropriate services
- Format and return responses
- Apply middleware (rate limiting, auth)

**Example**:
```javascript
// route.js
async function handler(req) {
  const data = await req.formData();
  const result = await conversationService.processMessage(data);
  return new Response(JSON.stringify(result));
}
```

### 2. Services Layer (`/services/*`)

**Purpose**: Implement business logic and orchestrate operations

**Responsibilities**:
- Implement core business rules
- Orchestrate multiple operations
- Manage transactions
- Handle complex workflows

**Key Services**:

#### ConversationService
- Creates and manages conversations
- Handles message persistence
- Manages usage limits
- Ensures data consistency

#### AIResponseService
- Orchestrates AI response generation
- Manages media enrichment
- Handles response formatting
- Implements retry logic

### 3. Utils Layer (`/utils/*`)

**Purpose**: Provide reusable utility functions

**Responsibilities**:
- Input validation
- Data transformation
- External service integration
- Common operations

**Key Utilities**:

#### messageValidation.js
```javascript
- validateUserPermissions()
- validateMessageContent()
- validateFile()
- sanitizeMessageContent()
```

#### mediaProcessing.js
```javascript
- parseMessageContent()
- generateAudio()
- getMediaContent()
- processImageWithRekognition()
```

#### messageHandlers.js
```javascript
- handleAudioTranscription()
- handleMediaUpload()
- createUserMessage()
- createAssistantMessage()
```

#### errorHandler.js
```javascript
- APIError class
- createErrorResponse()
- withErrorHandler()
- withRetry()
```

## Data Flow Architecture

### 1. Request Flow
```
Client Request
    ↓
Rate Limiter
    ↓
Route Handler
    ↓
Input Validation
    ↓
Service Layer
    ↓
Business Logic
    ↓
External Services
    ↓
Response Formation
    ↓
Client Response
```

### 2. Transaction Management

The system uses Firebase transactions to ensure data consistency:

```javascript
// Transaction 1: User Message
- Validate conversation state
- Save user message
- Update usage limits
- Set message status

// Transaction 2: AI Response
- Save assistant message
- Update user message status
- Update media limits
- Update conversation metadata
```

### 3. Error Handling Strategy

```
Try Operation
    ↓
Catch Error → Classify Error Type
                ↓
              Log Error
                ↓
              Retry (if applicable)
                ↓
              Return Structured Error
```

## Security Architecture

### 1. Input Validation
- All inputs validated at entry point
- Type checking and sanitization
- File validation for media uploads

### 2. Permission System
```javascript
User Permissions Check:
- Is user authenticated?
- Is user premium?
- Does user have access to character?
- Are usage limits exceeded?
```

### 3. Rate Limiting
```javascript
Rate Limit Tiers:
- Anonymous: 10 req/min
- Authenticated: 300 req/min
- Premium: 300 req/min (no usage limits)
```

### 4. Content Moderation
- AWS Rekognition for image analysis
- Automatic flagging of explicit content
- Content sanitization before storage

## External Service Integration

### 1. Firebase (Database & Storage)
```
Firebase Admin SDK
    ├── Firestore (conversations, messages)
    └── Storage (media files)
```

### 2. AWS Services
```
AWS SDK
    └── Rekognition
        ├── DetectModerationLabels
        └── DetectLabels
```

### 3. OpenAI
```
OpenAI SDK
    └── Audio
        └── Transcriptions (Whisper)
```

### 4. ElevenLabs
```
ElevenLabs API
    └── Text-to-Speech
        └── Voice Generation
```

## Performance Considerations

### 1. Caching Strategy
- Frontend caches user and character data
- Reduces database reads per request
- Cache invalidation on updates

### 2. Async Operations
- Media processing runs asynchronously
- External API calls use Promise.all when possible
- Timeout handling for long operations

### 3. Database Optimization
- Compound indexes on frequently queried fields
- Limit query results where applicable
- Use transactions for atomic operations

## Scalability Design

### 1. Horizontal Scaling
- Stateless API design
- No server-side sessions
- Can scale to multiple instances

### 2. Service Isolation
- Each service can be extracted to microservice
- Clear interfaces between layers
- Minimal coupling between components

### 3. Queue-Ready Architecture
- Long operations can be moved to queues
- Media processing can be made async
- AI generation can be offloaded

## Monitoring Points

### 1. Performance Metrics
```javascript
- Request duration
- Database query time
- External API latency
- Error rates by type
```

### 2. Business Metrics
```javascript
- Messages per user
- Media usage by type
- AI response success rate
- Usage limit hits
```

### 3. System Health
```javascript
- Memory usage
- CPU utilization
- External service availability
- Database connection pool
```

## Design Patterns Used

### 1. **Repository Pattern**
Services abstract database operations

### 2. **Factory Pattern**
Message creation functions

### 3. **Strategy Pattern**
Different media processing strategies

### 4. **Middleware Pattern**
Rate limiting and auth checks

### 5. **Transaction Script**
Business logic in service methods

## Future Architecture Considerations

### 1. Event-Driven Architecture
- Emit events for message creation
- Allow plugins to listen to events
- Enable real-time features

### 2. Caching Layer
- Redis for frequently accessed data
- Response caching for common queries
- Session management

### 3. Message Queue
- Process media asynchronously
- Queue AI responses during high load
- Implement retry mechanisms

### 4. GraphQL Layer
- Flexible data fetching
- Reduce over-fetching
- Better mobile support