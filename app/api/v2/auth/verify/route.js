// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { getAuthRateLimiters } from '../../middleware/rateLimiter.js';

export const dynamic = 'force-dynamic';

async function authCheckHandler(req) {
    // Apply rate limiting
    const rateLimiters = await getAuthRateLimiters();
    const rateLimitResponse = await rateLimiters.verify(req);
    if (rateLimitResponse) return rateLimitResponse;
    
    try {
        const authResult = await authMiddleware(req);
        let isAuthenticated = authResult.authenticated;

        // If not authenticated at middleware level, return early
        if (!isAuthenticated) {
            return NextResponse.json({
                isAuthenticated: false,
                message: 'User not authenticated'
            }, { status: 401 });
        }
        const userRef = adminDb.firestore().collection('users').doc(authResult.user.uid);
        const userDoc = await userRef.get();
        if (!userDoc.exists) {
            // Return 401 Unauthorized instead of throwing an error
            return NextResponse.json({
                isAuthenticated: false,
                message: 'User not found in database'
            }, { status: 401 });
        }

        const userData = userDoc.data();

        return NextResponse.json({ isAuthenticated, userData }, { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}


export const GET = authCheckHandler