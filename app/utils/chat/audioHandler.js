import { adminDb } from '@/app/utils/firebaseAdmin';
import axios from 'axios';
const { v4: uuidv4 } = require("uuid");

function splitTextAtPunctuationOrSecondEmoji(text) {
    // If text is less than 10 characters, don't split it
    if (text.length < 28) {
        return [text, ''];
    }

    // Regular expression to match the first occurrence of period, question mark, or exclamation point
    const punctuationRegex = /(\.|\?|!)\s*/;

    // Regular expression to match emojis
    const emojiRegex = /\p{Emoji}/gu;

    // Find the index where the first punctuation mark occurs
    const punctuationMatch = text.match(punctuationRegex);

    // Find all emoji matches
    let emojiMatches = [...text.matchAll(emojiRegex)];

    if (punctuationMatch && (!emojiMatches[1] || punctuationMatch.index < emojiMatches[1].index)) {
        // If punctuation comes first or there's no second emoji, split at punctuation
        const index = punctuationMatch.index + punctuationMatch[0].length;
        return [text.substring(0, index), text.substring(index)];
    } else if (emojiMatches[1]) {
        // If there's a second emoji and it comes before punctuation, split at the second emoji
        const index = emojiMatches[1].index + emojiMatches[1][0].length;
        return [text.substring(0, index), text.substring(index)];
    } else if (emojiMatches.length === 1 && text.endsWith(emojiMatches[0][0])) {
        // If there's only one emoji and it's at the end of the text, split before the emoji
        const index = emojiMatches[0].index;
        return [text.substring(0, index), text.substring(index)];
    } else {
        // If no punctuation or emoji is found, return the whole text as the first part and an empty string as the second
        return [text, ''];
    }
}

