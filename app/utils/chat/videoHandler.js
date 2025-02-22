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
export async function handleVideoRequest(
    userWantsVideo,
    userData,
    girlId,
    userId,
    conversationHistory,
    girl
) {
    // Handle premium users
    if (userData.premium&&girl.videosEnabled) {
        let videoDescription = userWantsVideo.description.toLowerCase();

        // Fetch videos where girlId matches
        const videosSnapshot = await adminDb.firestore()
            .collection('videos')
            .where('girlId', '==', girlId)
            .get();

        // Map the documents to an array of video objects
        let activeVideos = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Tokenize the videoDescription
        let targetWords = videoDescription.split(/\s+/).map(word => word.trim().toLowerCase());

        // For each video, calculate a similarity score
        activeVideos.forEach(video => {
            if (video.description) {
                let descriptionWords = video.description.toLowerCase().split(/\s+/).map(word => word.trim());
                let matchingWords = targetWords.filter(word => descriptionWords.includes(word));
                video.similarityScore = matchingWords.length;
            } else {
                video.similarityScore = 0;
            }
        });

        // Filter videos with the highest similarity score
        let maxScore = Math.max(...activeVideos.map(video => video.similarityScore));
        let matchingVideos = activeVideos.filter(video => video.similarityScore === maxScore && maxScore > 0);

        let selectedVideo;

        if (matchingVideos.length > 0) {
            // Select a random video from the matching videos
            const randomIndex = Math.floor(Math.random() * matchingVideos.length);
            selectedVideo = matchingVideos[randomIndex];
        } else {
            // No matching videos found, select a random video from all videos
            const randomIndex = Math.floor(Math.random() * activeVideos.length);
            selectedVideo = activeVideos[randomIndex];
        }

        // Proceed to add the messages to the user's displayMessages collection
        conversationHistory.push({ "role": "assistant", "content": `${girl.name} le respondió al User diciendo: '${userWantsVideo.content}'. ${girl.name} tambien le envió un video al User` });

        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');

        let contentText;
        if (userWantsVideo.content === '') {
            // Set the contentText to a random emoji
            contentText = '😘';
        } else {
            contentText = userWantsVideo.content;
        }

        // Add the assistant's message with the selected video
        await displayMessageRef.add({
            role: 'assistant',
            content: contentText,
            video: selectedVideo.video, // Ensure the video URL is stored in selectedVideo.video
            mediaType: 'video',
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

        let assistantMessageProcess = processAssistantMessage(userWantsVideo.content);

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
            if (index === assistantMessageProcess.length - 1 && girl.videosEnabled) {
                response.displayLink = true;
            }
            await displayMessageRef.add(response);
        }

        return { success: true, updatedHistory: conversationHistory };
    }
}