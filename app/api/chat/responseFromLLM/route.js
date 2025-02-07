// app/api/chat/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { handleImageRequest } from '@/app/utils/chat/imageHandler';
import { handleVideoRequest } from "@/app/utils/chat/videoHandler";
import { handleAudioRequest } from "@/app/utils/chat/audioHandler";
import { handleLLMInteraction } from "@/app/utils/chat/llmHandler";
import { handleMessageType } from "@/app/utils/chat/messageParser";
import {markMessagesAsSeen, getLastProcessedMessage} from "@/app/utils/chat/messageProcessor";
import {checkWordsInMessage} from "@/app/utils/chat/responseHandler";
import {handleRefusedAnswer} from "@/app/utils/chat/responseHandler";
import {updateConversation} from "@/app/utils/chat/conversationHandler";
import {updateUserMessages} from "@/app/utils/chat/userHandler";

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
        const file = formData.get('image');

        const likedMessageByAssistant = Math.random() < 1/3;

        // Get user and girl data
        const [userDocF, girlDoc] = await Promise.all([
            adminDb.firestore().collection('users').doc(userId).get(),
            adminDb.firestore().collection('girls').doc(girlId).get(),
            markMessagesAsSeen(userId, girlId, likedMessageByAssistant)
        ]);

        let lastUserMessage = await getLastProcessedMessage(userId, girlId);
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

        // Get and process LLM response
        let assistantMessage = await handleLLMInteraction(userData, lastUserMessage, girlData, conversationHistory);

        if (checkWordsInMessage(assistantMessage, wordsToCheck)) {
            assistantMessage = handleRefusedAnswer(userData);
        }

        // Parse and handle message type
        const { messageType, assistantMessageProcess, parsedContent } =
            await handleMessageType(assistantMessage);

        // Handle different message types
        switch(messageType) {
            case 'audio':
                const audioResult = await handleAudioRequest(
                    parsedContent.audio, userData, girlData, userId, girlId,
                    assistantMessageProcess, conversationHistory, elevenK, lastUserMessage
                );
                conversationHistory = audioResult.updatedHistory;
                break;

            case 'image':
                const imageResult = await handleImageRequest(
                    parsedContent.image, userData, girlId, userId, conversationHistory, girlData
                );
                conversationHistory = imageResult.updatedHistory;
                break;

            case 'video':
                const videoResult = await handleVideoRequest(
                    parsedContent.video, userData, girlId, userId, conversationHistory, girlData
                );
                conversationHistory = videoResult.updatedHistory;
                break;

            default:
                const displayMessageRef = adminDb.firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('conversations')
                    .doc(girlId)
                    .collection('displayMessages');

                assistantMessageProcess.forEach(response => {
                    conversationHistory.push({"role": "assistant", "content": response.content});
                });

                for (const response of assistantMessageProcess) {
                    await displayMessageRef.add(response);
                }
        }

        await markMessagesAsSeen(userId, girlId);
        await updateConversation(conversationRef, conversationHistory, girlData, doc);
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