// app/api/auth/register/route.js
import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { uploadToFirebaseStorage } from "@/app/middleware/firebaseStorage";
import { RekognitionClient, DetectModerationLabelsCommand, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { v4 as uuidv4 } from "uuid";
import {NextResponse} from "next/server";
export const dynamic = 'force-dynamic';

// Initialize the Rekognition client with credentials from environment variables
const rekognitionClient = new RekognitionClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
});

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const id = authResult.user.uid;
        const formData = await req.formData();
        const email = formData.get('email');
        const name = formData.get('name');
        const file = formData.get('image');

        // Update the user's email in Firebase Authentication
        await adminAuth.updateUser(id, { email });

        // Prepare the update data
        const updatedData = {
            email,
            name
        };

        // Handle file upload if a new image is provided
        if (file) {
            const fileExtension = file.type.split('/')[1];
            const filePath = `users-profile/${uuidv4()}.${fileExtension}`;

            // Convert the file to a buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            let newUserMessage = ''
            const moderationParams = {
                Image: { Bytes: buffer },
                MinConfidence: 75 // You can adjust the confidence threshold as needed
            };
            let moderationCommand = new DetectModerationLabelsCommand(moderationParams);
            let moderationResponse = await rekognitionClient.send(moderationCommand);

            if(moderationResponse.ModerationLabels.length===0){
                const params = {
                    Image: {
                        Bytes: buffer ,
                    },
                    MaxLabels: 10,       // Adjust as needed
                    MinConfidence: 70,   // Adjust as needed
                };
                let moderationCommand = new DetectLabelsCommand(params);
                let moderationResponse = await rekognitionClient.send(moderationCommand);
                function buildPrompt(labels) {
                    let prompt = "The User has a profile image. The image has the following labels:\n\nLabels:\n";
                    labels.forEach(label => {
                        prompt += `- ${label.Name} (Confidence: ${label.Confidence}%)\n`;
                    });
                    prompt += "\nBased on these labels, you can figure out what image subject is. " +
                        "The goal is for you to know what the User has as their image profile.";
                    return prompt;
                }
                let finalImageString = buildPrompt(moderationResponse.Labels);

                newUserMessage = finalImageString
            }
            if (
                moderationResponse.ModerationLabels.some(label =>
                    ['Explicit', 'Exposed Male Genitalia', 'Explicit Sexual Activity'].includes(label.Name)
                )
            ) {
                newUserMessage = 'La foto de perfil del User aparece un pito parado.';
            }

            const fileUrl = await uploadToFirebaseStorage(buffer, filePath, file.mimetype);

            // Only add profilePic to updatedData if a new image was uploaded
            updatedData.profilePic = fileUrl;
            updatedData.profilePicDescription = newUserMessage;
        }

        // Update the user's information in Firestore
        const userRef = adminDb.firestore().collection('users').doc(id);
        await userRef.update(updatedData);

        // Retrieve the updated user data from Firestore
        const updatedUserDoc = await userRef.get();
        const updatedUserData = updatedUserDoc.data();

        return new Response(JSON.stringify(updatedUserData), {
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
