// app/api/login/route.js
import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseClient';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { cookies } from 'next/headers';
import { getAuthRateLimiters } from '../../middleware/rateLimiter.js';
import { getAuthErrorMessage } from '@/app/utils/authErrorMessages';


export async function loginHandler(request) {
    // Apply rate limiting
    const rateLimiters = await getAuthRateLimiters();
    const rateLimitResponse = await rateLimiters.login(request);
    if (rateLimitResponse) return rateLimitResponse;
    
    const { email, password, turnstileToken } = await request.json();

    try {
        // Verify the turnstile token
        // const verificationResponse = await fetch(
        //     'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        //     {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({
        //             secret: process.env.TURNSTILE_SECRET_KEY,
        //             response: turnstileToken,
        //         }),
        //     }
        // );
        //
        // const verification = await verificationResponse.json();
        // if (!verification.success) {
        //     return new Response(JSON.stringify({ error: 'Invalid CAPTCHA' }), {
        //         status: 400,
        //         headers: { 'Content-Type': 'application/json' },
        //     });
        // }

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        // Set the session duration (e.g., 48 hours)
        const expiresIn = 48 * 60 * 60 * 1000; // in milliseconds

        // Create a session cookie with the specified expiration time
        const sessionCookie = await adminDb.auth().createSessionCookie(token, { expiresIn });

        // Reference to the user document
        const userRef = adminDb.firestore().collection('users').doc(userCredential.user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User not found in Firestore');
        }

        const userData = userDoc.data();

        // Check premium status and expiration
        if (userData.premium && userData.payments) {
            // Get the latest payment with expiration date
            const latestPayment = userData.payments
                .filter(p => p.expiresAt)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            if (latestPayment && new Date() > new Date(latestPayment.expiresAt)) {
                // Premium has expired, update the user document
                await userRef.update({
                    premium: false,
                    expired: true
                });

                // Get all girls to reset conversation limits
                const girlsSnapshot = await adminDb
                    .firestore()
                    .collection('girls')
                    .orderBy('priority', 'desc')
                    .get();

                const girls = [];
                girlsSnapshot.forEach(doc => {
                    girls.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });

                // Reset conversation limits for all girls
                const conversationUpdates = [];
                for (const girl of girls) {
                    const conversationId = `${userCredential.user.uid}_${girl.id}`;
                    const conversationRef = adminDb.firestore().collection('conversations').doc(conversationId);

                    // Check if conversation exists
                    const conversationDoc = await conversationRef.get();

                    if (conversationDoc.exists) {
                        // Reset to free tier limits
                        conversationUpdates.push(
                            conversationRef.update({
                                freeMessages: 3,
                                freeAudio: 0,
                                freeImages: 0,
                                updatedAt: new Date()
                            })
                        );
                    }
                }

                // Execute all conversation updates
                await Promise.all(conversationUpdates);

                console.log(`Premium expired for user ${userCredential.user.uid}, reset ${conversationUpdates.length} conversations to free limits`);

                // Update the local userData object to reflect these changes
                userData.premium = false;
                userData.expired = true;
            }
        }
        // Set the token in an httpOnly cookie
        const cookieStore = cookies();
        cookieStore.set('tokenAIGF', sessionCookie, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn / 1000, // Convert to seconds
        });

        return new Response(JSON.stringify({ user: userData, token }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Login error:', error.code || error.message);
        
        // Get user-friendly error message
        const userMessage = getAuthErrorMessage(error.code || error.message);
        
        // Return structured error response
        return NextResponse.json({ 
            error: userMessage,
            errorCode: error.code || 'unknown'
        }, { status: 401 });
    }
}

export const POST = loginHandler
