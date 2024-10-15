// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {NextResponse} from "next/server";

export const dynamic = 'force-dynamic';

// Set the AWS region
const REGION = "us-east-2";

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    }
});

const uploadToS3 = async (file, fileName) => {
    const supportedTypes = {
        'video/mp4': '.mp4',
        'image/jpeg': '.jpeg',
        'image/png': '.png'
    };

    const extension = supportedTypes[file.type];
    if (!extension) {
        throw new Error('File type not supported');
    }

    const buffer = await file.arrayBuffer();
    const params = {
        Bucket: 'finaltw',
        Key: `${fileName}${extension}`,
        Body: Buffer.from(buffer),
        ACL: 'private',
        ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));
    return `https://finaltw.s3.amazonaws.com/${fileName}${extension}`;
};

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const formData = await req.formData();
        const username = formData.get('username');
        const age = formData.get('age');
        const country = formData.get('country');
        const bio = formData.get('bio');
        const file = formData.get('picture');
        let userId = req.user.uid

        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const girlsCollection = adminDb.firestore().collection('girls');

        let girlRecord = {
            username,
            age,
            followers: [],
            followersCount:1000,
            country,
            bio
        };

        if (file) {
            const fileName = uuidv4();
            await uploadToS3(file, fileName);
            const fileType = file.type.split('/')[1]; // Assuming the mimetype is something like 'image/jpeg'
            girlRecord.picture = `${fileName}.${fileType}`;
        }

        const newGirlRef = await girlsCollection.add(girlRecord);

        return new Response(JSON.stringify({
            id: newGirlRef.id,
            ...girlRecord,
        }), {
            status: 201,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error adding new girl:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}