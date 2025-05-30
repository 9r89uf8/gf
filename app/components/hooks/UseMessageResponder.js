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

            // FIXED QUERY: We can't use both '!=' and 'not-in' in Firestore
            // So we'll use simple filters and handle additional filtering in memory
            const unprocessedQuery = query(
                messagesRef,
                where('role', '==', 'user'),
                where('processed', '==', false),
                where('isProcessing', '==', false) // Only get messages not being processed
            );

            const querySnapshot = await getDocs(unprocessedQuery);

            // Filter out messages with error status in memory
            const validMessages = querySnapshot.docs.filter(doc => {
                const data = doc.data();
                return data.status !== 'error';
            });

            const hasMessages = validMessages.length > 0;
            setHasUnprocessedMessages(hasMessages);

            if (hasMessages) {
                const currentTime = new Date();
                const respondUntilDate = convertFirestoreTimestampToDate(respondUntilRef.current);

                // Only proceed if respondUntil has passed
                if (!respondUntilDate || currentTime >= respondUntilDate) {
                    // Set processing flag to prevent duplicate calls
                    isProcessingRef.current = true;

                    // Get reference to the conversation document
                    const conversationRef = doc(db, 'users', userId, 'conversations', girlId);

                    try {
                        // Update the conversation to show the girl is typing
                        // await updateDoc(conversationRef, {
                        //     girlIsTyping: true
                        // });

                        const formData = new FormData();
                        formData.append('userId', userId);
                        formData.append('girlId', girlId);

                        // Get the first unprocessed message to work with (from our filtered list)
                        const messageDoc = validMessages[0];
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
                                    isProcessing: false, // Clear processing flag
                                    errorMessage: result?.error || 'Max retry attempts reached',
                                    lastErrorTimestamp: new Date()
                                });
                                console.log(`Message ${messageId} failed after ${MAX_RETRIES} attempts`);
                            } else {
                                // Increment retry counter
                                await updateDoc(messageRef, {
                                    retryCount: currentRetries + 1,
                                    isProcessing: false, // Clear processing flag
                                    lastRetryTimestamp: new Date()
                                });
                                console.log(`Retry attempt ${currentRetries + 1}/${MAX_RETRIES} for message ${messageId}`);
                            }
                        }
                    } catch (error) {
                        console.error('Error handling LLM response:', error);

                        // If we encounter an error here, make sure to reset isProcessing on the message
                        try {
                            const messageDoc = validMessages[0];
                            if (messageDoc) {
                                const messageRef = doc(db, 'users', userId, 'conversations', girlId, 'displayMessages', messageDoc.id);
                                await updateDoc(messageRef, {
                                    isProcessing: false,
                                    processingError: error.message
                                });
                            }
                        } catch (resetError) {
                            console.error('Error resetting message processing status:', resetError);
                        }

                        // Also make sure to reset girlIsTyping
                        try {
                            const conversationRef = doc(db, 'users', userId, 'conversations', girlId);
                            await updateDoc(conversationRef, {
                                girlIsTyping: false
                            });
                        } catch (updateError) {
                            console.error('Error resetting girlIsTyping after error:', updateError);
                        }
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

            // Make sure to reset girlIsTyping if there's an error
            try {
                const conversationRef = doc(db, 'users', userId, 'conversations', girlId);
                await updateDoc(conversationRef, {
                    girlIsTyping: false
                });
            } catch (updateError) {
                console.error('Error resetting girlIsTyping after error:', updateError);
            }

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

        // Reset any stuck messages on component mount
        // resetStuckMessages();

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