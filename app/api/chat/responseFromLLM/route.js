// app/api/chat/responseFromLLM/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { handleImageRequest } from '@/app/utils/chat/imageHandler';
import { handleVideoRequest } from "@/app/utils/chat/videoHandler";
import { handleAudioRequest } from "@/app/utils/chat/audioHandler";
import { handleLLMInteraction } from "@/app/utils/chat/llmHandler";
import { handleMessageType } from "@/app/utils/chat/messageParser";
const elevenK = process.env.ELEVENLABS_API_KEY

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const wordsToCheck = ['no puedo participar', 'solicitud'];
const checkWordsInMessage = (message, wordList) => {
    const lowercaseMessage = message.toLowerCase();
    return wordList.some(word => lowercaseMessage.includes(word.toLowerCase()));
};

const handleRefusedAnswer = (userData) => {
    const randomMessages = userData.premium ?
        { message: '😘', type: 'image' } :
        {
            messages: [
                '😘 para obtener fotos mias tiene que comprar premium.',
                'comprame premium para mandarte fotos mi amor. 😍',
                'no puedo mandarte fotos mi amor. tienes que comprar premium',
                'compra premium para ver mis fotos 😉',
            ],
            type: 'premium'
        };

    if (userData.premium) {
        return `${randomMessages.message}[IMAGEN: foto mia]`;
    }

    const randomIndex = Math.floor(Math.random() * randomMessages.messages.length);
    return `${randomMessages.messages[randomIndex]}[IMAGEN: foto mia]`;
};

export async function POST(req) {
    try {
        // Parse request data
        const formData = await req.formData();
        const userId = formData.get('userId');
        const girlId = formData.get('girlId');
        const file = formData.get('image');

        // Get user and girl data
        const [userDocF, girlDoc] = await Promise.all([
            adminDb.firestore().collection('users').doc(userId).get(),
            adminDb.firestore().collection('girls').doc(girlId).get()
        ]);

        const userData = userDocF.data();
        const girlData = girlDoc.data();

        // Update all displayMessages where role='user' and seen=false to seen=true
        let displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');

        const query = displayMessageRef
            .where('role', '==', 'user')
            .where('seen', '==', false);

        const messagesSnapshot = await query.get();

        const batch = adminDb.firestore().batch();

        messagesSnapshot.forEach((doc) => {
            batch.update(doc.ref, { seen: true });
        });

        await batch.commit();


        // Get conversation reference and history
        const conversationRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId);

        const doc = await conversationRef.get();
        let conversationHistory = doc.data().messages;

        // Get and process LLM response
        let assistantMessage = await handleLLMInteraction(userData, file, girlData, conversationHistory);

        // Handle refused answers
        if (checkWordsInMessage(assistantMessage, wordsToCheck)) {
            assistantMessage = handleRefusedAnswer(userData);
        }

        // Parse and handle message type
        let { messageType, assistantMessageProcess, parsedContent } =
            await handleMessageType(assistantMessage);

        // Handle different message types
        switch(messageType) {
            case 'audio':
                const audioResult = await handleAudioRequest(
                    parsedContent.audio,
                    userData,
                    girlData,
                    userId,
                    girlId,
                    assistantMessageProcess,
                    conversationHistory,
                    elevenK
                );
                conversationHistory = audioResult.updatedHistory;
                break;

            case 'image':
                const imageResult = await handleImageRequest(
                    parsedContent.image,
                    userData,
                    girlId,
                    userId,
                    conversationHistory
                );
                conversationHistory = imageResult.updatedHistory;
                break;

            case 'video':
                const videoResult = await handleVideoRequest(
                    parsedContent.video,
                    userData,
                    girlId,
                    userId,
                    conversationHistory
                );
                conversationHistory = videoResult.updatedHistory;
                break;

            default:
                // Handle regular text message
                assistantMessageProcess.forEach(response => {
                    conversationHistory.push({"role": "assistant", "content": response.content});
                });

                let displayMessageRef = adminDb.firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('conversations')
                    .doc(girlId)
                    .collection('displayMessages');

                for (const response of assistantMessageProcess) {
                    await displayMessageRef.add(response);
                }
        }

        // Update conversation in Firestore
        await conversationRef.set({
            messages: conversationHistory,
            lastMessage: {
                content: `${girlData.name} te respondió`,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
                sender: 'assistant'
            },
            isGirlOnline: true,
            girlOfflineUntil: null,
            lastSeen: adminDb.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return new Response(JSON.stringify({
            girlName: girlData.name,
            sendNotification: Math.random() < 1/3
        }), {
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