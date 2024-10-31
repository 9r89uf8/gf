// app/utils/chat/messageParser.js
import { adminDb } from '@/app/utils/firebaseAdmin';
const { v4: uuidv4 } = require("uuid");

function splitText(text) {

    // Handle period case
    const periodIndex = text.indexOf('.');
    if (periodIndex !== -1) {
        return [
            text.substring(0, periodIndex + 1), // Include the period
            text.substring(periodIndex + 1)     // Text after period
        ];
    }

    // Find all emojis in text
    const emojiRegex = /\p{Emoji}/gu;
    const emojis = [...text.matchAll(emojiRegex)];

    // If we have emojis, handle the splitting
    if (emojis.length > 0) {
        // Get the second emoji if it exists
        if (emojis.length > 1) {
            const secondEmojiIndex = emojis[1].index;
            const firstPart = text.substring(0, secondEmojiIndex);
            const secondPart = text.substring(secondEmojiIndex);

            // Check if second part contains only an emoji
            const isSecondPartOnlyEmoji = secondPart.trim().match(/^\p{Emoji}$/u);

            if (isSecondPartOnlyEmoji) {
                const emoji = secondPart.trim();
                const random = Math.random();

                if (random < 0.25) {
                    // Option 1: Keep emoji as second part (10% chance)
                    return [firstPart, emoji];
                } else if (random < 0.40) {
                    // Option 2: Add emoji to first part (45% chance)
                    const addToStart = Math.random() < 0.5;
                    return [addToStart ? emoji + firstPart : firstPart + emoji, ''];
                } else {
                    // Option 3: Delete emoji (45% chance)
                    return [firstPart, ''];
                }
            }

            return [firstPart, secondPart];
        }

        // If we only have one emoji
        const emojiIndex = emojis[0].index;
        const beforeEmoji = text.substring(0, emojiIndex);
        const emojiAndAfter = text.substring(emojiIndex);

        // If the emoji is alone at the end
        const isOnlyEmoji = emojiAndAfter.trim().match(/^\p{Emoji}$/u);

        if (isOnlyEmoji) {
            const emoji = emojiAndAfter.trim();
            const random = Math.random();

            if (random < 0.10) {
                return [beforeEmoji, emoji];
            } else if (random < 0.55) {
                const addToStart = Math.random() < 0.5;
                return [addToStart ? emoji + beforeEmoji : beforeEmoji + emoji, ''];
            } else {
                return [beforeEmoji, ''];
            }
        }

        // If emoji is at start, look for next emoji
        if (emojiIndex === 0) {
            const remainingText = text.substring(1);
            const remainingEmojis = [...remainingText.matchAll(emojiRegex)];

            if (remainingEmojis.length > 0) {
                const splitIndex = remainingEmojis[0].index + 1;
                return [
                    text.substring(0, splitIndex + 1),
                    text.substring(splitIndex + 1)
                ];
            }
        }
    }

    // Default case: no split
    return [text, ''];
}

const removeHashSymbols = text => text.replace(/#/g, '');

// Message Processing
function processAssistantMessage(assistantMessage) {
    const [firstPart, secondPart] = splitText(assistantMessage);
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
