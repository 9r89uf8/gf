// app/api/chat/route.js
//responseFromLLM route
import { adminDb } from '@/app/utils/firebaseAdmin';
import { handleImageRequest } from '@/app/utils/chat/imageHandler';
import { handleVideoRequest } from "@/app/utils/chat/videoHandler";
import { handleAudioRequest } from "@/app/utils/chat/audioHandler";
import { handleLLMInteraction } from "@/app/utils/chat/llmHandler";
import { handleMessageType } from "@/app/utils/chat/messageParser";
import {
    getUnprocessedMessages,
    markMessageAsSeen,
    markMessageAsProcessed
} from "@/app/utils/chat/messageProcessor";
import { checkWordsInMessage } from "@/app/utils/chat/responseHandler";
import { handleRefusedAnswer } from "@/app/utils/chat/responseHandler";
import { updateConversation } from "@/app/utils/chat/conversationHandler";
import { updateUserMessages } from "@/app/utils/chat/userHandler";
import { analyzeUserMessage } from "@/app/utils/chat/bedrockUtils";

const elevenK = process.env.ELEVENLABS_API_KEY;
const wordsToCheck = ['no puedo participar', 'no puedo continuar', 'no puedo seguir', 'no puedo cumplir', 'no puedo ayudar'];

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req) {
    let conversationRef;

    try {
        // Parse request data
        const formData = await req.formData();
        const userId = formData.get('userId');
        const girlId = formData.get('girlId');

        // Get user and girl data
        const [userDocF, girlDoc] = await Promise.all([
            adminDb.firestore().collection('users').doc(userId).get(),
            adminDb.firestore().collection('girls').doc(girlId).get()
        ]);

        // Get all unprocessed user messages
        let unprocessedMessages = await getUnprocessedMessages(userId, girlId);
        const userData = userDocF.data();
        const girlData = girlDoc.data();

        // Get conversation reference
        conversationRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId);

        await conversationRef.update({ girlIsTyping: true });

        const doc = await conversationRef.get();
        let conversationHistory = doc.data().messages;

        // If no unprocessed messages, nothing to do
        if (unprocessedMessages.length === 0) {
            await conversationRef.update({ girlIsTyping: false });
            return new Response(JSON.stringify({
                girlName: girlData.name,
                message: "No unprocessed messages",
                sendNotification: false
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        let likedMessageByAssistant = false;
        const updatedConversationHistory = [...conversationHistory];
        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');

        let typeOfMessage
        let typeOfMessageContent
        // Process each message individually
        for (const userMessage of unprocessedMessages) {
            // Mark message as seen immediately
            await markMessageAsSeen(userId, girlId, userMessage.id);

            // Check if this message should be liked (1/3 chance per message)
            const shouldLikeMessage = Math.random() < 1/3;
            if (shouldLikeMessage) {
                likedMessageByAssistant = true;
            }



            // Analyze message content with AWS Bedrock
            let messageLabels = null;
            if (userMessage.content) {
                try {
                    messageLabels = await analyzeUserMessage(userMessage.content);
                    console.log('Message analysis labels:', messageLabels);
                } catch (error) {
                    console.error('Error analyzing message with Bedrock:', error);
                    // Continue with default labels if analysis fails
                    messageLabels = {
                        is_explicit: false,
                        requesting_picture: false,
                        requesting_audio: false,
                        requesting_video: false,
                        emotional_tone: "neutral"
                    };
                }
            }

            // Important: Add the current user message to conversation history BEFORE sending to LLM
            updatedConversationHistory.push({
                "role": "user",
                "content": userMessage.content
            });

            // Get AI response for this specific message
            let assistantMessage = await handleLLMInteraction(
                userData,
                userMessage,
                girlData,
                updatedConversationHistory,
                messageLabels
            );

            if (checkWordsInMessage(assistantMessage, wordsToCheck)) {
                assistantMessage = handleRefusedAnswer(userData);
            }

            // Process message type with the user message ID
            const { messageType, assistantMessageProcess, parsedContent } =
                await handleMessageType(assistantMessage, userMessage.id, userMessage.content);

            // If the assistant's message is text and not explicitly audio, add a random chance for audio
            let finalMessageType = messageType;
            let manualMessageType = false;

            if (finalMessageType === 'text') {
                if (userData.isPremium) {
                    if (Math.random() < 1/4) {
                        finalMessageType = 'audio';
                        if (!parsedContent.audio.description) {
                            manualMessageType = true;
                            parsedContent.audio.description = parsedContent.audio.content;
                        }
                    }
                } else {
                    // non-premium users
                    if (userData.freeAudio > 0) {
                        if (Math.random() < 1/2) {
                            finalMessageType = 'audio';
                            if (!parsedContent.audio.description) {
                                manualMessageType = true;
                                parsedContent.audio.description = parsedContent.audio.content;
                            }
                        }
                    }
                }
            }

            // Handle different message types
            switch(finalMessageType) {
                case 'audio':
                    const audioResult = await handleAudioRequest(
                        parsedContent.audio,
                        userData,
                        girlData,
                        userId,
                        girlId,
                        assistantMessageProcess,
                        updatedConversationHistory,
                        elevenK,
                        userMessage,
                        manualMessageType
                    );
                    break;

                case 'image':
                    const imageResult = await handleImageRequest(
                        parsedContent.image,
                        userData,
                        girlId,
                        userId,
                        updatedConversationHistory,
                        girlData,
                        userMessage
                    );
                    break;

                case 'video':
                    const videoResult = await handleVideoRequest(
                        parsedContent.video,
                        userData,
                        girlId,
                        userId,
                        updatedConversationHistory,
                        girlData,
                        userMessage
                    );
                    break;

                default:
                    // Text message - add to conversation history and display messages
                    assistantMessageProcess.forEach(response => {
                        typeOfMessageContent = response.content
                        updatedConversationHistory.push({
                            "role": "assistant",
                            "content": response.content
                        });
                    });

                    for (const response of assistantMessageProcess) {
                        await displayMessageRef.add(response);
                    }
            }

            typeOfMessage = finalMessageType;
            // Mark message as processed after handling
            await markMessageAsProcessed(userId, girlId, userMessage.id, shouldLikeMessage);
        }

        // Update conversation with all new messages
        await updateConversation(conversationRef, updatedConversationHistory, girlData, doc, typeOfMessage, typeOfMessageContent);
        const updatedUserData = await updateUserMessages(userId);

        return new Response(JSON.stringify({
            girlName: girlData.name,
            updatedUserData,
            sendNotification: likedMessageByAssistant
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        if (conversationRef) {
            try {
                await conversationRef.update({ girlIsTyping: false });
            } catch (err) {
                console.log('Error resetting typing status:', err.message);
            }
        }

        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}