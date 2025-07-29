import { NextResponse } from 'next/server';
import { fetchNewsForCountry } from '@/app/api/v2/services/newsService';
import { authMiddleware } from "@/app/middleware/authMiddleware";

export async function POST(request) {
  try {
    // Authenticate user
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { user } = authResult;
    const body = await request.json();
    
    // Validate country parameter
    const { country } = body;
    if (!country) {
      return NextResponse.json(
        { error: 'Country parameter is required' },
        { status: 400 }
      );
    }

    // Check if user is admin (you might want to add an admin check here)
    // For now, we'll allow any authenticated user to fetch news
    // In production, you should restrict this to admins only

    console.log(`Fetching news for ${country} requested by user: ${user.uid}`);

    // Fetch news from X.AI for specific country
    const result = await fetchNewsForCountry(country, user.uid);

    return NextResponse.json({
      success: true,
      message: 'News fetched successfully',
      data: result.data,
      timestamp: result.timestamp
    });

  } catch (error) {
    console.error('Error in news fetch endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch news',
        message: error.message 
      },
      { status: 500 }
    );
  }
}