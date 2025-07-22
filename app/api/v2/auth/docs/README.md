# Authentication System Documentation

## Overview

The NextAI GF authentication system provides secure user management with session-based authentication, comprehensive security measures, and premium membership handling. Built on Firebase Authentication with additional security layers including CAPTCHA protection, image moderation, and bot detection.

## 🔐 Core Features

- **Session-based Authentication**: Secure 48-hour session cookies
- **Firebase Integration**: Firebase Auth + Firestore for user management
- **Security Layers**: CAPTCHA, bot detection, email validation
- **Image Moderation**: AWS Rekognition for profile picture content filtering
- **Premium Membership**: Automatic expiration handling and benefits management
- **Password Reset**: Email-based password recovery via Mailgun

## 🚀 Quick Start

### Environment Variables

Required environment variables for the authentication system:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Cloudflare Turnstile (CAPTCHA)
TURNSTILE_SECRET_KEY=your-turnstile-secret

# AWS Rekognition (Image Moderation)
STHREE=your-aws-access-key
STHREESEC=your-aws-secret-key

# Mailgun (Password Reset)
MAILGUN_API=your-mailgun-api-key
```

### Basic Usage

```javascript
// Login
const response = await fetch('/api/v2/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    turnstileToken: 'captcha-token'
  })
});

// Register
const response = await fetch('/api/v2/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    username: 'username',
    country: 'ES',
    turnstileToken: 'captcha-token'
  })
});

// Verify authentication
const response = await fetch('/api/v2/auth/verify');
```

## 📁 File Structure

```
/app/api/v2/auth/
├── docs/                    # Documentation files
│   ├── README.md           # This file - overview and quick start
│   ├── api-endpoints.md    # Detailed API documentation
│   ├── security-measures.md # Security features and implementations
│   ├── middleware.md       # Authentication middleware
│   └── examples.md         # Code examples and integration guides
├── delete/route.js         # Account deletion
├── edit-user/route.js      # Profile editing with image moderation
├── login/route.js          # User login
├── register/route.js       # User registration
├── reset-password/route.js # Password reset
├── signout/route.js        # User logout
└── verify/route.js         # Authentication verification
```

## 🛡️ Security Features

- **CAPTCHA Protection**: Cloudflare Turnstile integration
- **Bot Detection**: Username pattern analysis
- **Email Validation**: Domain blocking and format validation
- **Image Moderation**: AWS Rekognition content filtering
- **Secure Cookies**: HttpOnly, SameSite, Secure flags
- **Session Management**: 48-hour expiring session cookies
- **Premium Handling**: Automatic expiration and downgrade

## 📊 User Flow

1. **Registration**: Create account with validation and bot detection
2. **Login**: Authenticate and create session cookie
3. **Session Management**: Middleware validates requests
4. **Premium Handling**: Automatic expiration checking
5. **Profile Management**: Secure editing with image moderation
6. **Password Recovery**: Email-based reset system
7. **Logout**: Secure session termination

## 🔗 Related Documentation

- [API Endpoints](./api-endpoints.md) - Complete API reference
- [Security Measures](./security-measures.md) - Security implementation details
- [Middleware](./middleware.md) - Authentication middleware documentation
- [Examples](./examples.md) - Integration examples and code samples

## ⚙️ Configuration

### Cookie Settings

The system uses secure session cookies with the following configuration:

```javascript
{
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 48 * 60 * 60 // 48 hours
}
```

### Premium Membership

Premium users receive:
- Extended conversation benefits
- Automatic expiration handling during login
- Persistent premium status across sessions

## 🐛 Troubleshooting

### Common Issues

1. **CAPTCHA Verification Failed**: Check Turnstile configuration and token validity
2. **Session Expired**: Sessions expire after 48 hours, require re-authentication
3. **Image Upload Failed**: Check AWS Rekognition configuration and content policy
4. **Email Not Received**: Verify Mailgun setup and domain configuration

### Error Codes

- `401`: Authentication failed or session expired
- `400`: Invalid request data or CAPTCHA failure
- `500`: Server error (check logs for details)

## 📝 Contributing

When modifying the authentication system:

1. Update relevant documentation files
2. Test all security measures
3. Verify premium membership handling
4. Check session cookie behavior
5. Test image moderation pipeline