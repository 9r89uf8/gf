import { NextResponse } from 'next/server';
import { getNewsByCountry, getAllNews } from '@/app/api/v2/services/newsService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    let result;

    if (country) {
      // Get news for specific country
      result = await getNewsByCountry(country);
    } else {
      // Get all news
      result = await getAllNews();
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data
    });

  } catch (error) {
    console.error('Error in news get endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get news',
        message: error.message 
      },
      { status: 500 }
    );
  }
}