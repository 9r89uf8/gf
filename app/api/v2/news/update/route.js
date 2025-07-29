import { NextResponse } from 'next/server';
import { updateNewsText } from '@/app/api/v2/services/newsService';
import { authMiddleware } from "@/app/middleware/authMiddleware";

export async function PUT(request) {
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

    // Validate request body
    const { country, newsText } = body;

    if (!country || typeof newsText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request body. Required: country, newsText' },
        { status: 400 }
      );
    }

    // Update news in Firebase
    const result = await updateNewsText(country, newsText, user.uid);

    return NextResponse.json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('Error in news update endpoint:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update news',
        message: error.message 
      },
      { status: 500 }
    );
  }
}