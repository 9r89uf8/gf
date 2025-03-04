// app/api/s3upload/route.js
import { adminAuth } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const dynamic = 'force-dynamic';

// Set the AWS region
const REGION = "us-east-2";

// Create an Amazon S3 service client object
const s3Client = new S3Client({
    region: REGION,
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    }
});

export async function POST(req) {
    try {
        // Authenticate the request
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;

        // Check if the user is admin (use your own authorization logic)
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get file info from request
        const data = await req.json();
        const { fileType } = data;

        // Determine file extension
        let extension;
        if (fileType === 'video/mp4') extension = '.mp4';
        else if (fileType === 'image/jpeg') extension = '.jpeg';
        else if (fileType === 'image/png') extension = '.png';
        else {
            return NextResponse.json({ error: 'File type not supported' }, { status: 400 });
        }

        // Generate unique filename
        const fileName = uuidv4();
        const key = `${fileName}${extension}`;

        // Create the parameters for the PutObject operation
        const params = {
            Bucket: 'finaltw',
            Key: key,
            ContentType: fileType,
            ACL: 'private',
        };

        // Generate the pre-signed URL
        const command = new PutObjectCommand(params);
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // URL expires in 1 hour

        return NextResponse.json({
            url,
            fileName: key,
            fileUrl: `https://finaltw.s3.amazonaws.com/${key}`
        });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}