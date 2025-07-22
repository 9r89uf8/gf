# Payment System Usage Examples

This document provides practical examples for integrating and using the payment system in various scenarios.

## 📋 Table of Contents

- [Frontend Integration](#frontend-integration)
- [Backend Integration](#backend-integration)
- [Testing Examples](#testing-examples)
- [Error Handling Examples](#error-handling-examples)
- [Advanced Use Cases](#advanced-use-cases)

## 🎯 Frontend Integration

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutComponent = ({ productId, userEmail }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createCheckoutSession = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v2/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: productId,
          customerEmail: userEmail,
          quantity: 1,
          metadata: {
            source: 'premium_upgrade',
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);

      // Initialize embedded checkout
      const stripe = await stripePromise;
      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret: clientSecret
      });

      // Mount the checkout
      checkout.mount('#checkout');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      {!clientSecret ? (
        <div>
          <button 
            onClick={createCheckoutSession} 
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {loading ? 'Loading...' : 'Upgrade to Premium'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      ) : (
        <div id="checkout">
          {/* Stripe embedded checkout will be mounted here */}
        </div>
      )}
    </div>
  );
};

export default CheckoutComponent;
```

### Payment Success Handler

```jsx
// pages/checkout/return.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

export default function CheckoutReturn() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    const { session_id } = router.query;
    
    if (session_id && user && token) {
      verifyPaymentAndUpgrade(session_id);
    }
  }, [router.query, user, token]);

  const verifyPaymentAndUpgrade = async (sessionId) => {
    try {
      // First, get session status
      const statusResponse = await fetch(
        `/api/v2/payments/session-status?session_id=${sessionId}`
      );
      
      if (!statusResponse.ok) {
        throw new Error('Failed to verify payment');
      }

      const { session } = await statusResponse.json();
      
      if (session.payment_status === 'paid') {
        // Upgrade user to premium
        const upgradeResponse = await fetch('/api/v2/payments/upgrade-to-premium', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sessionId: sessionId,
            paymentDetails: {
              amount: session.amount_total,
              currency: session.currency,
              metadata: session.metadata
            }
          })
        });

        if (upgradeResponse.ok) {
          setStatus('success');
          // Redirect to premium dashboard
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          throw new Error('Failed to upgrade user');
        }
      } else {
        setStatus('failed');
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="checkout-return">
      {status === 'loading' && <div>Processing your payment...</div>}
      {status === 'success' && (
        <div className="success">
          <h2>Payment Successful!</h2>
          <p>You have been upgraded to premium. Redirecting...</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="error">
          <h2>Payment Failed</h2>
          <p>Your payment was not successful. Please try again.</p>
        </div>
      )}
      {status === 'error' && (
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
```

### Products Display Component

```jsx
import { useState, useEffect } from 'react';

const ProductsDisplay = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/v2/payments/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.product.name}</h3>
          <p>{product.product.description}</p>
          <div className="price">
            ${(product.unit_amount / 100).toFixed(2)} {product.currency.toUpperCase()}
          </div>
          
          {product.product.features.length > 0 && (
            <ul className="features">
              {product.product.features.map((feature, index) => (
                <li key={index}>{feature.name}</li>
              ))}
            </ul>
          )}
          
          <button 
            onClick={() => onSelectProduct(product)}
            className="select-product-btn"
          >
            Select Plan
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductsDisplay;
```

## 🔧 Backend Integration

### API Route Example

```javascript
// pages/api/custom-checkout.js
import { createCheckoutSession, listProducts } from '@/app/api/v2/services/stripeService';
import { authMiddleware } from '@/app/middleware/authMiddleware';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user (optional)
    const authResult = await authMiddleware(req);
    const userId = authResult.authenticated ? authResult.user.uid : null;

    const { productId, customMetadata } = req.body;

    // Create checkout session with custom logic
    const sessionData = await createCheckoutSession({
      productId,
      customerEmail: authResult.user?.email,
      metadata: {
        userId,
        customField: customMetadata?.customField,
        source: 'custom_flow',
        timestamp: new Date().toISOString()
      }
    });

    res.status(200).json(sessionData);
  } catch (error) {
    console.error('Custom checkout error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### Webhook Handler Example

```javascript
// pages/api/webhooks/stripe.js
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful:', session.id);
      
      // Auto-upgrade user if metadata contains userId
      if (session.metadata?.userId) {
        try {
          // Call your upgrade endpoint or handle directly
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/payments/upgrade-to-premium`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Internal-Request': 'webhook'
            },
            body: JSON.stringify({
              sessionId: session.id,
              paymentDetails: {
                amount: session.amount_total,
                currency: session.currency,
                metadata: session.metadata
              },
              internalUpgrade: true
            })
          });
        } catch (upgradeError) {
          console.error('Auto-upgrade failed:', upgradeError);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
```

## 🧪 Testing Examples

### Unit Tests

```javascript
// __tests__/stripeService.test.js
import { createCheckoutSession, listProducts, retrieveCheckoutSession } from '../app/api/v2/services/stripeService';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn()
      }
    },
    prices: {
      list: jest.fn(),
      retrieve: jest.fn()
    }
  }));
});

