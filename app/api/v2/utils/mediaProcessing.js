// app/api/v2/utils/mediaProcessing.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { uploadToFirebaseStorage } from '@/app/middleware/firebaseStorage';
import axios from 'axios';

const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;

/**
 * Parse message for different media types
 * Looks for [IMAGE: description], [VIDEO: description], or [AUDIO: description] formats
 * @param {string} message - The message to parse
 * @returns {{type: string, content: string, description: string|null}} Parsed message object
 * @example
 * parseMessageContent('[IMAGE: sunset] Beautiful day')
 * // Returns: { type: 'image', content: 'Beautiful day', description: 'sunset' }
 */
export function parseMessageContent(message) {
    const imageRegex = /\[(IMAGEN|IMAGE):\s*(.*?)\]/i;
    const videoRegex = /\[(VIDEO|VIDEOS):\s*(.*?)\]/i;
    const audioRegex = /\[(AUDIO):\s*(.*?)\]/i;

    // Check for image
    const imageMatch = message.match(imageRegex);
    if (imageMatch) {
        const description = imageMatch[2]?.trim() || null;
        const content = message.replace(imageRegex, '').trim() || '😘';
        return { type: 'image', content, description };
    }

    // Check for video
    const videoMatch = message.match(videoRegex);
    if (videoMatch) {
        const description = videoMatch[2]?.trim() || null;
        const content = message.replace(videoRegex, '').trim() || '😘';
        return { type: 'video', content, description };
    }

    // Check for audio
    const audioMatch = message.match(audioRegex);
    if (audioMatch) {
        const description = audioMatch[2]?.trim() || null;
        const content = message.replace(audioRegex, '').trim() || description || '😘';
        return { type: 'audio', content, description };
    }

    return { type: 'text', content: message, description: null };
}

/**
 * Generate audio using ElevenLabs API and return as base64
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The ElevenLabs voice ID to use
 * @returns {Promise<string|null>} Base64 encoded audio data or null if failed
 * @throws {Error} If API call fails
 */
async function generateAudioBase64(text, voiceId) {
    try {
        const response = await axios({
            method: 'POST',
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            headers: {
                'accept': 'audio/mpeg',
                'content-type': 'application/json',
                'xi-api-key': elevenLabsApiKey
            },
            data: {
                text: text,
                model_id: 'eleven_multilingual_v2'
            },
            responseType: 'arraybuffer'
        });

        return Buffer.from(response.data).toString('base64');
    } catch (error) {
        console.error('Error generating audio:', error);
        return null;
    }
}

/**
 * Generate audio using ElevenLabs API and upload to Firebase Storage
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - The ElevenLabs voice ID to use
 * @returns {Promise<string|null>} Firebase Storage URL or null if failed
 */
export async function generateAudio(text, voiceId) {
    try {
        // Get audio as base64
        const base64Audio = await generateAudioBase64(text, voiceId);
        if (!base64Audio) return null;
        
        // Convert base64 to buffer
        const audioBuffer = Buffer.from(base64Audio, 'base64');
        
        // Generate unique filename
        const fileName = `audio/generated/${voiceId}/${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`;
        
        // Upload to Firebase Storage
        const audioUrl = await uploadToFirebaseStorage(audioBuffer, fileName, 'audio/mpeg');
        
        return audioUrl;
    } catch (error) {
        console.error('Error generating and uploading audio:', error);
        return null;
    }
}

/**
 * Get media content (image/video) from database
 */
export async function getMediaContent(girlId, mediaType, description, isPremium) {
    try {

        // Build query
        let query = adminDb.firestore()
            .collection('girls-gallery')
            .where('girlId', '==', girlId)
            .where('displayToGallery', '==', false);

        // Filter by premium status
        if (!isPremium) {
            query = query.where('isPremium', '==', false);
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            return null;
        }

        const mediaItems = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Return random item
        const randomIndex = Math.floor(Math.random() * mediaItems.length);
        return mediaItems[randomIndex];

    } catch (error) {
        console.error('Error getting media content:', error);
        return null;
    }
}

/**
 * Process image with AWS Rekognition
 */
export async function processImageWithRekognition(buffer, rekognitionClient) {
    const { DetectModerationLabelsCommand, DetectLabelsCommand } = await import("@aws-sdk/client-rekognition");
    
    try {
        const moderationParams = {
            Image: { Bytes: buffer },
            MinConfidence: 75
        };
        
        const moderationCommand = new DetectModerationLabelsCommand(moderationParams);
        const moderationResponse = await rekognitionClient.send(moderationCommand);

        let processedContent = null;
        let isExplicit = false;

        if (moderationResponse.ModerationLabels.length === 0) {
            // Get image labels for description
            const labelsParams = {
                Image: { Bytes: buffer },
                MaxLabels: 10,
                MinConfidence: 70,
            };
            
            const labelsCommand = new DetectLabelsCommand(labelsParams);
            const labelsResponse = await rekognitionClient.send(labelsCommand);
            
            // Build description from labels
            const labelsDescription = labelsResponse.Labels.map(label => 
                `${label.Name} (${label.Confidence.toFixed(1)}%)`
            ).join(', ');

            processedContent = `The User sent you an image. The image contains: ${labelsDescription}. Describe what you see and react naturally.`;
        }

        // Handle explicit content
        if (moderationResponse.ModerationLabels.some(label =>
            ['Explicit', 'Exposed Male Genitalia', 'Explicit Sexual Activity'].includes(label.Name)
        )) {
            processedContent = 'Te acabo de mandar una foto de mi pito parado.';
            isExplicit = true;
        }

        return { processedContent, isExplicit };
    } catch (error) {
        console.error('Error processing image with Rekognition:', error);
        return { processedContent: null, isExplicit: false };
    }
}