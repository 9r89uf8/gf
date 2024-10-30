// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import {uploadToFirebaseStorage} from "@/app/middleware/firebaseStorage";
import { v4 as uuidv4 } from "uuid";
import {NextResponse} from "next/server";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
const fs = require("fs");

export const dynamic = 'force-dynamic';

// Set the AWS region
const REGION = "us-east-2"; // e.g. "us-east-1"

// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION, credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    }});

const uploadToS3 = (file, fileName) => {
    return new Promise(async (resolve, reject) => {
        let extension;
        if (file.type === 'video/mp4') extension = '.mp4';
        else if (file.type === 'image/jpeg') extension = '.jpeg';
        else if (file.type === 'image/png') extension = '.png';
        // Add other mimetypes here as necessary...

        // Check if extension was determined, reject if not
        if (!extension) {
            reject(new Error('File type not supported'));
            return;
        }

        const buffer = await file.arrayBuffer();
        const params = {
            Bucket: 'finaltw',
            Key: `${fileName}${extension}`,
            Body: Buffer.from(buffer),
            ACL: 'private',
            ContentType: file.type,
        };

        s3Client.send(new PutObjectCommand(params))
            .then(() => {
                resolve(`https://finaltw.s3.amazonaws.com/${fileName}${extension}`);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

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



        let fileUrl = null;
        if (file) {
            const fileName = uuidv4();
            const fileType = file.type.split('/')[1]; // Assuming the mimetype is something like 'video/mp4'


            const url = await uploadToS3(file, fileName);

            if (file.type.startsWith('image/')) {
                postRecord.image = `${fileName}.${fileType}`;
            } else if (file.type.startsWith('video/')) {
                postRecord.video = `${fileName}.${fileType}`;
            }
        }

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