describe('Stripe Service', () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';
  });

  test('createCheckoutSession creates session successfully', async () => {
    const mockSession = {
      id: 'cs_test_123',
      client_secret: 'cs_test_123_secret'
    };

    const mockPrice = {
      product: {
        id: 'prod_123',
        name: 'Test Product',
        metadata: { duration: '30' }
      }
    };

    const stripe = require('stripe')();
    stripe.prices.retrieve.mockResolvedValue(mockPrice);
    stripe.checkout.sessions.create.mockResolvedValue(mockSession);

    const result = await createCheckoutSession({
      productId: 'price_123',
      customerEmail: 'test@example.com'
    });

    expect(result).toEqual({
      clientSecret: 'cs_test_123_secret',
      sessionId: 'cs_test_123'
    });
  });

  test('listProducts returns formatted products', async () => {
    const mockPrices = {
      data: [{
        id: 'price_123',
        product: {
          id: 'prod_123',
          name: 'Premium Plan',
          description: 'Premium features',
          images: [],
          metadata: {
            feature1: 'Unlimited messages',
            feature2: 'Premium support'
          }
        },
        unit_amount: 999,
        currency: 'usd',
        type: 'one_time'
      }]
    };

    const stripe = require('stripe')();
    stripe.prices.list.mockResolvedValue(mockPrices);

    const result = await listProducts();

    expect(result[0].product.features).toEqual([
      { name: 'Unlimited messages' },
      { name: 'Premium support' }
    ]);
  });
});
```

### Integration Tests

```javascript
// __tests__/payments.integration.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../app/api/v2/payments/create-checkout-session/route';

describe('/api/v2/payments/create-checkout-session', () => {
  test('creates checkout session with valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        productId: 'price_test_123',
        customerEmail: 'test@example.com',
        quantity: 1
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    
    const data = JSON.parse(res._getData());
    expect(data).toHaveProperty('clientSecret');
    expect(data).toHaveProperty('sessionId');
  });

  test('returns error for missing productId', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        customerEmail: 'test@example.com'
      }
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    
    const data = JSON.parse(res._getData());
    expect(data.error).toBe('Product ID is required');
  });
});
```

## ❌ Error Handling Examples

### Comprehensive Error Handler

```javascript
// utils/paymentErrorHandler.js
export class PaymentError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.name = 'PaymentError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const handlePaymentError = (error) => {
  console.error('Payment error:', error);

  // Stripe specific errors
  if (error.type) {
    switch (error.type) {
      case 'StripeCardError':
        return new PaymentError(
          'Your card was declined. Please try a different payment method.',
          'CARD_DECLINED',
          400
        );
      case 'StripeRateLimitError':
        return new PaymentError(
          'Too many requests. Please try again later.',
          'RATE_LIMIT',
          429
        );
      case 'StripeInvalidRequestError':
        return new PaymentError(
          'Invalid payment request. Please check your information.',
          'INVALID_REQUEST',
          400
        );
      case 'StripeAPIError':
        return new PaymentError(
          'Payment service temporarily unavailable.',
          'SERVICE_UNAVAILABLE',
          503
        );
      default:
        return new PaymentError(
          'Payment processing failed. Please try again.',
          'PAYMENT_FAILED',
          500
        );
    }
  }

  // Generic error handling
  return new PaymentError(
    error.message || 'An unexpected error occurred.',
    'UNKNOWN_ERROR',
    500
  );
};

// Usage in API routes
export const withPaymentErrorHandling = (handler) => {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      const paymentError = handlePaymentError(error);
      return res.status(paymentError.statusCode).json({
        error: paymentError.message,
        code: paymentError.code
      });
    }
  };
};
```

### Frontend Error Handling

```jsx
// hooks/usePaymentError.js
import { useState } from 'react';

