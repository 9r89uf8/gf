# Security Measures

Comprehensive overview of security implementations in the NextAI GF authentication system.

## 🛡️ Security Architecture

The authentication system implements multiple layers of security to protect user accounts and prevent abuse:

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Request                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│               CAPTCHA Verification                          │
│            (Cloudflare Turnstile)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            Input Validation & Bot Detection                 │
│        (Email validation, Username analysis)               │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            Firebase Authentication                          │
│         (User creation/verification)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              Session Management                             │
│        (Secure cookies, 48h expiration)                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│            Content Moderation                               │
│         (AWS Rekognition for images)                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Security

### Session Management

**Session Cookies Configuration:**
```javascript
{
  name: 'tokenAIGF',
  httpOnly: true,        // Prevents XSS attacks
  sameSite: 'lax',       // CSRF protection
  secure: production,    // HTTPS only in production
  maxAge: 172800,       // 48 hours (in seconds)
  path: '/'             // Site-wide access
}
```

**Benefits:**
- **XSS Protection**: `httpOnly` prevents JavaScript access
- **CSRF Protection**: `sameSite: 'lax'` prevents cross-site requests
- **Secure Transport**: `secure` flag ensures HTTPS-only transmission
- **Limited Lifetime**: 48-hour expiration reduces exposure window

### Firebase Integration

**Server-side Operations:**
- Uses Firebase Admin SDK for all authentication operations
- Session cookies created server-side with controlled expiration
- User verification through Firebase session validation

**Token Flow:**
1. User authenticates → receives Firebase ID token
2. Server converts ID token → session cookie
3. Subsequent requests → validated via session cookie
4. Session expiration → requires re-authentication

## 🤖 Bot Detection & Prevention

### Email Validation

**Blocked Domains:**
```javascript
const blockedDomains = ['.ru', '.xyz'];
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Validation Logic:**
- Regex pattern validation for proper email format
- Domain-based blocking for known spam sources
- Extensible pattern for adding more blocked domains

### Username Analysis

**Bot Pattern Detection:**
```javascript
// Pattern 1: Exactly 8 random alphanumeric characters
const randomPattern = /^[a-zA-Z0-9]{8}$/;

// Pattern 2: 4 or more repeated characters
const repeatedPattern = /(.)\1{4,}/;
```

**Detection Criteria:**
- **Random Usernames**: Blocks usernames that are exactly 8 random characters
- **Repeated Characters**: Rejects usernames with excessive character repetition
- **Extensible**: Easy to add more bot detection patterns

## 🔒 CAPTCHA Protection

### Cloudflare Turnstile Integration

**Implementation Status:**
- **Registration**: Currently commented out, ready for activation
- **Login**: Currently commented out, ready for activation  
- **Password Reset**: Active and required
- **Profile Editing**: Active and required

**Verification Process:**
```javascript
const verificationResponse = await fetch(
  'https://challenges.cloudflare.com/turnstile/v0/siteverify',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
    }),
  }
);
```

**Security Benefits:**
- Prevents automated bot registrations
- Protects against brute force attacks
- Reduces spam and abuse
- Privacy-friendly alternative to traditional CAPTCHAs

## 🖼️ Content Moderation

### AWS Rekognition Integration

**Moderation Pipeline:**
1. **Image Upload**: Profile picture uploaded via FormData
2. **Content Detection**: AWS Rekognition scans for inappropriate content
3. **Label Analysis**: Generates descriptive labels for safe content
4. **Content Filtering**: Blocks or processes based on moderation results

**Configuration:**
```javascript
const moderationParams = {
  Image: { Bytes: buffer },
  MinConfidence: 75  // Moderation threshold
};

