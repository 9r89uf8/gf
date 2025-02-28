import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";

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

    // Ensure the user's country is provided
    if (!userData || !userData.country) {
        return NextResponse.json({ error: "User country is not provided." }, { status: 400 });
    }

    const origin = process.env.NODE_ENV === 'production'
        ? 'https://www.noviachat.com'
        : 'http://localhost:3000';

    const membershipDoc = await adminDb.firestore().collection('membership').doc('aux7IacA81ktapWe1hrr').get();
    const membershipData = membershipDoc.data();

    let currency, fPrice, locale;
    switch (userData.country) {
        case 'US':
            currency = 'usd';
            fPrice = membershipData.priceUSD;
            break;
        case 'MX':
            currency = 'mxn';
            fPrice = membershipData.priceMXN;
            break;
        case 'AR':
            currency = 'ars';
            fPrice = membershipData.priceARN;
            break;
        case 'CO': // Colombia
            currency = 'cop';
            fPrice = membershipData.priceCOP;
            break;
        case 'PE': // Peru
            currency = 'pen';
            fPrice = membershipData.pricePEN;
            break;
        case 'ES': // Spain
            currency = 'eur';
            fPrice = membershipData.priceEUR;
            break;
        default:
            return NextResponse.json({ error: `Country ${userData.country} is not supported.` }, { status: 400 });
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
                        unit_amount: fPrice * 100,
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
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


