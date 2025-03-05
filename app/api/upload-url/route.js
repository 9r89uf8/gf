// app/api/upload-url/route.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const REGION = process.env.AWS_REGION; // e.g. 'us-east-2'
const BUCKET = process.env.AWS_BUCKET_NAME;

const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
});

export async function POST(request) {
    try {
        const { fileType } = await request.json();
        // Generate a unique file name
        const fileId = uuidv4();
        // Derive an extension from the fileType (simple example)
        const extension = fileType.split('/')[1];
        const key = `${fileId}.${extension}`;

        // Create the command
        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            ContentType: fileType,
        });

        // Generate a pre-signed URL valid for 60 seconds
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        return new Response(
            JSON.stringify({ signedUrl, key }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
