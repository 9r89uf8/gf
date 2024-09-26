// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import {uploadToFirebaseStorage} from "@/app/middleware/firebaseStorage";
import { v4 as uuidv4 } from "uuid";
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const axios = require("axios");
const fs = require("fs");



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
        // await authMiddleware(req);
        const formData = await req.formData();
        const premium = formData.get('premium');
        const description = formData.get('description');
        const file = formData.get('image');

        const girlDoc = await adminDb.firestore().collection('girls').doc('01uIfxE3VRIbrIygbr2Q').get();
        const girlData = girlDoc.data();

        const postRecord = {
            girlName:girlData.name,
            girlId: '01uIfxE3VRIbrIygbr2Q',
            girlPicUrl: girlData.picture,
            description,
            likes: [],
            likesAmount: Math.floor(Math.random() * (30000 - 14000 + 1)) + 14000,
            isPremium: premium,
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


        // Save the post to Firestore
        const postRef = await adminDb.firestore().collection('posts').add(postRecord);

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