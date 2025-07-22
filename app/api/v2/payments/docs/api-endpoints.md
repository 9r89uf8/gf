# Payment API Endpoints

This document provides comprehensive documentation for all payment-related API endpoints in the system.

## Base URL
```
/api/v2/payments
```

## Endpoints Overview

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|---------------|
| `/create-checkout-session` | POST | Create Stripe checkout session | Optional |
| `/products` | GET | List available products | None |
| `/session-status` | GET | Get checkout session status | None |
| `/upgrade-to-premium` | POST | Upgrade user to premium | Required |

---

## 1. Create Checkout Session

**Endpoint:** `POST /api/v2/payments/create-checkout-session`

Creates a new Stripe checkout session for purchasing products.

### Request Body
```json
{
  "productId": "string",     // Required - Stripe price ID
  "quantity": "number",      // Optional - Default: 1
  "customerEmail": "string", // Optional - Customer email
  "userId": "string",        // Optional - User ID
  "metadata": "object"       // Optional - Additional metadata
}
```

### Response
```json
{
  "clientSecret": "string",  // Stripe client secret for embedded checkout
  "sessionId": "string"      // Checkout session ID
}
```

### Error Responses
- `400` - Product ID is required
- `500` - Failed to create checkout session

### Example
```javascript
const response = await fetch('/api/v2/payments/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    productId: 'price_1234567890',
    quantity: 1,
    customerEmail: 'user@example.com',
    userId: 'user123',
    metadata: {
      source: 'web_app'
    }
  })
});
```

---

## 2. List Products

**Endpoint:** `GET /api/v2/payments/products`

Retrieves all available products and their pricing information from Stripe.

### Request
No parameters required.

### Response
```json
{
  "status": "success",
  "products": [
    {
      "id": "string",           // Stripe price ID
      "product": {
        "id": "string",         // Stripe product ID
        "name": "string",       // Product name
        "description": "string", // Product description
        "images": ["string"],   // Product images
        "features": [           // Product features
          {
            "name": "string"
          }
        ],
        "metadata": "object"    // Product metadata
      },
      "unit_amount": "number",  // Price in cents
      "currency": "string",     // Currency code
      "type": "string"          // Price type
    }
  ]
}
```

### Error Responses
- `500` - Failed to list products

### Example
```javascript
const response = await fetch('/api/v2/payments/products');
const data = await response.json();
```

---

## 3. Session Status

**Endpoint:** `GET /api/v2/payments/session-status`

Retrieves the status of a Stripe checkout session.

### Query Parameters
- `session_id` (required) - The Stripe session ID

### Response
```json
{
  "status": "success",
  "session": {
    "id": "string",                    // Session ID
    "status": "string",                // Session status
    "payment_status": "string",        // Payment status
    "customer_email": "string",        // Customer email
    "amount_total": "number",          // Total amount in cents
    "currency": "string",              // Currency code
    "metadata": "object"               // Session metadata
  }
}
```

### Error Responses
- `400` - Session ID is required
- `500` - Failed to retrieve session status

### Example
```javascript
const sessionId = 'cs_test_1234567890';
const response = await fetch(`/api/v2/payments/session-status?session_id=${sessionId}`);
```

---

## 4. Upgrade to Premium

**Endpoint:** `POST /api/v2/payments/upgrade-to-premium`

Upgrades a user to premium status after successful payment verification.

### Authentication
Requires valid JWT token in Authorization header.

### Request Body
```json
{
  "sessionId": "string",        // Required - Stripe session ID
  "paymentDetails": {           // Required - Payment details
    "amount": "number",         // Payment amount
    "currency": "string",       // Currency code
    "metadata": {               // Payment metadata
      "productDuration": "string", // Duration in days
      "productType": "string"      // Product type
    }
  },
  "metadata": "object"          // Optional - Additional metadata
}
```

### Response
```json
{
  "success": true,
  "message": "User upgraded to premium successfully",
  "conversationsUpdated": "number",     // Number of conversations updated
  "paymentRecord": {                    // Payment record details
    "id": "string",
    "amount": "number",
    "currency": "string",
    "date": "string",
    "duration": "number",
    "status": "string",
    "expiresAt": "string",
    "productType": "string",
    "metadata": "object"
  },
  "user": "object"                      // Updated user data
}
```

### Features
- **Transaction Safety**: Uses Firestore transactions to prevent race conditions
- **Duplicate Prevention**: Checks for existing payment records
- **Premium Benefits**: Updates all user conversations with premium limits
- **Automatic Expiration**: Calculates premium expiration based on product duration

### Error Responses
- `401` - Authentication required
- `500` - Failed to upgrade user

### Example
```javascript
const response = await fetch('/api/v2/payments/upgrade-to-premium', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <jwt-token>'
  },
  body: JSON.stringify({
    sessionId: 'cs_test_1234567890',
    paymentDetails: {
      amount: 999,
      currency: 'usd',
      metadata: {
        productDuration: '30',
        productType: 'premium'
      }
    }
  })
});
```

---

## Common Error Format

All endpoints return errors in the following format:
```json
{
  "error": "string"  // Error message description
}
```

## Rate Limiting

These endpoints may be subject to rate limiting. Implement appropriate retry logic with exponential backoff.

## Security Considerations

1. Always validate payment details server-side
2. Use HTTPS for all payment-related requests
3. Store sensitive data securely
4. Implement proper authentication for user-specific operations
5. Never trust client-side payment verification