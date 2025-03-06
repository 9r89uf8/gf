// app/utils/admin/conversationLimitsAdmin.js
import { v4 as uuidv4 } from 'uuid';
import { adminDb } from '@/app/utils/firebaseAdmin';
import {getConversationLimits, refillConversationLimits} from "@/app/api/chat/conversationLimits/route";
import { updateUserMessages } from '@/app/utils/chat/userHandler';


/**
 * Refill free messages and audio for all conversations of a specific user
 * @param {string} userId - The user ID
 * @param {number} audioAmount - Amount of free audio to refill (default: 5)
 * @param {number} messagesAmount - Amount of free messages to refill (default: 20)
 * @returns {Promise<Array>} - Array of results with conversation IDs and updated limits
 */
export async function refillAllConversationsForUser(userId, audioAmount = 5, messagesAmount = 20) {
    const conversationsRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations');

    const snapshot = await conversationsRef.get();

    if (snapshot.empty) {
        console.log(`No conversations found for user ${userId}`);
        return [];
    }

    const results = [];

    for (const doc of snapshot.docs) {
        const girlId = doc.id;
        const updatedLimits = await refillConversationLimits(userId, girlId, audioAmount, messagesAmount);

        results.push({
            girlId,
            updatedLimits
        });
    }

    console.log(`Refilled limits for ${results.length} conversations of user ${userId}`);
    return results;
}

/**
 * Set specific limits for a conversation
 * @param {string} userId - The user ID
 * @param {string} girlId - The girl ID
 * @param {object} newLimits - Object with new limit values
 * @returns {Promise<object>} - Updated limits
 */
export async function setConversationLimits(userId, girlId, newLimits) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    const doc = await conversationRef.get();

    if (!doc.exists) {
        console.log(`Conversation not found for user ${userId} with girl ${girlId}`);
        throw new Error('Conversation not found');
    }

    await conversationRef.update({
        limits: newLimits
    });

    console.log(`Updated limits for user ${userId} with girl ${girlId}:`, newLimits);

    // Get and return the updated limits
    const updatedDoc = await conversationRef.get();
    return updatedDoc.data().limits;
}

/**
 * Get all conversation limits for a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Array>} - Array of objects with girl IDs and their respective limits
 */
export async function getAllConversationLimitsForUser(userId) {
    const conversationsRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations');

    const snapshot = await conversationsRef.get();

    if (snapshot.empty) {
        console.log(`No conversations found for user ${userId}`);
        return [];
    }

    const results = [];

    for (const doc of snapshot.docs) {
        const girlId = doc.id;
        const data = doc.data();
        const limits = data.limits || {};

        // If no limits are set, initialize them
        if (!data.limits) {
            await setConversationLimits(userId, girlId, {
                freeAudio: 5,
                freeMessages: 20
            });
        }

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlName = girlDoc.exists ? girlDoc.data().name : 'Unknown';

        results.push({
            girlId,
            girlName,
            limits: data.limits || { freeAudio: 5, freeMessages: 20 }
        });
    }

    return results;
}

/**
 * Add a notification to the user about their conversation limits
 * @param {string} userId - The user ID
 * @param {string} girlId - The girl ID
 * @param {string} message - The notification message
 * @returns {Promise<void>}
 */
export async function addLimitNotification(userId, girlId, message) {
    const conversationRef = adminDb.firestore()
        .collection('users')
        .doc(userId)
        .collection('conversations')
        .doc(girlId);

    const displayMessageRef = conversationRef.collection('displayMessages');

    // Add system notification
    await displayMessageRef.add({
        uid: uuidv4(),
        role: "system",
        content: message,
        timestamp: adminDb.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Added notification to user ${userId} for conversation with girl ${girlId}`);
}

/**
 * Reset limits for all users - could be used for daily/weekly reset
 * @param {number} audioAmount - Amount of free audio to set (default: 5)
 * @param {number} messagesAmount - Amount of free messages to set (default: 20)
 * @returns {Promise<void>}
 */
export async function resetAllUsersLimits(audioAmount = 5, messagesAmount = 20) {
    const usersRef = adminDb.firestore().collection('users');
    const usersSnapshot = await usersRef.get();

    if (usersSnapshot.empty) {
        console.log('No users found');
        return;
    }

    const promises = [];

    for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        // Skip premium users if needed
        const userData = userDoc.data();
        if (userData.isPremium) {
            console.log(`Skipping premium user ${userId}`);
            continue;
        }

        promises.push(refillAllConversationsForUser(userId, audioAmount, messagesAmount));
    }

    await Promise.all(promises);
    console.log(`Reset limits for all users: audio=${audioAmount}, messages=${messagesAmount}`);
}