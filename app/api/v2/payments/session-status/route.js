import { NextResponse } from 'next/server';
import { retrieveCheckoutSession } from '../../services/stripeService';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Retrieve session details
    const sessionDetails = await retrieveCheckoutSession(sessionId);

    return NextResponse.json({
      status: 'success',
      session: sessionDetails,
    });
  } catch (error) {
    console.error('Error in session-status endpoint:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve session status' },
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