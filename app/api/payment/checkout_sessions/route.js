import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/utils/firebaseAdmin';
import {authMiddleware} from "@/app/middleware/authMiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

export async function POST(req) {
    const authResult = await authMiddleware(req);
    if (!authResult.authenticated) {
        return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const userId = authResult.user.uid;
    const userDoc = await adminDb.firestore().collection('users').doc(userId).get();


    const userData = userDoc.data();

    const origin = process.env.NODE_ENV==='production'?'https://www.noviachat.com':'http://localhost:3000'; // Default to localhost for development


    const membershipDoc = await adminDb.firestore().collection('membership').doc('aux7IacA81ktapWe1hrr').get();


    const membershipData = membershipDoc.data();


    let currency, fPrice, locale;
    switch (userData.country) {
        case 'US':
            currency = 'usd';
            fPrice = membershipData.priceUSD;
            locale = 'en'; // Locale for the United States
            break;
        case 'MX':
            currency = 'mxn';
            fPrice = membershipData.priceMXN;
            locale = 'es-419'; // Locale for Mexico
            break;
        case 'AR':
            currency = 'ars';
            fPrice = membershipData.priceARN;
            locale = 'es-419'; // Locale for Mexico
            break;
        default:
            currency = 'usd';
            fPrice = membershipData.priceUSD;
            locale = 'en'; // Default locale
    }

    try {
        const params = {
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: 'Noviachat',
                        },
                        unit_amount: fPrice*100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            locale: locale,
            metadata: { userId: userId },
            success_url: `${origin}/payment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);


        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

