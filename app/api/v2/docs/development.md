# V2 API Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase Admin SDK credentials
- AWS credentials (for Rekognition)
- OpenAI API key
- ElevenLabs API key

### Environment Setup
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your credentials to .env.local
```

### Required Environment Variables
```env
# Firebase Admin
FIREBASE_ADMIN_SDK={"type":"service_account",...}

# AWS
STHREE=your_aws_access_key
STHREESEC=your_aws_secret_key

# OpenAI
OPENAI_API_KEY=sk-...

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_key

# Optional
NODE_ENV=development
```

## Development Workflow

### 1. Adding a New Feature

#### Step 1: Plan the Architecture
```
1. Identify which layer(s) need modification
2. Design the data flow
3. Consider error scenarios
4. Plan the API interface
```

#### Step 2: Implement Utils (if needed)
```javascript
// app/api/v2/utils/newFeature.js
export function processNewFeature(data) {
  // Validate input
  if (!data.requiredField) {
    throw new APIError('Required field missing', ErrorTypes.VALIDATION_ERROR, 400);
  }
  
  // Process data
  return transformedData;
}
```

#### Step 3: Implement Service Logic
```javascript
// app/api/v2/services/newFeatureService.js
import { processNewFeature } from '../utils/newFeature';

export async function handleNewFeature(userData, featureData) {
  // Business logic
  const processed = processNewFeature(featureData);
  
  // Database operations
  const result = await saveToDatabase(processed);
  
  return result;
}
```

#### Step 4: Create/Update Route Handler
```javascript
// app/api/v2/new-feature/route.js
import { withAuthRateLimit } from '@/app/utils/withAuthRateLimit';
import { handleNewFeature } from '../services/newFeatureService';

