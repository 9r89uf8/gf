# Message Flow Diagram - Save Message V2

## Overview
This document illustrates the complete flow of message processing in the V2 save-message endpoint, from user input to AI response.

## Message Flow Diagram

```mermaid
flowchart TD
    Start([User Sends Message]) --> ParseRequest[Parse FormData Request]
    
    ParseRequest --> ValidatePerms{Validate<br/>Permissions}
    ValidatePerms -->|Invalid| PermError[Return 403 Error]
    
    ValidatePerms -->|Valid| CheckLimits{Check Usage<br/>Limits}
    CheckLimits -->|Exceeded| LimitError[Return 429 Error]
    
    CheckLimits -->|OK| HasMedia{Has Media?}
    
    HasMedia -->|Yes| ValidateFile{Validate<br/>File}
    ValidateFile -->|Invalid| FileError[Return 400 Error]
    ValidateFile -->|Valid| MediaType{Media Type?}
    
    MediaType -->|Audio| Transcribe[Transcribe Audio<br/>OpenAI Whisper]
    MediaType -->|Image| AnalyzeImage[Analyze Image<br/>AWS Rekognition]
    MediaType -->|Video| ProcessVideo[Flag as Explicit]
    
    Transcribe --> UploadMedia[Upload to Firebase]
    AnalyzeImage --> UploadMedia
    ProcessVideo --> UploadMedia
    
    HasMedia -->|No| ValidateContent{Validate<br/>Content}
    UploadMedia --> ValidateContent
    
    ValidateContent -->|Invalid| ContentError[Return 400 Error]
    ValidateContent -->|Valid| Sanitize[Sanitize Content]
    
    Sanitize --> GetConv[Get/Create Conversation]
    GetConv --> CreateUserMsg[Create User Message<br/>Status: processing]
    
    CreateUserMsg --> SaveUserTx[(Save User Message<br/>Transaction)]
    SaveUserTx --> UpdateLimits[Update Usage Limits]
    
    UpdateLimits --> CheckCredits{Has Credits<br/>for AI?}
    CheckCredits -->|No| AddOOCMsg[Add Out of Credits Message]
    AddOOCMsg --> ReturnOOC[Return Success<br/>No AI Response]
    
    CheckCredits -->|Yes| AnalyzeIntent[Analyze User Intent<br/>Bedrock/Llama]
    AnalyzeIntent --> GenerateAI[Generate AI Response<br/>LLM Handler]
    
    GenerateAI --> ParseAI[Parse AI Response<br/>for Media Tags]
    ParseAI --> AIMediaType{AI Wants<br/>Media?}
    
    AIMediaType -->|Image| CheckImageLimit{Image<br/>Limit OK?}
    AIMediaType -->|Video| CheckVideoLimit{Video<br/>Limit OK?}
    AIMediaType -->|Audio| CheckAudioLimit{Audio<br/>Limit OK?}
    AIMediaType -->|Text Only| MaybeRandom{Random<br/>Media?}
    
    CheckImageLimit -->|Yes| GetImage[Get Image from DB]
    CheckImageLimit -->|No| SetLink1[Set Display Link]
    
    CheckVideoLimit -->|Yes| GetVideo[Get Video from DB]
    CheckVideoLimit -->|No| SetLink2[Set Display Link]
    
    CheckAudioLimit -->|Yes| GenAudio[Generate Audio<br/>ElevenLabs]
    CheckAudioLimit -->|No| SetLink3[Set Display Link]
    
    MaybeRandom -->|30% Chance| GenRandomAudio[Generate Audio<br/>ElevenLabs]
    MaybeRandom -->|70% Chance| NoExtra[No Extra Media]
    
    GetImage --> CreateAIMsg[Create Assistant Message]
    GetVideo --> CreateAIMsg
    GenAudio --> CreateAIMsg
    SetLink1 --> CreateAIMsg
    SetLink2 --> CreateAIMsg
    SetLink3 --> CreateAIMsg
    GenRandomAudio --> CreateAIMsg
    NoExtra --> CreateAIMsg
    
    CreateAIMsg --> SaveAITx[(Save AI Message<br/>Transaction)]
    SaveAITx --> UpdateStatus[Update User Message<br/>Status: completed]
    UpdateStatus --> UpdateLimits2[Update Media Limits]
    
    UpdateLimits2 --> Success[Return Success Response]
    
    GenerateAI -->|Error| AIError[AI Generation Failed]
    AIError --> UpdateFailed[Update Status: failed]
    UpdateFailed --> ReturnError[Return 500 Error]
    
    %% Styling
    classDef error fill:#ff6b6b,stroke:#c92a2a,color:#fff
    classDef success fill:#51cf66,stroke:#2f9e44,color:#fff
    classDef database fill:#4dabf7,stroke:#1971c2,color:#fff
    classDef external fill:#ffd43b,stroke:#fab005,color:#000
    classDef decision fill:#e599f7,stroke:#ae3ec9,color:#fff
    
    class PermError,LimitError,FileError,ContentError,ReturnError,AIError error
    class Success,ReturnOOC success
    class SaveUserTx,SaveAITx database
    class Transcribe,AnalyzeImage,GenAudio,GenRandomAudio,AnalyzeIntent,GenerateAI external
    class ValidatePerms,CheckLimits,HasMedia,ValidateFile,MediaType,ValidateContent,CheckCredits,AIMediaType,CheckImageLimit,CheckVideoLimit,CheckAudioLimit,MaybeRandom decision
```

## Flow Stages Explained

### 1. **Request Validation** (Steps 1-4)
- Parse FormData and extract parameters
- Validate user permissions (premium status, girl availability)
- Check usage limits (messages, images, audio)
- Validate file uploads if present

### 2. **Media Processing** (Steps 5-8)
- **Audio**: Transcribe using OpenAI Whisper
- **Image**: Analyze with AWS Rekognition for moderation
- **Video**: Auto-flag as explicit content
- Upload all media to Firebase Storage

### 3. **Message Preparation** (Steps 9-11)
- Validate message content
- Sanitize user input
- Get or create conversation document
- Create user message object with "processing" status

### 4. **Database Transaction 1** (Steps 12-14)
- Save user message to conversation
- Update usage limits
- Check if user has credits for AI response

### 5. **AI Response Generation** (Steps 15-17)
- Analyze user intent using Bedrock/Llama
- Generate AI response using LLM
- Parse response for media tags ([IMAGE:], [VIDEO:], [AUDIO:])

### 6. **Media Enrichment** (Steps 18-22)
- Check if AI requested media and user has credits
- Fetch appropriate media from database
- Generate audio if requested
- 30% chance of random audio for text-only responses

### 7. **Database Transaction 2** (Steps 23-25)
- Save AI response message
- Update user message status to "completed"
- Update media usage limits

### 8. **Error Handling**
- Each stage has specific error handling
- Failed AI generation updates message status to "failed"
- All errors return appropriate HTTP status codes

## Key Features

### Transaction Boundaries
- **Transaction 1**: Saves user message and updates limits atomically
- **Transaction 2**: Saves AI response and finalizes message status atomically

### Performance Optimizations
- Frontend sends cached user/girl data to reduce reads
- Media processing happens asynchronously where possible
- Early returns for out-of-credits scenarios

### Security Measures
- Permission validation at the start
- File validation before processing
- Content sanitization
- Rate limiting (not shown in diagram)