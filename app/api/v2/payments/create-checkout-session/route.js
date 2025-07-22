import { NextResponse } from 'next/server';
import { createCheckoutSession } from '../../services/stripeService';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get user ID from request if authenticated
    let userId = body.userId || null;
    
    // Create checkout session
    const sessionData = await createCheckoutSession({
      productId: body.productId,
      quantity: body.quantity || 1,
      customerEmail: body.customerEmail,
      metadata: {
        ...body.metadata,
        userId: userId, // Include userId in metadata for webhook
      },
    });

    return NextResponse.json({
      clientSecret: sessionData.clientSecret,
      sessionId: sessionData.sessionId,
    });
  } catch (error) {
    console.error('Error in create-checkout-session endpoint:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}