async function handler(req) {
  try {
    const data = await req.json();
    const result = await handleNewFeature(data);
    
    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export const POST = withAuthRateLimit(handler);
```

### 2. Testing

#### Unit Testing
```javascript
// __tests__/utils/mediaProcessing.test.js
import { parseMessageContent } from '@/app/api/v2/utils/mediaProcessing';

describe('parseMessageContent', () => {
  it('should parse image tags correctly', () => {
    const input = '[IMAGE: sunset] Beautiful evening';
    const result = parseMessageContent(input);
    
    expect(result).toEqual({
      type: 'image',
      content: 'Beautiful evening',
      description: 'sunset'
    });
  });
});
```

#### Integration Testing
```javascript
// __tests__/api/save-message.test.js
import { POST } from '@/app/api/v2/conversations/save-message/route';

describe('Save Message API', () => {
  it('should save a text message successfully', async () => {
    const formData = createMockFormData({
      userId: 'test123',
      girlId: 'girl123',
      userMessage: 'Hello'
    });
    
    const request = new Request('http://localhost/api/v2/conversations/save-message', {
      method: 'POST',
      body: formData
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
```

#### Manual Testing with cURL
```bash
# Test text message
curl -X POST http://localhost:3000/api/v2/conversations/save-message \
  -F "userId=test123" \
  -F "girlId=girl123" \
  -F "userMessage=Hello there" \
  -F 'userData={"uid":"test123","premium":false}' \
  -F 'girlData={"id":"girl123","name":"Sophia"}' \
  -F 'currentLimits={"freeMessages":10}'

# Test with image
curl -X POST http://localhost:3000/api/v2/conversations/save-message \
  -F "userId=test123" \
  -F "girlId=girl123" \
  -F "userMessage=Check this out" \
  -F "media=@/path/to/image.jpg" \
  -F "mediaType=image" \
  -F 'userData={"uid":"test123","premium":false}' \
  -F 'girlData={"id":"girl123","name":"Sophia"}' \
  -F 'currentLimits={"freeMessages":10,"freeImages":3}'
```

### 3. Error Handling

#### Using the Error Handler
```javascript
import { APIError, ErrorTypes, withErrorHandler } from '../utils/errorHandler';

// Throw custom errors
if (!isValid) {
  throw new APIError(
    'Invalid input provided',
    ErrorTypes.VALIDATION_ERROR,
    400,
    { field: 'userMessage', reason: 'Too long' }
  );
}

// Wrap handlers for automatic error handling
export const POST = withErrorHandler(async (req) => {
  // Your handler code
});
```

#### Error Types Reference
```javascript
ErrorTypes = {
  VALIDATION_ERROR: 400,      // Bad request
  PERMISSION_ERROR: 403,      // Forbidden
  RATE_LIMIT_ERROR: 429,      // Too many requests
  TRANSCRIPTION_ERROR: 500,   // Audio processing failed
  AI_GENERATION_ERROR: 500,   // LLM failed
  DATABASE_ERROR: 500,        // DB operation failed
  MEDIA_PROCESSING_ERROR: 500 // Media handling failed
}
```

### 4. Database Operations

#### Using Transactions
```javascript
const db = adminDb.firestore();

await db.runTransaction(async (transaction) => {
  // Read operations first
  const doc = await transaction.get(docRef);
  
  // Then writes
  transaction.update(docRef, { field: 'value' });
  transaction.set(newDocRef, { data: 'here' });
});
```

#### Query Patterns
```javascript
// Efficient querying
const messages = await db
  .collection('conversations')
  .doc(conversationId)
  .get();

// Avoid N+1 queries
const batch = db.batch();
updates.forEach(update => {
  batch.update(docRef, update);
});
await batch.commit();
```

### 5. Media Handling

#### Processing Images
```javascript
import { processImageWithRekognition } from '../utils/mediaProcessing';

const result = await processImageWithRekognition(imageBuffer, rekognitionClient);
if (result.isExplicit) {
  // Handle explicit content
}
```

#### Generating Audio
```javascript
import { generateAudio } from '../utils/mediaProcessing';

const audioBase64 = await generateAudio(text, voiceId);
if (audioBase64) {
  // Audio generated successfully
}
```

## Best Practices

### 1. Code Organization
- Keep functions small and focused
- Use descriptive names
- Group related functionality
- Export only what's needed

### 2. Error Handling
- Always use try-catch in async functions
- Throw meaningful errors with proper types
- Log errors with context
- Return user-friendly error messages

### 3. Performance
- Use Promise.all for parallel operations
- Implement timeouts for external calls
- Cache frequently accessed data
- Optimize database queries

### 4. Security
- Validate all inputs
- Sanitize user content
- Never log sensitive data
- Use environment variables for secrets

### 5. Documentation
- Add JSDoc comments to exported functions
- Update API documentation when adding endpoints
- Include examples in comments
- Document error scenarios

## Common Patterns

### 1. External API Call with Retry
```javascript
import { withRetry } from '../utils/errorHandler';

const result = await withRetry(
  async () => {
    const response = await fetch(apiUrl, options);
    if (!response.ok) throw new Error('API call failed');
    return response.json();
  },
  3, // max retries
  1000 // initial delay
);
```

### 2. Conditional Media Processing
```javascript
let enrichedResponse = responseData;

if (shouldAddMedia && hasCredits) {
  enrichedResponse = await enrichResponseWithMedia(
    responseData,
    mediaType,
    userData,
    limits
  );
}
```

### 3. Transaction with Rollback
```javascript
let oldData;
try {
  oldData = await saveCurrentState();
  await performRiskyOperation();
} catch (error) {
  if (oldData) await restoreState(oldData);
  throw error;
}
```

## Debugging Tips

### 1. Enable Verbose Logging
```javascript
if (process.env.NODE_ENV === 'development') {
  console.log('Request data:', JSON.stringify(data, null, 2));
}
```

### 2. Use Debug Endpoints
```javascript
// app/api/v2/debug/route.js (development only)
export async function GET() {
  const stats = await gatherSystemStats();
  return new Response(JSON.stringify(stats, null, 2));
}
```

### 3. Test External Services
```javascript
// Test connectivity
try {
  await rekognitionClient.send(new ListCollectionsCommand({}));
  console.log('✓ AWS Rekognition connected');
} catch (error) {
  console.error('✗ AWS Rekognition error:', error);
}
```

## Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] Error handling tested
- [ ] Rate limits configured
- [ ] Monitoring enabled
- [ ] Documentation updated
- [ ] Security review completed
- [ ] Performance tested

## Troubleshooting

### Common Issues

#### 1. "Failed to generate AI response"
- Check LLM API keys
- Verify prompt format
- Check rate limits
- Review error logs

#### 2. "Database operation failed"
- Check Firebase credentials
- Verify network connectivity
- Check transaction conflicts
- Review Firestore rules

#### 3. "Media processing failed"
- Verify AWS credentials
- Check file size limits
- Validate file format
- Review service quotas

## Resources

- [Firebase Admin SDK Docs](https://firebase.google.com/docs/admin/setup)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [ElevenLabs API Docs](https://docs.elevenlabs.io/)