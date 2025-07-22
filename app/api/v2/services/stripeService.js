import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

/**
 * Create a Stripe Checkout Session for embedded checkout
 * @param {Object} params - Session parameters
 * @returns {Object} Session object with clientSecret
 */
export async function createCheckoutSession(params) {
  try {
    const {
      productId,
      quantity = 1,
      customerEmail,
      metadata = {},
    } = params;

    // Get base URL with fallback for development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '');
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not set');
    }

    // Fetch the price to get product metadata
    const price = await stripe.prices.retrieve(productId, {
      expand: ['product'],
    });
    
    // Extract product metadata including duration
    const productMetadata = price.product.metadata || {};
    const duration = productMetadata.duration || null;

    const sessionConfig = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: productId,
          quantity: quantity,
        },
      ],
      mode: 'payment',
      return_url: `${baseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
      automatic_tax: { enabled: true },
      locale: 'es', // Set Spanish as the default locale
      billing_address_collection: 'auto', // Remove billing address requirement
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        productDuration: duration, // Include product duration in session metadata
        productId: price.product.id,
        productName: price.product.name,
      },
    };

    // Only add customer_email if it's provided and valid
    if (customerEmail && customerEmail.trim() !== '') {
      sessionConfig.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      clientSecret: session.client_secret,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Retrieve a Stripe Checkout Session by ID
 * @param {string} sessionId - The session ID
 * @returns {Object} Session details
 */
export async function retrieveCheckoutSession(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata, // This includes productDuration
    };
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw new Error(`Failed to retrieve checkout session: ${error.message}`);
  }
}


/**
 * List available products/prices
 * @returns {Array} List of active products with prices
 */
export async function listProducts() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product'],
    });

    return prices.data.map(price => {
      // Parse features from metadata if they exist
      let features = [];
      if (price.product.metadata) {
        // Check for features stored in metadata (feature1, feature2, etc.)
        for (let i = 1; i <= 10; i++) {
          if (price.product.metadata[`feature${i}`]) {
            features.push({ name: price.product.metadata[`feature${i}`] });
          }
        }
        // Also check for a features field that might contain comma-separated values
        if (price.product.metadata.features) {
          const metaFeatures = price.product.metadata.features.split(',').map(f => ({ name: f.trim() }));
          features = [...features, ...metaFeatures];
        }
      }


      return {
        id: price.id,
        product: {
          id: price.product.id,
          name: price.product.name,
          description: price.product.description,
          images: price.product.images,
          features: features,
          metadata: price.product.metadata || {},
        },
        unit_amount: price.unit_amount,
        currency: price.currency,
        type: price.type,
      };
    });
  } catch (error) {
    console.error('Error listing products:', error);
    throw new Error(`Failed to list products: ${error.message}`);
  }
}

export default stripe;