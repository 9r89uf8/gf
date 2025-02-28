// useMultipleMessageResponder.js
import { useEffect, useRef, useState } from 'react';
import { onSnapshot, doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from "@/app/utils/firebaseClient";
import { responseFromLLM, getChatList } from '@/app/services/chatService';


function convertFirestoreTimestampToDate(timestamp) {
    if (!timestamp) return null;
    if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
        return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
    }
    if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
        return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    }
    return new Date(timestamp);
}

export const useMultipleMessageResponder = ({ userId, chats }) => {
    const MAX_RETRIES = 3;
    const responseCheckIntervalRef = useRef(null);
    const respondUntilMapRef = useRef(new Map()); // Map to store respondUntil values by girlId
    const processingChatsRef = useRef(new Set()); // Track which chats are being processed
    const [unprocessedChatsMap, setUnprocessedChatsMap] = useState(new Map()); // Map to track which chats have unprocessed messages

    // Check all chats for unprocessed messages
    const checkAllUnprocessedMessages = async () => {
        if (!userId || !chats || chats.length === 0) return;

        const currentTime = new Date();
        const newUnprocessedMap = new Map(unprocessedChatsMap);

        // Process each chat
        for (const chat of chats) {
            const girlId = chat.girlId;

            // Skip if this chat is already being processed
            if (processingChatsRef.current.has(girlId)) {
                continue;
            }

            try {
                // Check for unprocessed messages, excluding those already marked with error
                const messagesRef = collection(db, 'users', userId, 'conversations', girlId, 'displayMessages');
                const unprocessedQuery = query(
                    messagesRef,
                    where('processed', '==', false),
                    where('status', 'not-in', ['error']) // Ignore messages already marked with error
                );
                const querySnapshot = await getDocs(unprocessedQuery);

                const hasUnprocessed = !querySnapshot.empty;

                // Update the unprocessed status in our local state map
                newUnprocessedMap.set(girlId, hasUnprocessed);

                if (hasUnprocessed) {
                    // Check if respondUntil time has passed
                    const respondUntilDate = convertFirestoreTimestampToDate(respondUntilMapRef.current.get(girlId));

                    if (!respondUntilDate || currentTime >= respondUntilDate) {
                        // Mark chat as being processed
                        processingChatsRef.current.add(girlId);

                        // console.log(`Generating response for chat with ${chat.girlName}...`);

                        try {
                            // Get the first unprocessed message to work with
                            const messageDoc = querySnapshot.docs[0];
                            const messageData = messageDoc.data();
                            const messageId = messageDoc.id;

                            // Track retries for this specific message
                            const currentRetries = messageData.retryCount || 0;

                            const formData = new FormData();
                            formData.append('userId', userId);
                            formData.append('girlId', girlId);
                            formData.append('messageId', messageId);

                            // Get reference to the message document
                            const messageRef = doc(db, 'users', userId, 'conversations', girlId, 'displayMessages', messageId);

                            const result = await responseFromLLM(formData);

                            if (!result || !result.success) {
                                // Failed - update retry count
                                if (currentRetries >= MAX_RETRIES - 1) {
                                    // We've reached max retries, mark as error
                                    await updateDoc(messageRef, {
                                        status: 'error',
                                        errorMessage: result?.error || 'Max retry attempts reached',
                                        lastErrorTimestamp: new Date()
                                    });
                                    console.log(`Message ${messageId} in chat with ${chat.girlName} failed after ${MAX_RETRIES} attempts`);
                                } else {
                                    // Increment retry counter
                                    await updateDoc(messageRef, {
                                        retryCount: currentRetries + 1,
                                        lastRetryTimestamp: new Date()
                                    });
                                    console.log(`Retry attempt ${currentRetries + 1}/${MAX_RETRIES} for message ${messageId} in chat with ${chat.girlName}`);
                                }
                            }

                            // Refresh the chat list to get the latest messages
                            await getChatList();
                        } catch (error) {
                            console.error(`Error handling LLM response for ${chat.girlName}:`, error);
                        } finally {
                            // Remove from processing set when done
                            processingChatsRef.current.delete(girlId);
                        }
                    } else {
                        const remainingSeconds = Math.ceil((respondUntilDate - currentTime) / 1000);
                        // console.log(`Waiting for response delay for ${chat.girlName}: ${remainingSeconds}s remaining`);
                    }
                }
            } catch (error) {
                console.error(`Error checking messages for ${chat.girlName}:`, error);
                processingChatsRef.current.delete(girlId);
            }
        }

        // Update state with new unprocessed statuses
        setUnprocessedChatsMap(newUnprocessedMap);
    };

    // The rest of your code remains the same
    // Set up listeners for all conversations to get respondUntil timestamps
    useEffect(() => {
        if (!userId || !chats || chats.length === 0) return;

        const unsubscribes = [];

        chats.forEach(chat => {
            const girlId = chat.girlId;
            const conversationRef = doc(db, 'users', userId, 'conversations', girlId);

            const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
                const conversationData = snapshot.data();
                if (!conversationData) return;

                // Store the respondUntil timestamp for this chat
                respondUntilMapRef.current.set(girlId, conversationData.respondUntil);
            }, (error) => {
                console.error(`Error in conversation subscription for ${chat.girlName}:`, error);
            });

            unsubscribes.push(unsubscribe);
        });

        // Cleanup function to unsubscribe from all listeners
        return () => {
            unsubscribes.forEach(unsubscribe => unsubscribe());
        };
    }, [userId, chats]);

    // Set up interval to periodically check for messages that need responses
    useEffect(() => {
        if (!userId || !chats || chats.length === 0) return;

        // Clear any existing interval
        if (responseCheckIntervalRef.current) {
            clearInterval(responseCheckIntervalRef.current);
        }

        // Check for unprocessed messages on mount
        checkAllUnprocessedMessages();

        // Set up interval to check for messages that might be ready for response
        responseCheckIntervalRef.current = setInterval(() => {
            checkAllUnprocessedMessages();
        }, 5000); // Check every 5 seconds

        return () => {
            if (responseCheckIntervalRef.current) {
                clearInterval(responseCheckIntervalRef.current);
                responseCheckIntervalRef.current = null;
            }
        };
    }, [userId, chats]);

    // Get total count of unprocessed chats
    const unprocessedChatsCount = Array.from(unprocessedChatsMap.values()).filter(Boolean).length;

    // Function to check if a specific chat has unprocessed messages
    const hasUnprocessedMessages = (girlId) => {
        return unprocessedChatsMap.get(girlId) || false;
    };

    return {
        unprocessedChatsCount,
        hasUnprocessedMessages,
        checkAllUnprocessedMessages
    };
};