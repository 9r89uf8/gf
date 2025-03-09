// Implementation for tracking and managing conversation limits per girl
import { adminDb } from '@/app/utils/firebaseAdmin';
// Function to initialize limits for a new conversation with a girl
export async function initializeConversationLimits(userId, girlId, initialLimits = {
    freeAudio: 3, // Default number of free audio messages
    freeMessages: 20,  // Default number of free text messages
    freeImages: 1
}) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    // Get the conversation document
    const conversationDoc = await conversationRef.get();

    // Only initialize if the conversation exists but limits don't
    if (conversationDoc.exists && !conversationDoc.data().limits) {
        await conversationRef.update({
            limits: initialLimits
        });

        console.log(`Initialized limits for user ${userId} with girl ${girlId}: `, initialLimits);
        return initialLimits;
    } else if (conversationDoc.exists) {
        // Return existing limits
        return conversationDoc.data().limits || initialLimits;
    }

    // If conversation doesn't exist yet, create it with limits
    await conversationRef.set({
        messages: [],
        girlIsTyping: false,
        limits: initialLimits
    });

    console.log(`Created new conversation for user ${userId} with girl ${girlId} with limits: `, initialLimits);
    return initialLimits;
}

// Function to get current limits for a conversation
export async function getConversationLimits(userId, girlId) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    const doc = await conversationRef.get();

    if (!doc.exists) {
        // If conversation doesn't exist, initialize it
        return initializeConversationLimits(userId, girlId);
    }

    const data = doc.data();

    // If limits don't exist in the conversation, initialize them
    if (!data.limits) {
        return initializeConversationLimits(userId, girlId);
    }

    return data.limits;
}

// Function to update a specific limit for a conversation
export async function updateConversationLimit(userId, girlId, limitType, increment) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    // Make sure limits exist first
    await getConversationLimits(userId, girlId);

    // Update the specific limit with the increment
    await conversationRef.update({
        [`limits.${limitType}`]: adminDb.firestore.FieldValue.increment(increment)
    });

    // Get and return the updated limits
    const updatedDoc = await conversationRef.get();
    return updatedDoc.data().limits;
}

// Function to decrement audio count when an audio is produced
export async function decrementFreeAudio(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);

    // Only decrement if there are free audios available
    if (limits.freeAudio > 0) {
        return updateConversationLimit(userId, girlId, 'freeAudio', -1);
    }

    return limits;
}

// Function to update the girls is typing
export async function updateGirIsTyping(userId, girlId) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    await conversationRef.update({ girlIsTyping: false });

    return 'updated girlIsTyping';
}

// Function to decrement images count when an image is produced
export async function decrementFreeImage(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);

    // Only decrement if there are free audios available
    if (limits.freeImages > 0) {
        return updateConversationLimit(userId, girlId, 'freeImages', -1);
    }

    return limits;
}

// Function to decrement message count when a message is sent
export async function decrementFreeMessages(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);

    // Only decrement if there are free messages available
    if (limits.freeMessages > 0) {
        return updateConversationLimit(userId, girlId, 'freeMessages', -1);
    }

    return limits;
}

// Function to check if user has free audio messages left with a specific girl
export async function hasFreeAudioLeft(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);
    return limits.freeAudio > 0;
}

// Function to check if user has free text messages left with a specific girl
export async function hasFreeMessagesLeft(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);
    return limits.freeMessages > 0;
}

// Function to check if user has free text messages left with a specific girl
export async function hasFreeImagesLeft(userId, girlId) {
    const limits = await getConversationLimits(userId, girlId);
    return limits.freeImages > 0;
}

// Function to refill limits (could be used for premium features or daily refills)
export async function refillConversationLimits(userId, girlId, audioAmount = 5, messagesAmount = 20, imagesAmount = 3) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    await conversationRef.update({
        'limits.freeAudio': audioAmount,
        'limits.freeMessages': messagesAmount,
        'limits.freeImages': imagesAmount

    });

    console.log(`Refilled limits for user ${userId} with girl ${girlId}`);

    // Get and return the updated limits
    const updatedDoc = await conversationRef.get();
    return updatedDoc.data().limits;
}