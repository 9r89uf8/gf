// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";

import {NextResponse} from "next/server";


export const dynamic = 'force-dynamic';


export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        const formData = await req.formData();
        const description = formData.get('description');
        const premium = formData.get('premium');
        const file = formData.get('image');
        const girlId = formData.get('girlId');

        let isPremium = premium === 'true'
        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const postRecord = {
            description,
            isPremium: isPremium,
            girlId,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        };



        const fileKey = formData.get('fileKey');
        // Then store fileKey in your post record, e.g.:
        // Extract the extension from the fileKey
        const extension = fileKey.split('.').pop().toLowerCase();
        let mediaType = null;

        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            mediaType = 'image';
        } else if (['mp4', 'mov', 'avi'].includes(extension)) {
            mediaType = 'video';
        }

        // Then add to your postRecord
        if (mediaType === 'image') {
            postRecord.image = fileKey;
        } else if (mediaType === 'video') {
            postRecord.video = fileKey;
        }
        postRecord.mediaType = mediaType;

        let postRef
        if(postRecord.image){
            // Save the post to Firestore
            postRef = await adminDb.firestore().collection('pictures').add(postRecord);
        }else {
            // Save the post to Firestore
            postRef = await adminDb.firestore().collection('videos').add(postRecord);
        }


        return new Response(JSON.stringify({
            id: postRef.id,
            ...postRecord,}), {
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