function removeHashSymbols(text) {
    return text.replace(/#/g, '');
}

function processAssistantMessage(assistantMessage) {
    const [firstPart, secondPart] = splitTextAtPunctuationOrSecondEmoji(assistantMessage);
    let response = [{
        uid: uuidv4(),
        role: "assistant",
        liked: false,
        displayLink: false,
        content: removeHashSymbols(firstPart),
        timestamp: adminDb.firestore.FieldValue.serverTimestamp()
    }];
    if (secondPart) {
        response.push({
            uid: uuidv4(),
            role: "assistant",
            liked: false,
            displayLink: false,
            content: removeHashSymbols(secondPart),
            timestamp: adminDb.firestore.FieldValue.serverTimestamp()
        });
    }

    return response;
}

async function generateAudio(text, audioId, apiKey) {
    const options = {
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${audioId}`,
        headers: {
            accept: 'audio/mpeg',
            'content-type': 'application/json',
            'xi-api-key': apiKey
        },
        data: {
            text: text,
            model_id: 'eleven_multilingual_v2'
        },
        responseType: 'arraybuffer'
    };

    const response = await axios.request(options);
    return Buffer.from(response.data).toString('base64');
}

// A list of pre-stored audio URLs for moaning
const moanAudioUrls = [
    "https://chicagocarhelp.s3.us-east-2.amazonaws.com/girl_is_moaning+(3).mp3",
    "https://chicagocarhelp.s3.us-east-2.amazonaws.com/girl_is_moaning+(2).mp3",
    "https://chicagocarhelp.s3.us-east-2.amazonaws.com/girl_is_moaning+(1).mp3",
    "https://chicagocarhelp.s3.us-east-2.amazonaws.com/girl_is_moaning.mp3"
];

export async function handleAudioRequest(
    userWantsAudio,
    userData,
    girlData,
    userId,
    girlId,
    assistantMessageProcess,
    conversationHistory,
    elevenLabsKey,
    userMessage,
    manualMessageType
) {
    let audioTextDescription = false;

    // If freeAudio is 0, process normally (splitting the message, etc.)
    if (userData.freeAudio === 0) {
        assistantMessageProcess = processAssistantMessage(userWantsAudio.content);
        if(!manualMessageType){
            assistantMessageProcess[assistantMessageProcess.length - 1].displayLink = true;
        }
        assistantMessageProcess.forEach(response => {
            conversationHistory.push({ role: "assistant", content: response.content });
        });
    } else {
        audioTextDescription = true;
        assistantMessageProcess = [
            {
                uid: uuidv4(),
                role: "assistant",
                liked: false,
                displayLink: false,
                content: userWantsAudio.content,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            },
            {
                uid: uuidv4(),
                role: "assistant",
                liked: false,
                displayLink: false,
                content: userWantsAudio.description,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            }
        ];
        if (audioTextDescription && userWantsAudio.description !== userWantsAudio.content) {
            // Push two separate messages
            conversationHistory.push(
                { role: "assistant", content: userWantsAudio.content },
                { role: "assistant", content: userWantsAudio.description }
            );
        } else {
            // Push just one message if description is default/duplicative
            conversationHistory.push({ role: "assistant", content: userWantsAudio.content });
        }

    }

    // Check if the user's text contains the word "gemir" (case-insensitive)
    if (userMessage.content.toLowerCase().includes("gemir") ||
        userMessage.content.toLowerCase().includes("gemidos" || userMessage.content.toLowerCase().includes("jemir"))) {
        // Choose one audio URL at random
        const selectedUrl =
            moanAudioUrls[Math.floor(Math.random() * moanAudioUrls.length)];
        try {
            // Fetch the audio file from the selected URL as an array buffer
            const response = await axios.get(selectedUrl, { responseType: 'arraybuffer' });
            const audioBase64 = Buffer.from(response.data).toString('base64');

            // Attach the audio data to the proper assistant message
            if (audioTextDescription) {
                assistantMessageProcess[1].audioData = audioBase64;
            } else {
                assistantMessageProcess[0].audioData = audioBase64;
            }

            // Optionally, update the conversation history if needed (messages are already added below)
            // Decrement freeAudio count if required by your business logic:
            if (userData.freeAudio >= 1) {
                const userRef = adminDb.firestore().collection('users').doc(userId);
                await userRef.update({
                    freeAudio: adminDb.firestore.FieldValue.increment(-1)
                });
            }
        } catch (error) {
            console.error("Error fetching or converting moan audio:", error);
            // Fallback: you could set response.type = 'text' or proceed with the default generation
            assistantMessageProcess[0].type = 'text';
        }
    } else if (userData.freeAudio >= 1) {
        // Proceed with normal audio generation using ElevenLabs
        const responseObj = audioTextDescription ? assistantMessageProcess[1] : assistantMessageProcess[0];
        const removeEmojisAndHash = (str) => {
            return str.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E0}-\u{1F1FF}#]/gu, '').trim();
        };

        const finalText = removeEmojisAndHash(responseObj.content);

        if (finalText.length < 62) {
            const audioBase64 = await generateAudio(finalText, girlData.audioId, elevenLabsKey);
            if (audioTextDescription) {
                assistantMessageProcess[1].audioData = audioBase64;
            } else {
                assistantMessageProcess[0].audioData = audioBase64;
            }
        } else {
            responseObj.type = 'text';
        }
        const userRef = adminDb.firestore().collection('users').doc(userId);
        await userRef.update({
            freeAudio: adminDb.firestore.FieldValue.increment(-1)
        });
    }

// Instead of blindly adding every message in assistantMessageProcess:
    const displayMessageRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId)
        .collection('displayMessages');

    if (userData.freeAudio === 0) {
        // When freeAudio is 0, only one message exists.
        for (const message of assistantMessageProcess) {
            await displayMessageRef.add(message);
        }
        // await displayMessageRef.add({
        //     ...assistantMessageProcess[0],
        //     content: userWantsAudio.content
        // });
    } else if (audioTextDescription && userWantsAudio.description && userWantsAudio.description !== userWantsAudio.content) {
        // For explicit audio requests, add two messages:
        await displayMessageRef.add({
            ...assistantMessageProcess[0],
            content: userWantsAudio.content
        });
        await displayMessageRef.add({
            ...assistantMessageProcess[1],
            content: userWantsAudio.description
        });
    } else {
        await displayMessageRef.add({
            ...assistantMessageProcess[1],
            content: userWantsAudio.content
        });
    }


    return {
        success: true,
        updatedHistory: conversationHistory
    };
}
