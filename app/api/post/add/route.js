// app/api/post/add/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const formData = await req.formData();
        const premium = formData.get('premium');
        const description = formData.get('description');
        const girlId = formData.get('girlId');
        const fileKey = formData.get('fileKey'); // Get the file key instead of the file
        const fileUrl = formData.get('fileUrl'); // Get the file URL

        let isPremium = premium === 'true';

        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlData = girlDoc.data();

        const postRecord = {
            girlName: girlData.name,
            girlUsername: girlData.username,
            girlId: girlId,
            girlPicUrl: girlData.picture,
            description,
            likes: [],
            likesAmount: Math.floor(Math.random() * (30000 - 14000 + 1)) + 14000,
            isPremium: isPremium,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        };

        // If we have a file key and URL, add them to the post record
        if (fileKey) {
            if (fileKey.includes('.mp4')) {
                postRecord.video = fileKey;
            } else {
                postRecord.image = fileKey;
            }
        }

        // Save the post to Firestore
        const postRef = await adminDb.firestore().collection('posts').add(postRecord);

        return NextResponse.json({
            id: postRef.id,
            ...postRecord,
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}