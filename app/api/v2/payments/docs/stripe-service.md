# Stripe Service Documentation

This document provides comprehensive documentation for the Stripe service module located at `/app/api/v2/services/stripeService.js`.

## Overview

The Stripe service provides a centralized interface for all Stripe-related operations including checkout sessions, product management, and payment processing.

## Configuration

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_test_...        # Stripe secret key (required)
NEXT_PUBLIC_BASE_URL=https://...     # Base URL for return URLs (required)
NODE_ENV=development|production      # Environment type
```

### Stripe API Version
```javascript
apiVersion: '2024-06-20'
```

---

## Functions

### createCheckoutSession(params)

Creates a Stripe Checkout Session for embedded checkout with comprehensive configuration.

#### Parameters
```javascript
{
  productId: string,          // Required - Stripe price ID
  quantity: number,           // Optional - Default: 1
  customerEmail: string,      // Optional - Customer email for prefill
  metadata: object           // Optional - Custom metadata
}
```

#### Returns
```javascript
{
  clientSecret: string,       // Client secret for embedded checkout
  sessionId: string          // Session ID for tracking
}
```

#### Features
- **Embedded UI Mode**: Uses `ui_mode: 'embedded'` for seamless integration
- **Spanish Locale**: Default locale set to 'es' for Spanish-speaking users
- **Automatic Tax**: Enabled for compliance
- **Billing Address**: Auto-collection enabled
- **Product Duration**: Automatically extracts duration from product metadata
- **Rich Metadata**: Includes timestamp, product details, and custom data

#### Configuration Details
```javascript
const sessionConfig = {
  ui_mode: 'embedded',
  line_items: [{ price: productId, quantity: quantity }],
  mode: 'payment',
  return_url: `${baseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
  automatic_tax: { enabled: true },
  locale: 'es',
  billing_address_collection: 'auto',
  metadata: {
    timestamp: new Date().toISOString(),
    productDuration: duration,
    productId: price.product.id,
    productName: price.product.name,
    ...customMetadata
  }
}
```

#### Error Handling
- Validates environment variables
- Handles Stripe API errors
- Provides detailed error messages
- Logs errors for debugging

#### Example
```javascript
const session = await createCheckoutSession({
  productId: 'price_1234567890',
  quantity: 1,
  customerEmail: 'user@example.com',
  metadata: {
    userId: 'user123',
    source: 'web_app'
  }
});
```

---

### retrieveCheckoutSession(sessionId)

Retrieves detailed information about a Stripe Checkout Session.

#### Parameters
- `sessionId` (string) - The Stripe session ID to retrieve

#### Returns
```javascript
{
  id: string,                 // Session ID
  status: string,             // Session status (open, complete, expired)
  payment_status: string,     // Payment status (paid, unpaid, no_payment_required)
  customer_email: string,     // Customer email from session
  amount_total: number,       // Total amount in cents
  currency: string,           // Currency code (e.g., 'usd')
  metadata: object           // Session metadata including productDuration
}
```

#### Use Cases
- Payment verification
- Order status checking
- Premium upgrade confirmation
- Analytics and reporting

#### Example
```javascript
const sessionDetails = await retrieveCheckoutSession('cs_test_1234567890');
console.log(`Payment status: ${sessionDetails.payment_status}`);
```

---

### listProducts()

Retrieves all active products and prices from Stripe with enhanced feature parsing.

#### Parameters
None

#### Returns
```javascript
[
  {
    id: string,               // Stripe price ID
    product: {
      id: string,             // Stripe product ID
      name: string,           // Product name
      description: string,    // Product description
      images: [string],       // Product image URLs
      features: [             // Parsed features array
        { name: string }
      ],
      metadata: object        // Complete product metadata
    },
    unit_amount: number,      // Price in cents
    currency: string,         // Currency code
    type: string             // Price type (one_time, recurring)
  }
]
```

#### Feature Parsing Logic

The function intelligently parses product features from metadata in two ways:

1. **Numbered Features**: `feature1`, `feature2`, ... `feature10`
2. **Comma-Separated Features**: `features` field with comma-separated values

```javascript
// Example metadata:
{
  feature1: "Unlimited messages",
  feature2: "Premium support", 
  feature3: "Advanced AI features",
  features: "Custom avatars, Priority processing",
  duration: "30"
}

// Parsed features:
[
  { name: "Unlimited messages" },
  { name: "Premium support" },
  { name: "Advanced AI features" },
  { name: "Custom avatars" },
  { name: "Priority processing" }
]
```

#### Example
```javascript
const products = await listProducts();
products.forEach(product => {
  console.log(`${product.product.name}: $${product.unit_amount / 100}`);
  product.product.features.forEach(feature => {
    console.log(`  - ${feature.name}`);
  });
});
```

---

## Error Handling

All functions implement comprehensive error handling:

### Error Types
1. **Configuration Errors**: Missing environment variables
2. **Stripe API Errors**: Invalid parameters, network issues
3. **Validation Errors**: Missing required parameters

### Error Format
```javascript
throw new Error(`Failed to ${operation}: ${originalError.message}`);
```

### Logging
All errors are logged to console with context:
```javascript
console.error('Error creating checkout session:', error);
```

---

## Security Features

### API Key Management
- Uses server-side secret key only
- Never exposes secret key to client
- Validates environment configuration

### Data Validation
- Validates required parameters
- Sanitizes input data
- Implements proper error boundaries

### Metadata Security
- Stores sensitive data in secure metadata
- Includes timestamps for audit trails
- Supports custom tracking fields

---

## Integration Examples

### Frontend Integration
```javascript
// Create checkout session
const response = await fetch('/api/v2/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'price_1234567890',
    customerEmail: userEmail
  })
});

const { clientSecret } = await response.json();

// Initialize Stripe embedded checkout
const stripe = Stripe('pk_test_...');
const checkout = await stripe.initEmbeddedCheckout({
  clientSecret: clientSecret
});
checkout.mount('#checkout');
```

### Backend Integration
```javascript
import { 
  createCheckoutSession, 
  retrieveCheckoutSession, 
  listProducts 
} from './stripeService';

// In your API routes
const session = await createCheckoutSession({
  productId: body.productId,
  customerEmail: body.email,
  metadata: { userId: user.id }
});
```

---

## Best Practices

### 1. Error Handling
Always wrap Stripe operations in try-catch blocks:
```javascript
try {
  const session = await createCheckoutSession(params);
  return session;
} catch (error) {
  console.error('Stripe error:', error);
  throw error;
}
```

### 2. Metadata Usage
Use metadata for tracking and business logic:
```javascript
metadata: {
  userId: user.id,
  source: 'mobile_app',
  campaign: 'summer_sale',
  timestamp: new Date().toISOString()
}
```

### 3. Environment Configuration
Always validate environment variables:
```javascript
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required');
}
```

### 4. Testing
Use Stripe test mode for development:
```javascript
// Test card numbers
4242424242424242  // Visa
4000000000000002  // Declined card
```

---

## Dependencies

```json
{
  "stripe": "^latest"
}
```

## Related Documentation
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Embedded Checkout](https://stripe.com/docs/checkout/embedded)
- [API Endpoints Documentation](./api-endpoints.md)