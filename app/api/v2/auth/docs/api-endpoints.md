# Authentication API Endpoints

Complete reference for all authentication API endpoints in the NextAI GF system.

## Base URL

All endpoints are relative to: `/api/v2/auth/`

## Endpoints Overview

| Endpoint | Method | Description | Authentication Required |
|----------|--------|-------------|----------------------|
| `/login` | POST | User login | No |
| `/register` | POST | User registration | No |
| `/verify` | GET | Check authentication status | Yes |
| `/signout` | POST | User logout | No |
| `/reset-password` | POST | Send password reset email | No |
| `/edit-user` | POST | Edit user profile | Yes |
| `/delete` | GET | Delete user account | Yes |

---

## POST /login

Authenticates a user and creates a session cookie.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "turnstileToken": "captcha-token" // Optional, currently commented out
}
```

### Response

**Success (200)**
```json
{
  "user": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "name": "username",
    "profilePic": "https://...",
    "premium": false,
    "country": "ES",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "token": "firebase-id-token"
}
```

**Error (401)**
```json
{
  "error": "Invalid email or password"
}
```

### Features

- Creates 48-hour session cookie (`tokenAIGF`)
- Checks premium membership expiration
- Automatically downgrades expired premium users
- Returns user data from Firestore

---

## POST /register

Creates a new user account with validation and bot detection.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "myusername",
  "country": "ES",
  "turnstileToken": "captcha-token" // Optional, currently commented out
}
```

### Response

**Success (200)**
```json
{
  "user": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "name": "myusername",
    "profilePic": null,
    "premium": false,
    "country": "ES",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Error (400)**
```json
{
  "error": "Invalid registration" // Bot detection or invalid email
}
```

### Validation Rules

#### Email Validation
- Must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Blocked domains: `.ru`, `.xyz`

#### Bot Detection
- Rejects usernames matching: `/^[a-zA-Z0-9]{8}$/` (8 random chars)
- Rejects usernames with 4+ repeated characters: `/(.)\1{4,}/`

### Features

- Creates Firebase Auth user
- Creates Firestore user document
- Automatically signs in user after registration
- Creates session cookie

---

## GET /verify

Verifies if the current session is authenticated and returns user data.

### Headers

```
Cookie: tokenAIGF=session-cookie-value
```

### Response

**Success (200)**
```json
{
  "isAuthenticated": true,
  "userData": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "name": "username",
    "profilePic": "https://...",
    "premium": false,
    "country": "ES"
  }
}
```

**Error (401)**
```json
{
  "isAuthenticated": false,
  "message": "User not authenticated"
}
```

### Features

- Uses `authMiddleware` for session validation
- Returns current user data from Firestore
- Handles missing user documents gracefully

---

## POST /signout

Logs out the user by clearing the session cookie.

### Response

**Success (200)**
```json
{
  "message": "Sign out successful"
}
```

### Features

- Clears `tokenAIGF` cookie with `maxAge: -1`
- Secure cookie clearing with proper flags

---

## POST /reset-password

Sends a password reset email to the user.

### Request Body

```json
{
  "email": "user@example.com",
  "turnstileToken": "captcha-token"
}
```

### Response

**Success (200)**
```json
{
  "message": "Correo electrónico de restablecimiento de contraseña enviado."
}
```

**Error (400)**
```json
{
  "error": "Invalid CAPTCHA"
}
```

**Error (500)**
```json
{
  "message": "Failed to send password reset email."
}
```

### Features

- Uses Firebase Admin SDK to generate reset links
- Sends emails via Mailgun with Spanish template
- Requires valid Turnstile CAPTCHA token
- Uses custom email template (`password`)

---

## POST /edit-user

Updates user profile information including email, name, and profile picture.

### Request Body (FormData)

```
email: user@example.com
name: newusername
image: File (optional)
turnstileToken: captcha-token
```

### Response

**Success (200)**
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "name": "newusername",
  "profilePic": "https://storage.googleapis.com/...",
  "profilePicDescription": "AI-generated description of the image",
  "premium": false,
  "country": "ES"
}
```

**Error (400)**
```json
{
  "error": "Invalid CAPTCHA"
}
```

### Image Processing

When uploading a profile picture:

1. **Content Moderation**: AWS Rekognition checks for inappropriate content
2. **Label Detection**: Generates descriptive labels for the image
3. **Storage**: Uploads to Firebase Storage with unique UUID filename
4. **Explicit Content Handling**: Special handling for inappropriate content

#### Moderation Labels

- **Safe Content**: Generates descriptive prompt for AI conversations
- **Explicit Content**: Sets warning message in Spanish
- **Confidence Threshold**: 75% for moderation, 70% for labels

### Features

- Updates Firebase Auth email
- Updates Firestore user document
- Handles file uploads to Firebase Storage
- AWS Rekognition image moderation
- Turnstile CAPTCHA verification
- Generates AI-friendly image descriptions

---

## GET /delete

Permanently deletes the user account and all associated data.

### Headers

```
Cookie: tokenAIGF=session-cookie-value
```

### Response

**Success (200)**
```json
{}
```

**Error (401)**
```json
{
  "error": "Authentication required"
}
```

### Features

- Requires authentication via `authMiddleware`
- Deletes Firebase Auth user
- Deletes Firestore user document
- **Warning**: This operation is irreversible

---

## Error Handling

### Common Error Responses

```json
// Authentication Error
{
  "error": "Authentication required",
  "status": 401
}

// Validation Error
{
  "error": "Invalid request data",
  "status": 400
}

// Server Error
{
  "error": "Internal server error",
  "status": 500
}
```

### Status Codes

- **200**: Success
- **400**: Bad Request (validation error, invalid CAPTCHA)
- **401**: Unauthorized (authentication required/failed)
- **500**: Internal Server Error

## Rate Limiting

Currently no explicit rate limiting is implemented in the auth endpoints. Consider implementing rate limiting for:

- Login attempts
- Registration attempts  
- Password reset requests
- Profile image uploads

## Security Headers

All responses include:
- `Content-Type: application/json`
- Secure cookie flags in production
- CORS headers as configured by Next.js