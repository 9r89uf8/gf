// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/utils/firebaseClient';
import {cookies} from "next/headers";

export async function POST(req) {
    const { email, password, username, phoneNumber, country } = await req.json();

    try {
        // Create the user in Firebase Authentication
        const userRecord = await adminAuth.createUser({
            email,
            password,
        });

        // Save user data to Firestore
        await adminDb.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            phone: phoneNumber,
            country,
            freeAudio: 2,
            freeMessages: 8,
            premium: false,
            name: username,
        });


        // Sign in the user to get the ID token
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();


        // Fetch the saved user document from Firestore
        const userDoc = await adminDb.firestore().collection('users').doc(userRecord.uid).get();
        const userData = userDoc.data();

        // Set the token in an httpOnly cookie
        const cookieStore = cookies();
        cookieStore.set('token', idToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600, // 1 hour
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
