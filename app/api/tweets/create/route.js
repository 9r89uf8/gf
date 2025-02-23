// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;


export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { girlId, text } = await req.json();



        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const tweetRecord = {
            girlId: girlId,
            text: text,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        };

        // Save the post to Firestore
        const tweetRef = await adminDb.firestore().collection('tweet').add(tweetRecord);

        return new Response(JSON.stringify({
            id: tweetRef.id,
            ...tweetRecord,}), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}