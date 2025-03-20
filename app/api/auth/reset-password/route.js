import { NextResponse } from 'next/server';
import { adminAuth } from "@/app/utils/firebaseAdmin";
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { withRateLimit } from '@/app/utils/withRateLimit';

const DOMAIN = "noviachat.com";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API });



export async function resetHandler(req) {
    const { email } = await req.json();

    try {
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

// Apply rate limiting - 3 registrations per hour from the same IP
export const POST = withRateLimit(resetHandler, {
    name: 'auth:reset',
    limit: process.env.NODE_ENV === 'production' ? 3 : 100, // Higher limit in dev
    windowMs: 60 * 60 * 1000, // 1 hour
    enforceInDevelopment: false // Set to true if you want to test rate limiting locally
});
