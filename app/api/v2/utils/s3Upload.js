import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

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

// Upload to S3 function that supports audio files
export const uploadToS3 = async (file, fileName) => {
    const supportedTypes = {
        'video/mp4': '.mp4',
        'image/jpeg': '.jpeg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav',
        'audio/ogg': '.ogg',
        'audio/m4a': '.m4a',
        'audio/x-m4a': '.m4a',
        'audio/webm': '.webm',
    };

    const extension = supportedTypes[file.type] || '';
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

// Upload multiple audio files
export const uploadAudioFilesToS3 = async (audioFiles) => {
    if (!audioFiles || audioFiles.length === 0) {
        return [];
    }

    const audioFileUrls = [];
    
    for (const audioFile of audioFiles) {
        const fileName = uuidv4();
        const audioUrl = await uploadToS3(audioFile, fileName);
        // Store just the filename with extension for the database
        const extension = audioUrl.split('.').pop();
        audioFileUrls.push(`${fileName}.${extension}`);
    }
    
    return audioFileUrls;
};