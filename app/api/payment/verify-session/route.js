//verify-session
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


            const userRef = adminDb.firestore().collection('users').doc(userId);


            const membershipDoc = await adminDb.firestore().collection('membership').doc('aux7IacA81ktapWe1hrr').get();


            const membershipData = membershipDoc.data();

            const timestamp = adminDb.firestore.Timestamp;
            // Generate a timestamp with an additional 20 days
            const currentTimestamp = new Date();
            const expirationTimestamp = addDays(currentTimestamp, membershipData.duration);

            await userRef.update({
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


            return new Response(JSON.stringify({user: userData, success: true}), {
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
