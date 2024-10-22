// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

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

// Updated uploadToS3 function to support audio files
const uploadToS3 = async (file, fileName) => {
    const supportedTypes = {
        'video/mp4': '.mp4',
        'image/jpeg': '.jpeg',
        'image/png': '.png',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/m4a': '.m4a',
    };

    const extension = supportedTypes[file.type];
    if (!extension) {
        throw new Error(`File type not supported: ${file.type}`);
    }

    const buffer = await file.arrayBuffer();
    const params = {
        Bucket: 'finaltw',
        Key: `${fileName}${extension}`,
        Body: Buffer.from(buffer),
        ACL: 'private', // Set to 'public-read' to allow public access
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
        const name = formData.get('name');
        const country = formData.get('country');
        const isPrivate = formData.get('private');
        const audioId = formData.get('audioId');
        const bio = formData.get('bio');
        const file = formData.get('image');
        const fileBackground = formData.get('background');
        const priority = formData.get('priority'); // Get priority from formData
        const audioFiles = formData.getAll('audios[]'); // Get all uploaded audio files

        const fullName = formData.get('fullName');
        const birthDate = formData.get('birthDate');
        const brothers = formData.get('brothers');
        const instagram = formData.get('instagram');
        const mom = formData.get('mom');
        const dad = formData.get('dad');
        const sexActivity = formData.get('sexActivity');
        const sexHistory = formData.get('sexHistory');
        const sexStory = formData.get('sexStory');


        let userId = authResult.user.uid;
        let isPrivateF = isPrivate === 'true';

        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const girlsCollection = adminDb.firestore().collection('girls');

        // Create the girl record with added 'priority' field
        let girlRecord = {
            username: username.toLowerCase(),
            name: name.toLowerCase(),
            private: isPrivateF,
            fullName,
            birthDate,
            instagram,
            isActive: true,
            girlOfflineUntil: null,
            lastSeenGirl: null,
            brothers,
            mom,
            dad,
            sexActivity,
            sexHistory,
            sexStory,
            audioId,
            age,
            followers: [],
            followersCount: Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000,
            country,
            bio,
            priority: parseInt(priority),
        };

        // Handle image upload
        if (file) {
            const fileName = uuidv4();
            const fileType = file.type.split('/')[1]
            const imageUrl = await uploadToS3(file, fileName);
            girlRecord.picture = `${fileName}.${fileType}`;
        }

        // Handle background image upload
        if (fileBackground) {
            const fileName = uuidv4();
            const fileType = fileBackground.type.split('/')[1]
            const imageUrl = await uploadToS3(fileBackground, fileName);
            girlRecord.background = `${fileName}.${fileType}`;
        }

        // Handle multiple audio file uploads
        if (audioFiles && audioFiles.length > 0) {
            let audioFileUrls = [];
            for (const audioFile of audioFiles) {
                const fileName = uuidv4();
                const audioUrl = await uploadToS3(audioFile, fileName);
                audioFileUrls.push(`${fileName}.mp3`);
            }
            girlRecord.audioFiles = audioFileUrls; // Add audio URLs to the record
        }

        const newGirlRef = await girlsCollection.add(girlRecord);

        return NextResponse.json({
            id: newGirlRef.id,
            ...girlRecord,
        }, { status: 201 });
    } catch (error) {
        console.error('Error adding new girl:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
