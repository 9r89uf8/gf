// app/api/chat/route.js
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
import {analyzeUserMessageLlama} from "@/app/utils/chat/llamaAnalize";
import {getConversationLimits,
    decrementFreeMessages,
    hasFreeMessagesLeft} from "@/app/api/chat/conversationLimits/route";
import {NextResponse} from "next/server";
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

        // Get conversation limits for this specific girl
        const conversationLimits = await getConversationLimits(userId, girlId);

        // Get all unprocessed user messages
        let unprocessedMessages = await getUnprocessedMessages(userId, girlId);
// Extract data and include IDs
        const userData = {
            ...userDocF.data(),
            id: userId  // Include the user ID
        };

        const girlData = {
            ...girlDoc.data(),
            id: girlId  // Include the girl ID
        };

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
                sendNotification: false,
                conversationLimits
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

        let typeOfMessage;
        let typeOfMessageContent;

        // Process each message individually
        for (const userMessage of unprocessedMessages) {
            // Mark message as seen immediately
            await markMessageAsSeen(userId, girlId, userMessage.id);

            // Check if this message should be liked (1/3 chance per message)
            const shouldLikeMessage = Math.random() < 1/3;
            if (shouldLikeMessage) {
                likedMessageByAssistant = true;
            }

            // Check if user has free messages left with this girl
            const hasMessagesLeft = await hasFreeMessagesLeft(userId, girlId);

            // If premium user or has free messages left, process the message
            if (userData.premium || hasMessagesLeft) {
                // Analyze message content with AWS Bedrock
                let messageLabels = null;
                if (userMessage.content) {
                    try {
                        messageLabels = await analyzeUserMessage(userMessage.content);
                        console.log('Message analysis labels:', messageLabels);
                    } catch (error) {
                        console.log('First analysis method failed, trying backup method');
                        try {
                            messageLabels = await analyzeUserMessageLlama(userMessage.content);
                            console.log('Backup analysis successful:', messageLabels);
                        } catch (secondError) {
                            console.error('Both analysis methods failed:', secondError);
                            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
                        }
                    }
                }

                // Add the current user message to conversation history BEFORE sending to LLM
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

                // Logic for determining whether to use audio based on conversation limits
                if (finalMessageType === 'text') {
                    const audioChance = userData.premium ? 1/4 : 1/2;
                    const conversationLimits = await getConversationLimits(userId, girlId);

                    if (userData.premium || conversationLimits.freeAudio > 0) {
                        if (Math.random() < audioChance) {
                            finalMessageType = 'audio';
                            if (!parsedContent.audio.description) {
                                manualMessageType = true;
                                parsedContent.audio.description = parsedContent.audio.content;
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
                        // Define a list of generic replacement messages
                        const genericMessages = [
                            "jajaja",
                            "muestrame tu p",
                            "como es tu p?",
                            "k haces?",
                            "tengo unas ganas tremendas"
                        ];



                        // Function to count emojis in a string
                    function countEmojis(text) {
                        // This regex pattern matches most common emoji characters
                        const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
                        const matches = text.match(emojiRegex);
                        return matches ? matches.length : 0;
                    }

                        // Function to get a random message from the generic messages list
                    function getRandomGenericMessage() {
                        const randomIndex = Math.floor(Math.random() * genericMessages.length);
                        return genericMessages[randomIndex];
                    }

                        // Process each response
                        assistantMessageProcess.forEach(response => {
                            let messageContent = response.content;

                            // Check if the message has too many emojis (e.g., 10 or more)
                            if (countEmojis(messageContent) >= 10) {
                                // Replace with a random generic message
                                messageContent = getRandomGenericMessage();
                            }

                            // Update the response content
                            response.content = messageContent;

                            // Add to conversation history
                            updatedConversationHistory.push({
                                "role": "assistant",
                                "content": messageContent
                            });
                        });

                        // Display the messages
                        for (const response of assistantMessageProcess) {
                            await displayMessageRef.add(response);
                        }
                }

                typeOfMessage = finalMessageType;

                // Decrement free messages count if not premium
                if (!userData.premium) {
                    await decrementFreeMessages(userId, girlId);
                }

                // After displaying the text messages, check if we should also send an image
                const shouldSendAdditionalImage = async () => {
                    // Get updated conversation limits to check free image count
                    const currentLimits = await getConversationLimits(userId, girlId);

                    // Calculate chance based on premium status
                    const imageChance = userData.premium ? 1/7 : 1/3;

                    // Check if user is eligible to receive an image
                    if ((userData.premium || currentLimits.freeImages > 0) &&
                        Math.random() < imageChance) {
                        messageLabels = {
                            is_explicit: false,
                            requesting_picture: true,
                            requesting_audio: false,
                            requesting_video: false,
                            emotional_tone: 'sexy'
                        }

                        // Get AI response for this specific message
                        let assistantMessage = await handleLLMInteraction(
                            userData,
                            userMessage,
                            girlData,
                            updatedConversationHistory,
                            messageLabels
                        );

                        // Process message type with the user message ID
                        let  parsedContentTwo  = await handleMessageType(assistantMessage, userMessage.id, userMessage.content);


                        // Send additional image without changing finalMessageType
                        if(parsedContentTwo.messageType === 'image'){
                            await handleImageRequest(
                                parsedContentTwo.parsedContent.image,
                                userData,
                                girlId,
                                userId,
                                updatedConversationHistory,
                                girlData,
                                userMessage
                            );
                        }


                        return true;
                    }
                    return false;
                };

                // Try to send additional image
                await shouldSendAdditionalImage();
            } else {
                // If out of free messages and not premium, add a message telling user they're out of credits
                const outOfCreditsMessage = {
                    uid: uuidv4(),
                    role: "assistant",
                    liked: false,
                    displayLink: true,
                    respondingTo: userMessage.content,
                    content: "compra premium para seguir hablando ;)",
                    timestamp: adminDb.firestore.FieldValue.serverTimestamp()
                };

                await displayMessageRef.add(outOfCreditsMessage);

                updatedConversationHistory.push({
                    "role": "user",
                    "content": userMessage.content
                });

                updatedConversationHistory.push({
                    "role": "assistant",
                    "content": outOfCreditsMessage.content
                });

                typeOfMessage = "text";
            }

            // Mark message as processed after handling
            await markMessageAsProcessed(userId, girlId, userMessage.id, shouldLikeMessage);
        }

        // Update conversation with all new messages
        await updateConversation(conversationRef, updatedConversationHistory, girlData, doc, typeOfMessage, typeOfMessageContent);
        const updatedUserData = await updateUserMessages(userId);

        // Get updated conversation limits
        const updatedLimits = await getConversationLimits(userId, girlId);

        return new Response(JSON.stringify({
            girlName: girlData.name,
            updatedUserData,
            sendNotification: likedMessageByAssistant,
            conversationLimits: updatedLimits
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