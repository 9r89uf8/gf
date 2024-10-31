// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

// Function to delete files from S3
const deleteFromS3 = async (fileUrl) => {
    // Extract the file key from the URL
    const fileKey = fileUrl.split('https://finaltw.s3.amazonaws.com/')[1];
    const params = {
        Bucket: 'finaltw',
        Key: fileKey,
    };
    await s3Client.send(new DeleteObjectCommand(params));
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
        const file = formData.get('image');
        const girlId = formData.get('girlId');
        const priority = formData.get('priority');
        const audios = formData.getAll('audios[]'); // Get all uploaded audio files
        const audioFilesToRemove = formData.getAll('audioFilesToRemove[]'); // Get audio files to remove
        const imagesEnabled = formData.get('imagesEnabled');
        const videosEnabled = formData.get('videosEnabled');
        const audioEnabled = formData.get('audioEnabled');
        const fullName = formData.get('fullName');
        const birthDate = formData.get('birthDate');
        const brothers = formData.get('brothers');
        const audioId = formData.get('audioId');
        const instagram = formData.get('instagram');
        const mom = formData.get('mom');
        const dad = formData.get('dad');
        const sexActivity = formData.get('sexActivity');
        const sexHistory = formData.get('sexHistory');
        const sexStory = formData.get('sexStory');
        const name = formData.get('name');
        const fileBackground = formData.get('background');

        let userId = authResult.user.uid;

        let isAudioEnabled = audioEnabled === 'true';
        let isImagesEnabled = imagesEnabled === 'true';
        let isVideosEnabled = videosEnabled === 'true';

        // Check if the user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const girlDoc = adminDb.firestore().collection('girls').doc(girlId);

        // Fetch the existing girl data
        const girlSnapshot = await girlDoc.get();
        if (!girlSnapshot.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }
        const girlData = girlSnapshot.data();

        // Prepare the updated girl record
        let girlRecord = {
            ...girlData, // Copy existing data
            username: username || girlData.username,
            age: age || girlData.age,
            country: country || girlData.country,
            bio: bio || girlData.bio,
            audioId: audioId,
            priority: parseInt(priority, 10) || girlData.priority || 1,
            fullName: fullName || girlData.fullName,
            background: fileBackground || girlData.background,
            birthDate: birthDate || girlData.birthDate,
            instagram: instagram || girlData.instagram,
            audioEnabled: isAudioEnabled,
            imagesEnabled: isImagesEnabled,
            videosEnabled: isVideosEnabled,
            brothers: brothers || girlData.brothers,
            mom: mom || girlData.mom,
            dad: dad || girlData.dad,
            sexActivity: sexActivity || girlData.sexActivity,
            sexHistory: sexHistory || girlData.sexHistory,
            sexStory: sexStory || girlData.sexStory,
            name: name || girlData.name
        };


        // Handle new audio files
        if (audios && audios.length > 0) {
            let newAudioUrls = [];
            for (const audioFile of audios) {
                const fileName = uuidv4();
                const audioUrl = await uploadToS3(audioFile, fileName);
                newAudioUrls.push(`${fileName}.mp3`);
            }
            // Append new audio URLs to existing ones
            girlRecord.audioFiles = (girlRecord.audioFiles || []).concat(newAudioUrls);
        }

        // Handle removal of existing audio files
        if (audioFilesToRemove && audioFilesToRemove.length > 0) {
            // for (const audioUrl of audioFilesToRemove) {
            //     await deleteFromS3(audioUrl);
            // }
            // Remove audio URLs from girlRecord.audioFiles
            girlRecord.audioFiles = (girlRecord.audioFiles || []).filter(url => !audioFilesToRemove.includes(url));
        }

        // Handle image upload
        if (file) {
            const fileName = uuidv4();
            const fileType = file.type.split('/')[1];
            const imageUrl = await uploadToS3(file, fileName);
            girlRecord.picture = `${fileName}.${fileType}`;
        }

        // Handle background image upload
        if (fileBackground) {
            const fileName = uuidv4();
            const fileType = fileBackground.type.split('/')[1];
            const imageUrl = await uploadToS3(fileBackground, fileName);
            girlRecord.background = `${fileName}.${fileType}`;
        }

        // Update the girl record in the database
        await girlDoc.update(girlRecord);

        return NextResponse.json({
            id: girlDoc.id,
            ...girlRecord,
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating girl:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
