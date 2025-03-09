// app/utils/chat/imageHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import {decrementFreeImage, getConversationLimits, updateGirIsTyping} from "@/app/api/chat/conversationLimits/route";
const {v4: uuidv4} = require("uuid");

function removeHashSymbols(text) {
    return text.replace(/#/g, '');
}

export async function handleVideoRequest(
    userWantsVideo,
    userData,
    girlId,
    userId,
    conversationHistory,
    girl,
    userMessage
) {
    const conversationLimits = await getConversationLimits(userId, girlId);
    const freeImagesRemaining = conversationLimits.freeImages;
    // Handle premium users
    if ((userData.premium || freeImagesRemaining > 0)&&girl.imagesEnabled) {
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
        conversationHistory.push({ "role": "assistant", "content": userWantsVideo.content });

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

        // Display the messages
        await updateGirIsTyping(userId, girlId)
        // Add the assistant's message with the selected video
        await displayMessageRef.add({
            role: 'assistant',
            content: contentText,
            video: selectedVideo.video, // Ensure the video URL is stored in selectedVideo.video
            mediaType: 'video',
            respondingTo: userMessage.content,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
        });

        // Update user's freeImages count only if they're not premium
        if (!userData.premium && freeImagesRemaining > 0) {
            await decrementFreeImage(userId, girlId)
        }

        return { success: true, updatedHistory: conversationHistory };
    }
    // Handle non-premium users
    else {
        const processAssistantMessage = (assistantMessage) => {
            // No longer splitting the message
            return [{
                uid: uuidv4(),
                role: "assistant",
                liked: false,
                displayLink: false,
                respondingTo: userMessage.content,
                content: removeHashSymbols(assistantMessage),
                timestamp: adminDb.firestore.FieldValue.serverTimestamp()
            }];
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

        // Display the messages
        await conversationRef.update({ girlIsTyping: false });
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