const labelParams = {
  Image: { Bytes: buffer },
  MaxLabels: 10,
  MinConfidence: 70  // Label detection threshold
};
```

**Content Handling:**

**Safe Content:**
- Generates AI-friendly image descriptions
- Stores detailed label information
- Enables personalized AI interactions

**Explicit Content:**
```javascript
if (moderationLabels.includes('Explicit', 'Exposed Male Genitalia', 'Explicit Sexual Activity')) {
  profilePicDescription = 'La foto de perfil del User aparece un pito parado.';
}
```

## 🔑 Password Security

### Firebase Authentication Standards

**Built-in Security:**
- Password complexity enforcement by Firebase
- Secure password hashing (not handled directly)
- Account lockout protection (Firebase managed)
- Password reset with secure tokens

### Password Reset Flow

**Security Measures:**
1. **CAPTCHA Required**: Turnstile verification mandatory
2. **Email Verification**: Only sends to registered email addresses
3. **Secure Links**: Firebase-generated time-limited reset links
4. **Template Protection**: Uses Mailgun templates to prevent injection

## 🎯 Premium Membership Security

### Automatic Expiration Handling

**Login-time Verification:**
```javascript
if (userData.premium && userData.expirationDate) {
  const now = adminDb.firestore.Timestamp.now();
  if (now.toMillis() > userData.expirationDate.toMillis()) {
    // Downgrade expired premium user
    await userRef.update({
      premium: false,
      expirationDate: null,
      expired: true
    });
  }
}
```

**Benefits:**
- Prevents unauthorized premium access
- Automatic cleanup of expired memberships
- Consistent premium status across sessions

## 🌐 Network Security

### HTTPS Enforcement

**Production Configuration:**
- Secure cookies only transmitted over HTTPS
- Environment-based security flag configuration
- Automatic HTTPS upgrade in production

### CORS & Headers

**Security Headers:**
- `Content-Type: application/json` for API responses
- Secure cookie flags as configured
- Next.js default CORS policies

## 🚫 Account Protection

### Account Deletion Security

**Protection Measures:**
- Requires active authentication session
- Uses `authMiddleware` for verification
- Irreversible operation with clear warnings
- Cleans up both Auth and Firestore data

### Data Consistency

**Firestore Transactions:**
- User creation uses atomic operations
- Premium status updates are consistent
- Account deletion removes all traces

## 🔍 Monitoring & Logging

### Error Handling

**Security-conscious Logging:**
```javascript
try {
  // Operation
} catch (error) {
  console.log(error.message); // Log errors without exposing sensitive data
  return standardErrorResponse;
}
```

**Benefits:**
- Logs errors for debugging
- Doesn't expose sensitive information to clients
- Standardized error responses

## ⚠️ Security Recommendations

### Current Implementation

**Strengths:**
- Multi-layered security approach
- Secure session management
- Content moderation pipeline
- Bot detection mechanisms
- CAPTCHA protection (where enabled)

### Potential Improvements

1. **Rate Limiting**: Implement request rate limiting for:
   - Login attempts
   - Registration requests
   - Password reset requests
   - Profile image uploads

2. **Enhanced Bot Detection**: Add more sophisticated patterns:
   - IP-based detection
   - Behavioral analysis
   - Device fingerprinting

3. **Security Headers**: Implement additional headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`

4. **Audit Logging**: Enhanced logging for:
   - Authentication attempts
   - Profile changes
   - Account deletions
   - Premium status changes

5. **Input Sanitization**: Additional validation for:
   - Username content filtering
   - Email normalization
   - Country code validation

## 🔧 Environment Security

### Required Environment Variables

```bash
# Firebase (Authentication)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Turnstile (CAPTCHA)
TURNSTILE_SECRET_KEY=your-turnstile-secret

# AWS (Image Moderation)
STHREE=your-aws-access-key
STHREESEC=your-aws-secret-key

# Mailgun (Email)
MAILGUN_API=your-mailgun-api-key
```

### Security Best Practices

- Store all secrets in environment variables
- Never commit secrets to version control
- Use different keys for development/production
- Regularly rotate API keys
- Monitor for unauthorized access