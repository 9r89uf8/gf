// app/utils/chat/imageHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';
const {v4: uuidv4} = require("uuid");

function removeHashSymbols(text) {
    return text.replace(/#/g, '');
}

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
export async function handleImageRequest(
    userWantsImage,
    userData,
    girlId,
    userId,
    conversationHistory
) {
    // Handle premium users
    if (userData.premium) {
        let pictureDescription = userWantsImage.description.toLowerCase();

        // Fetch pictures where girlId matches
        const picturesSnapshot = await adminDb.firestore()
            .collection('pictures')
            .where('girlId', '==', girlId)
            .get();

        // Map the documents to an array of picture objects
        let activePic = picturesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Tokenize the pictureDescription
        let targetWords = pictureDescription.split(/\s+/).map(word => word.trim().toLowerCase());

        // Calculate similarity scores
        activePic.forEach(pic => {
            if (pic.description) {
                let descriptionWords = pic.description.toLowerCase().split(/\s+/).map(word => word.trim());
                let matchingWords = targetWords.filter(word => descriptionWords.includes(word));
                pic.similarityScore = matchingWords.length;
            } else {
                pic.similarityScore = 0;
            }
        });

        // Find best matching picture
        let maxScore = Math.max(...activePic.map(pic => pic.similarityScore));
        let matchingPics = activePic.filter(pic => pic.similarityScore === maxScore && maxScore > 0);

        let selectedPic = matchingPics.length > 0
            ? matchingPics[Math.floor(Math.random() * matchingPics.length)]
            : activePic[Math.floor(Math.random() * activePic.length)];

        // Update conversation history
        conversationHistory.push({ "role": "assistant", "content": userWantsImage.content });

        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');

        // Set content text
        let contentText = userWantsImage.content === '' ? '😘' : userWantsImage.content;

        // Add message with selected image
        await displayMessageRef.add({
            role: 'assistant',
            content: contentText,
            image: selectedPic.image,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
        });

        return { success: true, updatedHistory: conversationHistory };
    }
    // Handle non-premium users
    else {
        const processAssistantMessage = (assistantMessage) => {
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
        };

        let assistantMessageProcess = processAssistantMessage(userWantsImage.content);

        // Update conversation history
        assistantMessageProcess.forEach(response => {
            conversationHistory.push({"role": "assistant", "content": response.content});
        });

        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');

        // Add messages with display link for last message
        for (const [index, response] of assistantMessageProcess.entries()) {
            if (index === assistantMessageProcess.length - 1) {
                response.displayLink = true;
            }
            await displayMessageRef.add(response);
        }

        return { success: true, updatedHistory: conversationHistory };
    }
}