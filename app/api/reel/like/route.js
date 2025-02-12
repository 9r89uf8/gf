// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const { postId } = await req.json();

        // Reference to the specific post document
        const postRef = adminDb.firestore().collection('reels').doc(postId);

        // Transaction to ensure atomic update
        await adminDb.firestore().runTransaction(async (transaction) => {
            const postDoc = await transaction.get(postRef);

            if (!postDoc.exists) {
                throw new Error('Post not found');
            }

            let likes = postDoc.data().likes || [];

            // Check if the user has already liked the post
            if (likes.includes(userId)) {
                // User has liked the post, so remove their like
                likes = likes.filter(id => id !== userId);
            } else {
                // User hasn't liked the post, so add their like
                likes.push(userId);
            }

            transaction.update(postRef, { likes: likes });
        });

        // Fetch the updated post
        const updatedPostDoc = await postRef.get();
        const updatedPostData = { id: updatedPostDoc.id, ...updatedPostDoc.data() };

        return new Response(JSON.stringify(updatedPostData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}