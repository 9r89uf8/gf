// app/api/v2/conversations/save-message/route-refactored.js
import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { validateFile, validateMessageContent, validateUserPermissions, sanitizeMessageContent } from '@/app/api/v2/utils/messageValidation';
import { handleAudioTranscription, handleMediaUpload, createUserMessage, createOutOfCreditsMessage } from '../../utils/messageHandlers';
import { createOrGetConversation, saveUserMessage, saveAssistantMessage, updateMessageStatus, addOutOfCreditsMessage } from '../../services/conversationService';
import { analyzeMessage, processAIResponse, enrichResponseWithMedia, maybeAddRandomMedia, createFinalAssistantMessage } from '../../services/aiResponseService';
import { getRateLimiters } from '../../middleware/rateLimiter.js';

// Initialize AWS Rekognition
const rekognitionClient = new RekognitionClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function saveMessageHandler(req) {
    try {
        // 1. Parse and validate request
        const formData = await req.formData();
        const userId = formData.get('userId');
        const girlId = formData.get('girlId');
        let userMessage = formData.get('userMessage');
        const media = formData.get('media');
        const mediaType = formData.get('mediaType');

        // Apply rate limiting after getting userId
        req.userId = userId; // Attach userId to request for rate limiting
        const rateLimiters = await getRateLimiters();
        const rateLimitResponse = await rateLimiters.saveMessage(req);
        if (rateLimitResponse) return rateLimitResponse;

        // Get cached data from frontend
        const userData = JSON.parse(formData.get('userData') || '{}');
        const girlData = JSON.parse(formData.get('girlData') || '{}');
        const currentLimits = JSON.parse(formData.get('currentLimits') || '{}'); // Note: currentLimits from frontend is for display only, we use DB values for logic


        // 2. Validate permissions
        const permissionValidation = validateUserPermissions(userData, girlData, mediaType);
        if (!permissionValidation.valid) {
            return new Response(JSON.stringify({ error: permissionValidation.error }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 3. Get or create conversation (moved up to get real limits)
        const { conversationRef, conversation } = await createOrGetConversation(userId, girlId);

        // 4. Check conversation limits using actual database values
        if (!userData.premium) {
            if (conversation.freeMessages <= 0) {
                return new Response(JSON.stringify({
                    error: 'No te quedan mensajes gratis. ¡Suscríbete a Premium y recibe mensajes ilimitados!'
                }), {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            if (mediaType === 'image' && conversation.freeImages <= 0) {
                return new Response(JSON.stringify({
                    error: 'No free images left. Upgrade to premium for unlimited images!'
                }), {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            if (mediaType === 'audio' && conversation.freeAudio <= 0) {
                return new Response(JSON.stringify({
                    error: 'No free audio messages left. Upgrade to premium for unlimited audio!'
                }), {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }

        // 5. Handle media
        let processedContent = userMessage;
        let mediaUrl = null;
        let audioData = null;

        if (media) {
            // Validate file
            const fileValidation = validateFile(media);
            if (!fileValidation.valid) {
                return new Response(JSON.stringify({ error: fileValidation.error }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }

            // Handle audio transcription
            if (mediaType === 'audio') {
                const transcriptionResult = await handleAudioTranscription(media);
                if (!transcriptionResult.success) {
                    return new Response(JSON.stringify({ error: transcriptionResult.error }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                userMessage = transcriptionResult.text;
                processedContent = transcriptionResult.text;
            }

            // Upload media
            console.log('saving video')
            const uploadResult = await handleMediaUpload(media, mediaType, userMessage, rekognitionClient);
            console.log('uploadResult', uploadResult);
            mediaUrl = uploadResult.mediaUrl;
            processedContent = uploadResult.processedContent;
        }

        // 6. Validate and sanitize content
        const contentValidation = validateMessageContent(processedContent, mediaType);
        if (!contentValidation.valid) {
            return new Response(JSON.stringify({ error: contentValidation.error }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const sanitizedContent = sanitizeMessageContent(processedContent);

        // 7. Create and save user message
        const userMessageObj = createUserMessage(userId, sanitizedContent, mediaUrl, mediaType, audioData);
        
        // AI randomly likes user messages (1/6 chance)
        const shouldAILike = Math.random() < 1/5;
        if (shouldAILike) {
            userMessageObj.liked = true;
            userMessageObj.likedBy = 'ai'; // Track who liked it
        }
        
        const saveResult = await saveUserMessage(conversationRef, userMessageObj, mediaType, userData.premium);

        // 8. Check if user has messages left for AI response
        if (!userData.premium && saveResult.updatedLimits.freeMessages <= 0) {
            const outOfCreditsMsg = createOutOfCreditsMessage();
            await addOutOfCreditsMessage(conversationRef, outOfCreditsMsg, userMessageObj.id);

            return new Response(JSON.stringify({
                success: true,
                message: userMessageObj,
                conversationLimits: saveResult.updatedLimits,
                girlName: girlData.name
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        // 9. Process AI response
        try {
            // Analyze user message
            const messageLabels = await analyzeMessage(sanitizedContent);

            // Generate AI response
            const { assistantMessage, parsedResponse, responseData } = await processAIResponse(
                userData,
                girlData,
                saveResult.conversation,
                userMessageObj,
                messageLabels
            );

            // Enrich with media
            let enrichedResponse = await enrichResponseWithMedia(
                responseData,
                parsedResponse,
                girlData,
                userData,
                saveResult.updatedLimits,
                messageLabels
            );

            // Maybe add random media
            enrichedResponse = await maybeAddRandomMedia(
                enrichedResponse,
                parsedResponse,
                girlData,
                userData,
                saveResult.updatedLimits
            );


            // Create final assistant message
            const assistantMessageObj = createFinalAssistantMessage(enrichedResponse);


            // Save assistant message
            const finalResult = await saveAssistantMessage(
                conversationRef,
                assistantMessageObj,
                userMessageObj.id,
                enrichedResponse,
                saveResult.updatedLimits,
                userData.premium
            );

            return new Response(JSON.stringify({
                success: true,
                message: userMessageObj,
                assistantMessage: finalResult.assistantMessage,
                conversationLimits: finalResult.conversationLimits,
                girlName: girlData.name
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });

        } catch (aiError) {
            console.error('Error processing AI response:', aiError);

            // Update user message status to failed
            await updateMessageStatus(conversationRef, userMessageObj.id, 'failed');

            return new Response(JSON.stringify({
                error: 'Failed to generate AI response',
                message: userMessageObj,
                conversationLimits: saveResult.updatedLimits
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error('Error in save-message:', error);

        return new Response(JSON.stringify({
            error: error.message || 'Failed to process message'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Apply rate limiting
export const POST = saveMessageHandler