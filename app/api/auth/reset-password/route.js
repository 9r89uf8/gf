import { NextResponse } from 'next/server';
import { adminAuth } from "@/app/utils/firebaseAdmin";
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const DOMAIN = "quinielasligamx.com";
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API });



export async function POST(req) {
    const { email } = await req.json();

    try {
        const passwordResetLink = await adminAuth.generatePasswordResetLink(email);

        const data = {
            from: "Nueva contraseña <mailgun@quinielasligamx.com>",
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
