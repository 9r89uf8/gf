// app/api/v2/utils/messageHandlers.js
import OpenAI from "openai";
import { uploadToFirebaseStorage } from "@/app/middleware/firebaseStorage";
import { processImageWithRekognition } from './mediaProcessing';
const { v4: uuidv4 } = require("uuid");

// Initialize OpenAI for audio transcription
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Handle audio transcription
 */
export async function handleAudioTranscription(audioFile) {
    try {
        const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
        const transcription = await openai.audio.transcriptions.create({
            file: new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' }),
            model: "whisper-1",
        });
        return { success: true, text: transcription.text };
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return { success: false, error: 'Failed to transcribe audio message' };
    }
}

/**
 * Handle media upload and processing
 */
export async function handleMediaUpload(media, mediaType, userMessage, rekognitionClient) {
    let mediaUrl = null;
    let processedContent = userMessage;
    let audioData = null;

    const fileExtension = media.type.split('/')[1];
    const fileName = `${mediaType}-${uuidv4()}.${fileExtension}`;
    const filePath = `users-${mediaType}s/${fileName}`;

    const arrayBuffer = await media.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process images with AWS Rekognition
    if (mediaType === 'image' && rekognitionClient) {
        const { processedContent: imageContent } = await processImageWithRekognition(buffer, rekognitionClient);
        if (imageContent) {
            processedContent = imageContent;
        }
    }

    // Handle video
    if (mediaType === 'video') {
        processedContent = 'Te acabo de mandar un video de mi pito parado.';
    }

    // Upload to Firebase Storage
    mediaUrl = await uploadToFirebaseStorage(buffer, filePath, media.type);

    return { mediaUrl, processedContent, audioData };
}

/**
 * Create user message object
 */
export function createUserMessage(userId, processedContent, mediaUrl, mediaType, audioData) {
    const userMessageId = uuidv4();
    return {
        id: userMessageId,
        role: 'user',
        content: processedContent,
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        liked: false,
        timestamp: new Date(),
        displayLink: false,
        audioData: audioData,
        status: 'processing'
    };
}

/**
 * Create assistant message object
 */
export function createAssistantMessage(content, mediaUrl = null, mediaType, displayLink = false, audioData = null, responseData) {
    return {
        id: uuidv4(),
        role: 'assistant',
        content: content || '',
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        liked: false,
        timestamp: new Date(),
        displayLink: displayLink,
        audioData: audioData,
        error: responseData.error?responseData.error:null,
        status: 'completed'
    };
}

/**
 * Create out of credits message
 */
export function createOutOfCreditsMessage() {
    return {
        id: uuidv4(),
        role: 'assistant',
        content: "compra premium para seguir hablando ;)",
        displayLink: true,
        status: 'completed',
        timestamp: new Date(),
        liked: false,
        mediaUrl: null,
        mediaType: null,
        audioData: null
    };
}