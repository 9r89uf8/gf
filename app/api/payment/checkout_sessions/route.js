import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/app/utils/firebaseAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

export async function POST(req) {
    const { userId, country} = await req.json();
    const origin = process.env.NODE_ENV==='production'?'https://www.quinielasligamx.com':'http://localhost:3000'; // Default to localhost for development


    const girlDoc = await adminDb.firestore().collection('girls').doc('01uIfxE3VRIbrIygbr2Q').get();


    const girlData = girlDoc.data();


    let currency, fPrice, locale;
    switch (country) {
        case 'US':
            currency = 'usd';
            fPrice = girlData.memberPrice;
            locale = 'en'; // Locale for the United States
            break;
        case 'MX':
            currency = 'mxn';
            fPrice = girlData.memberPrice * 15;
            locale = 'es-419'; // Locale for Mexico
            break;
        default:
            currency = 'usd';
            fPrice = girlData.memberPrice;
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
                            name: 'novia virtual',
                        },
                        unit_amount: fPrice*100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            locale: locale,
            metadata: { userId: userId },
            success_url: `${origin}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/result?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);


        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

