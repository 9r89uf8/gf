import { NextResponse } from 'next/server';
import { listProducts } from '../../services/stripeService';

export async function GET() {
  try {
    // Get available products from Stripe
    const products = await listProducts();

    return NextResponse.json({
      status: 'success',
      products: products,
    });
  } catch (error) {
    console.error('Error in products endpoint:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to list products' },
      { status: 500 }
    );
  }
}

// Only allow GET requests
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}