// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseClient';
import { cookies } from "next/headers";
import { withRateLimit } from '@/app/utils/withRateLimit';

async function registerHandler(req) {
    const { email, password, username, country } = await req.json();

    try {
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
            freeAudio: 3,
            freeImages: 1,
            freeMessages: 20,
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
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Apply rate limiting - 3 registrations per hour from the same IP
export const POST = withRateLimit(registerHandler, {
    name: 'auth:register',
    limit: process.env.NODE_ENV === 'production' ? 3 : 100, // Higher limit in dev
    windowMs: 60 * 60 * 1000, // 1 hour
    enforceInDevelopment: false // Set to true if you want to test rate limiting locally
});
