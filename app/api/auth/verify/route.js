// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import {authMiddleware} from "@/app/middleware/authMiddleware";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {

        const authResult = await authMiddleware(req);

        let isAuthenticated = authResult.authenticated

        return NextResponse.json({ isAuthenticated}, { status: 200 });
    } catch (error) {
        console.log(error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}