export const usePaymentError = () => {
  const [error, setError] = useState(null);

  const handlePaymentError = (error) => {
    let userMessage = 'An unexpected error occurred. Please try again.';

    if (error.code) {
      switch (error.code) {
        case 'CARD_DECLINED':
          userMessage = 'Your card was declined. Please try a different payment method.';
          break;
        case 'RATE_LIMIT':
          userMessage = 'Too many attempts. Please wait a moment and try again.';
          break;
        case 'INVALID_REQUEST':
          userMessage = 'Please check your payment information and try again.';
          break;
        case 'SERVICE_UNAVAILABLE':
          userMessage = 'Payment service is temporarily unavailable. Please try again later.';
          break;
      }
    }

    setError({
      message: userMessage,
      code: error.code,
      technical: error.message
    });
  };

  const clearError = () => setError(null);

  return { error, handlePaymentError, clearError };
};
```

## 🚀 Advanced Use Cases

### Subscription Management

```javascript
// utils/subscriptionManager.js
import { adminDb } from '@/app/utils/firebaseAdmin';

export class SubscriptionManager {
  static async checkPremiumStatus(userId) {
    try {
      const userDoc = await adminDb.firestore()
        .collection('users')
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        return { isPremium: false, expired: true };
      }

      const userData = userDoc.data();
      const payments = userData.payments || [];

      // Find the most recent valid payment
      const validPayments = payments.filter(payment => {
        if (!payment.expiresAt) return true; // Lifetime premium
        
        const expirationDate = payment.expiresAt.toDate();
        return expirationDate > new Date();
      });

      return {
        isPremium: validPayments.length > 0,
        expired: validPayments.length === 0 && payments.length > 0,
        expiresAt: validPayments.length > 0 
          ? validPayments[validPayments.length - 1].expiresAt 
          : null
      };
    } catch (error) {
      console.error('Error checking premium status:', error);
      return { isPremium: false, expired: false, error: error.message };
    }
  }

  static async extendPremium(userId, additionalDays) {
    const db = adminDb.firestore();
    
    return db.runTransaction(async (transaction) => {
      const userRef = db.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const payments = userData.payments || [];
      
      // Calculate new expiration date
      const now = new Date();
      const extensionDate = new Date(now.getTime() + (additionalDays * 24 * 60 * 60 * 1000));

      const extensionRecord = {
        id: `extension_${Date.now()}`,
        amount: 0,
        currency: 'usd',
        date: now,
        duration: additionalDays,
        status: 'completed',
        expiresAt: extensionDate,
        productType: 'extension',
        metadata: { type: 'manual_extension' }
      };

      transaction.update(userRef, {
        premium: true,
        payments: adminDb.firestore.FieldValue.arrayUnion(extensionRecord)
      });

      return extensionRecord;
    });
  }
}
```

### Analytics Integration

```javascript
// utils/paymentAnalytics.js
export const trackPaymentEvent = (eventType, data) => {
  // Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventType, {
      event_category: 'Payment',
      event_label: data.productName,
      value: data.amount / 100, // Convert cents to dollars
      currency: data.currency,
      transaction_id: data.sessionId
    });
  }

  // Custom analytics
  if (window.analytics) {
    window.analytics.track(eventType, {
      productId: data.productId,
      productName: data.productName,
      amount: data.amount,
      currency: data.currency,
      sessionId: data.sessionId,
      userId: data.userId,
      timestamp: new Date().toISOString()
    });
  }
};

// Usage examples
trackPaymentEvent('Payment Started', {
  productId: 'price_123',
  productName: 'Premium Plan',
  amount: 999,
  currency: 'usd',
  sessionId: 'cs_test_123',
  userId: 'user_123'
});

trackPaymentEvent('Payment Completed', {
  productId: 'price_123',
  productName: 'Premium Plan',
  amount: 999,
  currency: 'usd',
  sessionId: 'cs_test_123',
  userId: 'user_123'
});
```

### Performance Optimization

```javascript
// utils/paymentCache.js
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheProducts = async () => {
  try {
    const products = await listProducts();
    await redis.setex('products:list', 300, JSON.stringify(products)); // Cache for 5 minutes
    return products;
  } catch (error) {
    console.error('Failed to cache products:', error);
    throw error;
  }
};

export const getCachedProducts = async () => {
  try {
    const cached = await redis.get('products:list');
    if (cached) {
      return JSON.parse(cached);
    }
    return cacheProducts(); // Fetch and cache if not found
  } catch (error) {
    console.error('Failed to get cached products:', error);
    return listProducts(); // Fallback to direct fetch
  }
};
```

---

These examples demonstrate various integration patterns and use cases for the payment system. Choose the patterns that best fit your application's architecture and requirements.