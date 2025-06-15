// app/api/addPost
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import {NextResponse} from "next/server";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


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

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlData = girlDoc.data();


        const postRecord = {
            girlName:girlData.name,
            girlUsername: girlData.username,
            girlId: girlId,
            girlPicUrl: girlData.pictureUrl,
            description,
            likes: [],
            likesAmount: Math.floor(Math.random() * (30000 - 14000 + 1)) + 14000,
            isPremium: isPremium,
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




        // Save the post to Firestore
        const postRef = await adminDb.firestore().collection('posts').add(postRecord);

        return new Response(JSON.stringify({
            id: postRef.id,
            ...postRecord,}), {
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