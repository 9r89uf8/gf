import { NextResponse } from 'next/server';
import { listProducts, getLocalizedPrices } from '../../services/stripeService';

export async function GET(request) {
  try {
    // Get country parameter from query string
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    
    // Get available products from Stripe
    const products = await listProducts();
    
    // If country is provided, get localized prices
    let localizedProducts = products;
    if (country) {
      localizedProducts = await getLocalizedPrices(products, country);
    }

    return NextResponse.json({
      status: 'success',
      products: localizedProducts,
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