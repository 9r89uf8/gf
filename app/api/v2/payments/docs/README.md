# Payment System Documentation

Welcome to the comprehensive documentation for the NextAI GF payment system. This system handles all payment processing, premium subscriptions, and user upgrades using Stripe as the payment processor.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Security](#security)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The payment system is built on top of Stripe and provides:

- **Embedded Checkout**: Seamless payment experience with Stripe's embedded checkout
- **Premium Subscriptions**: Time-based premium memberships with automatic expiration
- **Multi-language Support**: Spanish locale support for international users
- **Conversation Management**: Automatic premium benefits for all user conversations
- **Security**: Transaction-safe user upgrades with duplicate payment prevention

### Key Features

✅ **Stripe Integration**: Full Stripe API integration with modern practices  
✅ **Embedded Checkout**: Native checkout experience without redirects  
✅ **Premium Management**: Automatic user upgrades and conversation updates  
✅ **Audit Trail**: Complete payment history and metadata tracking  
✅ **Error Handling**: Comprehensive error handling and logging  
✅ **Transaction Safety**: Firestore transactions prevent race conditions  

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Payment System                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────┐ │
│  │   Frontend      │    │   API Routes    │    │ Stripe  │ │
│  │   Checkout      │◄──►│   /payments     │◄──►│   API   │ │
│  │                 │    │                 │    │         │ │
│  └─────────────────┘    └─────────────────┘    └─────────┘ │
│           │                       │                        │
│           │                       │                        │
│           ▼                       ▼                        │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │   User State    │    │   Firebase      │               │
│  │   Management    │◄──►│   Database      │               │
│  │                 │    │                 │               │
│  └─────────────────┘    └─────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### File Structure

```
app/api/v2/payments/
├── docs/                           # Documentation (this folder)
│   ├── README.md                  # This overview
│   ├── api-endpoints.md           # API endpoint documentation
│   ├── stripe-service.md          # Stripe service documentation
│   └── examples.md                # Usage examples
├── create-checkout-session/       # Create payment sessions
│   └── route.js
├── products/                      # List available products
│   └── route.js
├── session-status/                # Check payment status
│   └── route.js
└── upgrade-to-premium/            # Process premium upgrades
    └── route.js

app/api/v2/services/
└── stripeService.js               # Core Stripe integration
```

## 🚀 Quick Start

### Prerequisites

1. **Stripe Account**: Set up a Stripe account and get your API keys
2. **Environment Variables**: Configure required environment variables
3. **Firebase**: Ensure Firebase is properly configured for user management

### Environment Configuration

```bash
# Required Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...              # Your Stripe secret key
NEXT_PUBLIC_BASE_URL=https://yourdomain.com # Base URL for return URLs

# Optional Configuration  
NODE_ENV=development                        # Environment type
```

### Basic Integration

1. **Install Dependencies**
```bash
npm install stripe
```

2. **Create a Product in Stripe**
```javascript
// In Stripe Dashboard or via API
const product = await stripe.products.create({
  name: 'Premium Membership',
  description: '30-day premium access',
  metadata: {
    duration: '30',
    feature1: 'Unlimited messages',
    feature2: 'Premium support'
  }
});
```

3. **Frontend Integration**
```javascript
// Create checkout session
const response = await fetch('/api/v2/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'price_1234567890',
    customerEmail: 'user@example.com'
  })
});

const { clientSecret } = await response.json();

// Initialize Stripe embedded checkout
const checkout = await stripe.initEmbeddedCheckout({ clientSecret });
checkout.mount('#checkout');
```

## 📚 API Reference

### Core Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/create-checkout-session` | Create payment session | No |
| `GET` | `/products` | List available products | No |
| `GET` | `/session-status` | Check payment status | No |
| `POST` | `/upgrade-to-premium` | Process premium upgrade | Yes |

For detailed API documentation, see [API Endpoints Documentation](./api-endpoints.md).

### Stripe Service Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `createCheckoutSession()` | Creates Stripe checkout session | `{clientSecret, sessionId}` |
| `retrieveCheckoutSession()` | Gets session status | Session details object |
| `listProducts()` | Lists available products | Array of products |

For detailed service documentation, see [Stripe Service Documentation](./stripe-service.md).

## 🔒 Security

### Security Features

- **Server-side Validation**: All payment verification happens server-side
- **Transaction Safety**: Firestore transactions prevent race conditions
- **Duplicate Prevention**: Automatic detection and prevention of duplicate payments
- **Audit Trail**: Complete payment history with timestamps
- **Environment Isolation**: Separate test and production environments

### Best Practices

1. **Never Trust Client Data**: Always verify payments server-side
2. **Use HTTPS**: All payment endpoints must use HTTPS in production
3. **Validate Environment**: Check for required environment variables
4. **Log Security Events**: Log all payment attempts and failures
5. **Rate Limiting**: Implement rate limiting for payment endpoints

### Authentication Flow

```
Client Request → Auth Middleware → Route Handler → Stripe API
      ↓              ↓                ↓              ↓
   JWT Token → Token Validation → Payment Processing → Response
```

## 🚀 Deployment

### Production Checklist

- [ ] Stripe production keys configured
- [ ] HTTPS enabled for all payment endpoints
- [ ] Environment variables properly set
- [ ] Firebase security rules configured
- [ ] Rate limiting implemented
- [ ] Error monitoring configured
- [ ] Webhook endpoints secured (if applicable)

### Environment Variables

```bash
# Production Environment
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_BASE_URL=https://yourproductiondomain.com
NODE_ENV=production
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "NEXT_PUBLIC_BASE_URL environment variable is not set"
**Solution**: Set the `NEXT_PUBLIC_BASE_URL` environment variable to your domain.

#### 2. "Product ID is required"
**Solution**: Ensure you're sending a valid Stripe price ID in the `productId` field.

#### 3. "Failed to create checkout session"
**Solution**: Check your Stripe secret key and network connectivity.

#### 4. "User not found" in premium upgrade
**Solution**: Ensure the user is properly authenticated and exists in Firebase.

### Debugging Tips

1. **Check Logs**: Monitor console logs for detailed error messages
2. **Stripe Dashboard**: Use Stripe's dashboard to verify payment events
3. **Test Mode**: Use Stripe test mode for development and testing
4. **Network**: Verify API connectivity and CORS settings

### Test Cards

Use these test card numbers in development:

```
4242424242424242  # Visa (Success)
4000000000000002  # Visa (Declined)
4000000000009995  # Visa (Insufficient funds)
```

## 📖 Additional Resources

- [API Endpoints Documentation](./api-endpoints.md) - Detailed endpoint specifications
- [Stripe Service Documentation](./stripe-service.md) - Service function reference
- [Usage Examples](./examples.md) - Code examples and integration patterns
- [Stripe Documentation](https://stripe.com/docs) - Official Stripe documentation

## 🤝 Contributing

When contributing to the payment system:

1. **Test Thoroughly**: Always test with Stripe test mode
2. **Document Changes**: Update relevant documentation
3. **Security Review**: Ensure security best practices are followed
4. **Error Handling**: Implement comprehensive error handling

## 📞 Support

For technical support or questions about the payment system:

1. Check the troubleshooting section above
2. Review the detailed API documentation
3. Test with Stripe's test mode first
4. Check Stripe's status page for API issues

---

*Last updated: July 2025*