//useMessageResponder
import { useEffect, useRef, useState } from 'react';
import { onSnapshot, doc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from "@/app/utils/firebaseClient";
import { responseFromLLM } from '@/app/services/chatService';

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

export const useMessageResponder = ({ userId, girlId }) => {
    const MAX_RETRIES = 3;
    const responseCheckIntervalRef = useRef(null);
    const respondUntilRef = useRef(null);
    const isProcessingRef = useRef(false); // Track if we're currently processing a response
    const [hasUnprocessedMessages, setHasUnprocessedMessages] = useState(false);

    // Function to check for unprocessed messages and call LLM if respondUntil has passed
    const checkUnprocessedMessages = async () => {
        // Prevent multiple simultaneous calls
        if (!userId || !girlId || isProcessingRef.current) return;

        try {
            // First check if there are unprocessed messages without triggering a response
            const messagesRef = collection(db, 'users', userId, 'conversations', girlId, 'displayMessages');
            const unprocessedQuery = query(
                messagesRef,
                where('processed', '==', false),
                where('status', 'not-in', ['error']) // Ignore messages already marked with error
            );
            const querySnapshot = await getDocs(unprocessedQuery);

            const hasMessages = !querySnapshot.empty;
            setHasUnprocessedMessages(hasMessages);

            if (hasMessages) {
                const currentTime = new Date();
                const respondUntilDate = convertFirestoreTimestampToDate(respondUntilRef.current);

                // Only proceed if respondUntil has passed
                if (!respondUntilDate || currentTime >= respondUntilDate) {
                    // Set processing flag to prevent duplicate calls
                    isProcessingRef.current = true;
                    // console.log('Response delay passed, generating response...');

                    try {
                        const formData = new FormData();
                        formData.append('userId', userId);
                        formData.append('girlId', girlId);

                        // Get the first unprocessed message to work with
                        const messageDoc = querySnapshot.docs[0];
                        const messageData = messageDoc.data();
                        const messageId = messageDoc.id;

                        // Track retries for this specific message
                        const currentRetries = messageData.retryCount || 0;

                        // Add message ID to formData
                        formData.append('messageId', messageId);

                        const result = await responseFromLLM(formData);

                        // Get reference to the message document
                        const messageRef = doc(db, 'users', userId, 'conversations', girlId, 'displayMessages', messageId);

                        if (result && result.success) {
                            // Success! No need to update retry count
                            // The API endpoint should mark the message as processed
                        } else {
                            // Failed - update retry count
                            if (currentRetries >= MAX_RETRIES - 1) {
                                // We've reached max retries, mark as error
                                await updateDoc(messageRef, {
                                    status: 'error',
                                    errorMessage: result?.error || 'Max retry attempts reached',
                                    lastErrorTimestamp: new Date()
                                });
                                console.log(`Message ${messageId} failed after ${MAX_RETRIES} attempts`);
                            } else {
                                // Increment retry counter
                                await updateDoc(messageRef, {
                                    retryCount: currentRetries + 1,
                                    lastRetryTimestamp: new Date()
                                });
                                console.log(`Retry attempt ${currentRetries + 1}/${MAX_RETRIES} for message ${messageId}`);
                            }
                        }
                    } catch (error) {
                        console.error('Error handling LLM response:', error);
                    } finally {
                        // Clear the respondUntil reference after processing
                        respondUntilRef.current = null;
                        // Reset processing flag when done
                        isProcessingRef.current = false;
                    }
                } else {
                    const remainingSeconds = Math.ceil((respondUntilDate - currentTime) / 1000);
                    // console.log(`Waiting for response delay: ${remainingSeconds}s remaining`);
                }
            }
        } catch (error) {
            console.error('Error checking unprocessed messages:', error);
            isProcessingRef.current = false;
        }
    };

    // Set up a listener for conversation updates to get the respondUntil timestamp
    useEffect(() => {
        if (!userId || !girlId) return;

        const conversationRef = doc(db, 'users', userId, 'conversations', girlId);
        const unsubscribe = onSnapshot(conversationRef, (snapshot) => {
            const conversationData = snapshot.data();
            if (!conversationData) return;

            // Store the respondUntil timestamp for later checks
            respondUntilRef.current = conversationData.respondUntil;

            // Don't trigger checkUnprocessedMessages here to avoid race conditions
            // Let the interval handle the checking
        }, (error) => {
            console.error('Error in conversation subscription:', error);
        });

        // Cleanup function
        return () => {
            unsubscribe();
        };
    }, [userId, girlId]);

    // Set up a separate interval to check for messages ready to be responded to
    useEffect(() => {
        if (!userId || !girlId) return;

        // Clear any existing interval
        if (responseCheckIntervalRef.current) {
            clearInterval(responseCheckIntervalRef.current);
        }

        // Set up interval to check for messages that might be ready for response
        // Use a longer interval to reduce unnecessary checks
        responseCheckIntervalRef.current = setInterval(() => {
            if (!isProcessingRef.current) {
                checkUnprocessedMessages();
            }
        }, 2000); // Check every 2 seconds instead of every 1 second

        return () => {
            if (responseCheckIntervalRef.current) {
                clearInterval(responseCheckIntervalRef.current);
                responseCheckIntervalRef.current = null;
            }
        };
    }, [userId, girlId]);

    return {
        hasUnprocessedMessages,
        checkUnprocessedMessages
    };
};