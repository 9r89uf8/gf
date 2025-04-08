// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

// Cloudflare configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CLOUDFLARE_ACCOUNT_HASH = process.env.CLOUDFLARE_ACCOUNT_HASH;
const CLOUDFLARE_IMAGES_BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2`;
const CLOUDFLARE_IMAGE_DELIVERY_URL = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}`;

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

// Function to get a one-time upload URL from Cloudflare
const getCloudflareUploadURL = async (metadata = {}) => {
    try {
        // Create a FormData object for the multipart/form-data request
        const formData = new FormData();
        formData.append('requireSignedURLs', 'false');
        formData.append('metadata', JSON.stringify(metadata));

        const response = await fetch(`${CLOUDFLARE_IMAGES_BASE_URL}/direct_upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
                // Don't set Content-Type - fetch will automatically set it with boundary for FormData
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to get Cloudflare upload URL: ${JSON.stringify(error)}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error getting Cloudflare upload URL:', error);
        throw error;
    }
};

// Function to upload an image to Cloudflare Images
const uploadToCloudflare = async (file, metadata = {}) => {
    try {
        // Check if file is an image
        const supportedImageTypes = {
            'image/jpeg': true,
            'image/png': true,
            'image/gif': true,
            'image/webp': true,
        };

        if (!supportedImageTypes[file.type]) {
            throw new Error(`File type not supported for Cloudflare Images: ${file.type}`);
        }

        // Get a one-time upload URL
        const uploadData = await getCloudflareUploadURL(metadata);

        // Upload the file directly to Cloudflare
        const buffer = await file.arrayBuffer();
        const formData = new FormData();
        formData.append('file', new Blob([buffer], { type: file.type }));

        const uploadResponse = await fetch(uploadData.uploadURL, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error(`Failed to upload to Cloudflare: ${uploadResponse.statusText}`);
        }

        // Return the image ID and constructed URL
        return {
            id: uploadData.id,
            url: `${CLOUDFLARE_IMAGE_DELIVERY_URL}/${uploadData.id}/public` // Using 'public' variant by default
        };
    } catch (error) {
        console.error('Error uploading to Cloudflare:', error);
        throw error;
    }
};

// Function to delete an image from Cloudflare
const deleteFromCloudflare = async (imageId) => {
    try {
        const response = await fetch(`${CLOUDFLARE_IMAGES_BASE_URL}/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to delete Cloudflare image: ${JSON.stringify(error)}`);
        }
    } catch (error) {
        console.error('Error deleting from Cloudflare:', error);
        throw error;
    }
};


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
    // Array to track resources that need cleanup if the operation fails
    const createdResources = [];
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

        // Handle profile image upload using Cloudflare Images
        if (file) {
            const imageResult = await uploadToCloudflare(file, { girlId, type: 'profile' });
            girlRecord.picture = imageResult.id; // Store the Cloudflare image ID
            girlRecord.pictureUrl = imageResult.url; // Store the constructed URL for easy access
            createdResources.push({ type: 'cloudflare', id: imageResult.id });
        }

        // Handle background image upload using Cloudflare Images
        if (fileBackground) {
            const imageResult = await uploadToCloudflare(fileBackground, { girlId, type: 'background' });
            girlRecord.background = imageResult.id; // Store the Cloudflare image ID
            girlRecord.backgroundUrl = imageResult.url; // Store the constructed URL for easy access
            createdResources.push({ type: 'cloudflare', id: imageResult.id });
        }

        // Update the girl record in the database
        await girlDoc.update(girlRecord);

        // Now update all posts related to this girl
        const postsSnapshot = await adminDb.firestore().collection('posts')
            .where('girlId', '==', girlId)
            .get();

        // Use a batch for atomic writes (each batch supports up to 500 writes)
        const batch = adminDb.firestore().batch();
        postsSnapshot.forEach((doc) => {
            const postRef = doc.ref;
            batch.update(postRef, {
                girlName: girlRecord.name,
                girlPicUrl: girlRecord.picture,
                girlUsername: girlRecord.username,
            });
        });
        await batch.commit();


        return NextResponse.json({
            id: girlDoc.id,
            ...girlRecord,
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating girl:', error.message);

        // Cleanup any created resources
        for (const resource of createdResources) {
            try {
                if (resource.type === 'cloudflare') {
                    await deleteFromCloudflare(resource.id);
                    console.log(`Cleaned up Cloudflare image ${resource.id}`);
                }
                // Add other resource cleanup as needed
            } catch (cleanupError) {
                console.error(`Error cleaning up resource ${resource.id}:`, cleanupError);
            }
        }

        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
