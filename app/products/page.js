// app/products/page.js (Server Component)
import ProductsPageClient from '@/app/components/products/ProductsPageClient';
import LoginPrompt from '@/app/components/products/LoginPrompt';
import { cookies } from 'next/headers';

async function getUserData() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('tokenAIGF');

    // If no token, return early - no need to make API call
    if (!token) {
      return null;
    }

    // Direct server-side API call to verify authentication
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/verify`, {
      method: 'GET',
      headers: {
        // Forward the auth cookie
        Cookie: token ? `tokenAIGF=${token.value}` : ''
      },
      cache: 'no-store'
    });

    // Parse JSON only once and store the result
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying user:', error);
    return null;
  }
}

async function getProducts(userCountry) {
  try {
    // Build the URL with country parameter if available
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/payments/products`);
    if (userCountry) {
      url.searchParams.append('country', userCountry);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return { error: 'No se pudieron cargar los productos. Por favor, intenta más tarde.' };
  }
}

// This is a server component - no 'use client' directive
export default async function ProductsPage() {
  // Check if user is authenticated
  const user = await getUserData();

  // Check if user exists before accessing its properties
  if (!user || user.isAuthenticated === false) {
    return <LoginPrompt />;
  }

  // Get the user's country from their profile
  const userCountry = user.userData?.country || null;

  // Fetch products with country-specific pricing if available
  const productsResult = await getProducts(userCountry);

  // Check if there was an error fetching products
  if (productsResult.error) {
    return (
      <ProductsPageClient 
        products={[]} 
        userCountry={userCountry}
        error={productsResult.error}
      />
    );
  }

  // Render the client component with the products data
  return (
    <ProductsPageClient 
      products={productsResult} 
      userCountry={userCountry}
      error={null}
    />
  );
}