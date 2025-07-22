import { NextResponse } from 'next/server';
import { adminAuth } from "@/app/utils/firebaseAdmin";
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { getAuthRateLimiters } from '../../middleware/rateLimiter.js';

const DOMAIN = "noviachat.com";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API });



export async function resetHandler(req) {
    // Apply rate limiting
    const rateLimiters = await getAuthRateLimiters();
    const rateLimitResponse = await rateLimiters.resetPassword(req);
    if (rateLimitResponse) return rateLimitResponse;
    
    const { email, turnstileToken} = await req.json();

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

        const passwordResetLink = await adminAuth.generatePasswordResetLink(email);

        const data = {
            from: "Nueva contraseña <mailgun@noviachat.com>",
            to: email,
            subject: 'Crear nueva contraseña',
            template: 'password',
            'h:X-Mailgun-Variables': JSON.stringify({ passwordResetLink }),
        };

        await mg.messages.create(DOMAIN, data);

        return NextResponse.json({ message: 'Correo electrónico de restablecimiento de contraseña enviado.' });
    } catch (error) {
        console.log(error.message)
        return NextResponse.json({ message: 'Failed to send password reset email.' }, { status: 500 });
    }
}


export const POST = resetHandler
