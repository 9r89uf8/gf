// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        // Check if the user is admin
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { pictureId } = await req.json();

        // Reference to the specific post document
        const postRef = adminDb.firestore().collection('pictures').doc(pictureId);

        // Get the post document
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }


        // Delete the post
        await postRef.delete();

        // Return the ID of the deleted post
        return NextResponse.json({ deletedPictureId: pictureId }, { status: 200 });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}