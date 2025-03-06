// app/utils/chat/messageParser.js
import { adminDb } from '@/app/utils/firebaseAdmin';
const { v4: uuidv4 } = require("uuid");

const removeHashSymbols = text => text.replace(/#/g, '');

// Message Processing - No longer splits messages
function processAssistantMessage(assistantMessage, respondingToMessageId = null, userMessage) {
    return [{
        uid: uuidv4(),
        role: "assistant",
        liked: false,
        displayLink: false,
        content: removeHashSymbols(assistantMessage),
        respondingTo: userMessage, // Include the ID of the message being responded to
        timestamp: adminDb.firestore.FieldValue.serverTimestamp()
    }];
}

// Random Message Generation
const RANDOM_MESSAGES = {
    default: [
        '\u{1F618}', '\u{1F60D}', '\u{1F970}', '\u{1F48B}',
        '\u{1F609}', '\u{1F525}', '\u{1F496}', 'te gusta?'
    ],
    video: 'mandame un video tuyo',
    image: 'mandame una tuya'
};

function getRandomMessage(type = 'image') {
    const messages = [...RANDOM_MESSAGES.default, type === 'video' ? RANDOM_MESSAGES.video : RANDOM_MESSAGES.image];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Message Type Parsing
function parseMessageWithType(message, type) {
    const patterns = {
        image: /\[(IMAGEN|IMAGE):\s*(.*?)\]/i,
        video: /\[(VIDEO|VIDEOS):\s*(.*?)\]/i,
        audio: /\[(AUDIO):\s*(.*?)\]/i
    };

    const match = message.match(patterns[type]);
    if (!match) return { content: message, description: null };

    const description = match[2] ? match[2].trim() : null;
    const content = message.replace(patterns[type], '').trim() || getRandomMessage(type);

    return { content, description };
}

function parseAssistantMessageImage(message) {
    return parseMessageWithType(message, 'image');
}

function parseAssistantMessageVideo(message) {
    return parseMessageWithType(message, 'video');
}

function parseAssistantMessageAudio(message) {
    return parseMessageWithType(message, 'audio');
}

// Main Message Type Handler
export async function handleMessageType(assistantMessage, respondingToMessageId = null, userMessage) {

    const userWantsImage = parseAssistantMessageImage(assistantMessage);
    const userWantsVideo = parseAssistantMessageVideo(assistantMessage);
    const userWantsAudio = parseAssistantMessageAudio(assistantMessage);
    const assistantMessageProcess = processAssistantMessage(assistantMessage, respondingToMessageId, userMessage);



    const messageType = userWantsAudio.description ? 'audio' :
        userWantsImage.description ? 'image' :
            userWantsVideo.description ? 'video' :
                'text';


    return {
        assistantMessageProcess,
        messageType,
        parsedContent: {
            audio: userWantsAudio,
            image: userWantsImage,
            video: userWantsVideo
        }
    };
}

export {
    processAssistantMessage,
    parseAssistantMessageImage,
    parseAssistantMessageVideo,
    parseAssistantMessageAudio
};