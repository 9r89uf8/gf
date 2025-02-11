import {adminDb} from '@/app/utils/firebaseAdmin';
import { RekognitionClient, DetectModerationLabelsCommand, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import axios from 'axios';
import {uploadToFirebaseStorage} from "@/app/middleware/firebaseStorage";
import {determineOfflineStatus} from "@/app/utils/chat/girlOfflineHandler";
import OpenAI from "openai";
// Initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the Rekognition client with credentials from environment variables
const rekognitionClient = new RekognitionClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
});
const { DateTime } = require('luxon');

const {v4: uuidv4} = require("uuid");

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper function to validate file size and type
const validateFile = (file) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/quicktime'];
    const maxVideoSize = 10 * 1024 * 1024; // 10MB in bytes

    if (!file) return { valid: true }; // No file to validate

    const fileType = file.type;
    const fileSize = file.size;

    if (validImageTypes.includes(fileType)) {
        return { valid: true, type: 'image' };
    } else if (validVideoTypes.includes(fileType)) {
        if (fileSize > maxVideoSize) {
            return { valid: false, error: 'Video must be smaller than 10MB' };
        }
        return { valid: true, type: 'video' };
    }
    return { valid: false, error: 'Invalid file type. Please upload an image or video.' };
};

async function getOrCreateConversationHistory(doc) {
    if (doc.exists) {
        // Retrieve only user and assistant messages for display
        const messages = doc.data().messages.filter(message => message.role !== 'system');
        return messages;
    } else {
        // Return an empty array; system prompts will be added later for LLM processing
        return [];
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const userId = formData.get('userId');
        const girlId = formData.get('girlId');
        let userMessage = formData.get('userMessage');
        const media = formData.get('media');
        const mediaType = formData.get('mediaType');



        // Validate file if present
        if (media && mediaType !== 'audio') {
            const validation = validateFile(media);
            if (!validation.valid) {
                return new Response(JSON.stringify({ error: validation.error }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        // Handle audio transcription
        if (media && mediaType === 'audio') {
            try {
                // Create a temporary file path
                const audioBuffer = Buffer.from(await media.arrayBuffer());

                // Transcribe the audio
                const transcription = await openai.audio.transcriptions.create({
                    file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' }),
                    model: "whisper-1",
                });

                // Add transcription to user message
                userMessage = transcription.text;
            } catch (error) {
                console.error('Error transcribing audio:', error);
                return new Response(JSON.stringify({
                    error: 'Failed to transcribe audio message'
                }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }


        const userDocF = await adminDb.firestore()
            .collection('users')
            .doc(userId)
            .get();
        const userData = userDocF.data();

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlData = girlDoc.data();


        // Get the conversation history from Firestore
        const conversationRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId);

        let doc = await conversationRef.get();
        let conversationHistory = doc.exists ? doc.data().messages : await getOrCreateConversationHistory(doc, userData, girlData);



        // Handle media upload
        let mediaUrl = null;
        let mediaThumbnail = null;
        let newUserMessage = ''
        if (media) {
            const fileExtension = media.type.split('/')[1];
            const fileName = `${mediaType}-${uuidv4()}.${fileExtension}`;
            const filePath = `users-${mediaType}s/${fileName}`;

            // Convert the file to a buffer once
            const arrayBuffer = await media.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);


            // If the media is an image, run moderation via Rekognition
            if (mediaType === 'image') {
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
                        let prompt = "The User sent you an image. The image has the following labels:\n\nLabels:\n";
                        labels.forEach(label => {
                            prompt += `- ${label.Name} (Confidence: ${label.Confidence}%)\n`;
                        });
                        prompt += "\nBased on these labels, please provide a natural language description of the image. " +
                            "Describe the main subject. " +
                            "The goal is for you to know whats in the image so that the User knows you saw it.";
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
                    newUserMessage = 'Te acabo de mandar una foto de mi pito parado.';
                }


                // console.log('Rekognition Moderation Response:', moderationResponse.ModerationLabels[0]);
                // You can now use moderationResponse.ModerationLabels to decide further action,
                // e.g., flag the image or reject it if inappropriate content is found.
            }

            mediaUrl = await uploadToFirebaseStorage(buffer, filePath, media.type);


            // If it's a video, you might want to generate a thumbnail
            if (mediaType === 'video') {
                newUserMessage = 'Te acabo de mandar un video de mi pito parado.';
                // You would need to implement video thumbnail generation here
                // For now, we'll use a placeholder or skip it
                mediaThumbnail = null;
            }
        }

        // Add user's message to the conversation history
        conversationHistory.push({ role: 'user', content: mediaType==='image'?newUserMessage:mediaType==='video'?newUserMessage:userMessage });


        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');
        await displayMessageRef.add({
            role: 'user',
            content: mediaType==='image'?'':mediaType==='video'?'':userMessage,
            image: mediaUrl,
            mediaType: mediaType,
            liked: false,
            sent: true,
            seen: false,
            processed: false,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
        });

        // Save the updated conversation history back to Firestore
        // After adding the message to 'displayMessages'

        const currentDoc = await conversationRef.get();
        const currentOnlineStatus = currentDoc.exists ? currentDoc.data().isGirlOnline : null;

        // Create base update object
        const updateData = {
            messages: conversationHistory,
            lastMessage: {
                content: userMessage,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
                sender: 'user',
                mediaUrl: mediaUrl,
                mediaType: mediaType
            }
        };

        // Only check and update online status if currently online
        if (currentOnlineStatus) {
            const offlineStatus = await determineOfflineStatus(currentOnlineStatus, currentDoc.data());
            if (offlineStatus) {  // Add a null check
                updateData.isGirlOnline = offlineStatus.isGirlOnline;
                updateData.girlOfflineUntil = offlineStatus.girlOfflineUntil;
            }
        }

        await conversationRef.set(updateData, { merge: true });

        let updatedUserData;

        const userRef = adminDb.firestore().collection('users').doc(userId);
        await userRef.update({
            freeMessages: adminDb.firestore.FieldValue.increment(-1)
        });
        // Retrieve the updated user data from Firestore
        const updatedUserDoc = await userRef.get();
        updatedUserData = updatedUserDoc.data();


        return new Response(JSON.stringify({updatedUserData, girlName: girlData.name }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}