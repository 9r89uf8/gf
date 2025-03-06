// app/utils/chat/imageHandler.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import {getConversationLimits, decrementFreeImage} from "@/app/api/chat/conversationLimits/route";
const {v4: uuidv4} = require("uuid");

function removeHashSymbols(text) {
    return text.replace(/#/g, '');
}

export async function handleImageRequest(
    userWantsImage,
    userData,
    girlId,
    userId,
    conversationHistory,
    girl,
    userMessage
) {
    const conversationLimits = await getConversationLimits(userId, girlId);
    const freeImagesRemaining = conversationLimits.freeImages;
// Handle premium users and users with free images
    if ((userData.premium || freeImagesRemaining > 0)&&girl.imagesEnabled) {
        let pictureDescription = userWantsImage.description.toLowerCase();

        // Create base query
        let picturesQuery = adminDb.firestore()
            .collection('pictures')
            .where('girlId', '==', girlId);

        // Add premium filter based on user status
        picturesQuery = picturesQuery.where('isPremium', '==', userData.premium);

        // Fetch pictures
        const picturesSnapshot = await picturesQuery.get();

        // Map the documents to an array of picture objects
        let activePic = picturesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // If no pictures found in the preferred category (premium/non-premium),
        // fall back to any pictures for this girlId as a backup
        if (activePic.length === 0) {
            const fallbackSnapshot = await adminDb.firestore()
                .collection('pictures')
                .where('girlId', '==', girlId)
                .get();
            activePic = fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

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
            respondingTo: userMessage.content,
            mediaType: 'image',
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
        // Modified to no longer split messages
        const processAssistantMessage = (assistantMessage) => {
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

        // Add message with display link if images are enabled
        for (const [index, response] of assistantMessageProcess.entries()) {
            if (index === assistantMessageProcess.length - 1 && girl.imagesEnabled) {
                response.displayLink = true;
            }
            await displayMessageRef.add(response);
        }

        return { success: true, updatedHistory: conversationHistory };
    }
}