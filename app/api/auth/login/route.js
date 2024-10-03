// app/api/login/route.js
import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseClient';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(request) {
    const { email, password } = await request.json();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        // Set the session duration (e.g., 48 hours)
        const expiresIn = 48 * 60 * 60 * 1000; // in milliseconds

        // Create a session cookie with the specified expiration time
        const sessionCookie = await adminDb.auth().createSessionCookie(token, { expiresIn });

        // Fetch the user document from Firestore
        const userDoc = await adminDb.firestore().collection('users').doc(userCredential.user.uid).get();

        if (!userDoc.exists) {
            throw new Error('User not found in Firestore');
        }

        const userData = userDoc.data();
        // Set the token in an httpOnly cookie
        const cookieStore = cookies();
        cookieStore.set('token', sessionCookie, {
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
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
