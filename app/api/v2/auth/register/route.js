// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseClient';
import { cookies } from "next/headers";
import { getAuthRateLimiters } from '../../middleware/rateLimiter.js';
import { getAuthErrorMessage } from '@/app/utils/authErrorMessages';

async function registerHandler(req) {
    // Apply rate limiting
    const rateLimiters = await getAuthRateLimiters();
    const rateLimitResponse = await rateLimiters.register(req);
    if (rateLimitResponse) return rateLimitResponse;
    
    const { email, password, username, country, turnstileToken } = await req.json();

    try {
        // Verify the turnstile token
        const verificationResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken,
                }),
            }
        );

        const verification = await verificationResponse.json();
        if (!verification.success) {
            return new Response(JSON.stringify({ error: 'Invalid CAPTCHA' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Server-side validation in your API route
        function isValidEmail(email) {
            // Use a more sophisticated regex or validation library
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                !email.endsWith('.ru') && // Block common spam domains
                !email.endsWith('.xyz');  // Add more as needed
        }

// Check username for patterns used by bots
        function isLikelyBot(username) {
            // Check for patterns like random strings, repeated characters, etc.
            return /^[a-zA-Z0-9]{8}$/.test(username) ||
                /(.)\1{4,}/.test(username);
        }

// In your register handler
        if (!isValidEmail(email) || isLikelyBot(username)) {
            return new Response(JSON.stringify({ 
                error: 'Registro inválido. Por favor, verifica tus datos.',
                errorCode: 'invalid-registration'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        // Create the user in Firebase Authentication
        const userRecord = await adminAuth.createUser({
            email,
            password,
        });

        // Rest of your existing code...
        await adminDb.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            profilePic: null,
            country,
            premium: false,
            name: username,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        });

        // Sign in the user to get the ID token
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // Set the session duration (e.g., 48 hours)
        const expiresIn = 48 * 60 * 60 * 1000; // in milliseconds

        // Create a session cookie with the specified expiration time
        const sessionCookie = await adminDb.auth().createSessionCookie(idToken, { expiresIn });

        // Fetch the saved user document from Firestore
        const userDoc = await adminDb.firestore().collection('users').doc(userRecord.uid).get();
        const userData = userDoc.data();

        // Set the token in an httpOnly cookie
        const cookieStore = cookies();
        cookieStore.set('tokenAIGF', sessionCookie, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: expiresIn / 1000, // Convert to seconds
        });

        return new Response(JSON.stringify({ user: userData }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Register error:', error.code || error.message);
        
        // Get user-friendly error message
        const userMessage = getAuthErrorMessage(error.code || error.message);
        
        // Return structured error response
        return new Response(JSON.stringify({ 
            error: userMessage,
            errorCode: error.code || 'unknown'
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export const POST = registerHandler
