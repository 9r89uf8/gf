import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/utils/firebaseAdmin';
const { addDays } = require('date-fns');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

export async function POST(req) {
    const { session_id } = await req.json();

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const userId = session.metadata.userId;


            // After successful update of quinielas, update the user's quinielas amount
            const userRef = adminDb.firestore().collection('users').doc(userId);
            // Update user's quinielas amount to the length of the updated quinielas

            const timestamp = adminDb.firestore.Timestamp;
            // Generate a timestamp with an additional two days
            const currentTimestamp = new Date();
            const expirationTimestamp = addDays(currentTimestamp, 15);

            await userRef.update({
                freeMessages: 1000,
                freeAudio: 50,
                premium: true,
                expired: false,
                expirationDate: timestamp.fromDate(expirationTimestamp)
            });



            const userDoc = await adminDb
                .firestore()
                .collection('users')
                .doc(userId)
                .get();


            const userData = userDoc.data();



            return new Response(JSON.stringify(userData), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return NextResponse.json({ success: false });
        }
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
