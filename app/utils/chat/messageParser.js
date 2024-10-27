// app/utils/chat/messageParser.js
import { adminDb } from '@/app/utils/firebaseAdmin';
const { v4: uuidv4 } = require("uuid");

// Text Processing Utilities
function splitTextAtPunctuationOrSecondEmoji(text) {
    if (text.length < 28) return [text, ''];

    const punctuationRegex = /(\.|\?|!)\s*/;
    const emojiRegex = /\p{Emoji}/gu;
    const punctuationMatch = text.match(punctuationRegex);
    const emojiMatches = [...text.matchAll(emojiRegex)];

    if (punctuationMatch && (!emojiMatches[1] || punctuationMatch.index < emojiMatches[1].index)) {
        const index = punctuationMatch.index + punctuationMatch[0].length;
        return [text.substring(0, index), text.substring(index)];
    }

    if (emojiMatches[1]) {
        const index = emojiMatches[1].index + emojiMatches[1][0].length;
        return [text.substring(0, index), text.substring(index)];
    }

    if (emojiMatches.length === 1 && text.endsWith(emojiMatches[0][0])) {
        const index = emojiMatches[0].index;
        return [text.substring(0, index), text.substring(index)];
    }

    return [text, ''];
}

const removeHashSymbols = text => text.replace(/#/g, '');

// Message Processing
function processAssistantMessage(assistantMessage) {
    const [firstPart, secondPart] = splitTextAtPunctuationOrSecondEmoji(assistantMessage);
    const createMessageObject = content => ({
        uid: uuidv4(),
        role: "assistant",
        liked: false,
        displayLink: false,
        content: removeHashSymbols(content),
        timestamp: adminDb.firestore.FieldValue.serverTimestamp()
    });

    const response = [createMessageObject(firstPart)];
    if (secondPart) response.push(createMessageObject(secondPart));

    return response;
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
        audio: /\[AUDIO:\s*(.*?)\]/i
    };

    const match = message.match(patterns[type]);
    if (!match) return { content: message, description: null };

    const description = match[1].trim();
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
export async function handleMessageType(assistantMessage) {
    const userWantsImage = parseAssistantMessageImage(assistantMessage);
    const userWantsVideo = parseAssistantMessageVideo(assistantMessage);
    const userWantsAudio = parseAssistantMessageAudio(assistantMessage);
    const assistantMessageProcess = processAssistantMessage(assistantMessage);

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
