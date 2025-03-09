// hooks/useRealtimeChats.js
import { useEffect } from 'react';
import { onSnapshot, doc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "@/app/utils/firebaseClient";
import { useStore } from '@/app/store/store';

export const useRealtimeConversation = ({ userId, girlId }) => {
    const setConversationHistory = useStore((state) => state.setConversationHistory);
    const setConversationLimits = useStore((state) => state.setConversationLimits);
    const setGirlIsTyping = useStore((state) => state.setGirlIsTyping);

    useEffect(() => {
        if (!userId || !girlId) return;

        // Reference to the parent conversation document
        const conversationDocRef = doc(
            db,
            'users',
            userId,
            'conversations',
            girlId
        );

        // Reference to messages subcollection
        const messagesRef = collection(conversationDocRef, 'displayMessages');

        // Create query with ordering
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

        // Set up listener for conversation limits
        const limitsUnsubscribe = onSnapshot(conversationDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                if (data) {
                    setGirlIsTyping(data.girlIsTyping || false);

                    // Only set limits if they exist and have meaningful values
                    if (data.limits) {
                        setConversationLimits({
                            freeAudio: data.limits.freeAudio || 0,
                            freeImages: data.limits.freeImages || 0,
                            freeMessages: data.limits.freeMessages || 0
                        });
                    } else {
                        setConversationLimits(null); // Reset to null if no limits
                    }
                }
            } else {
                // Document doesn't exist, explicitly reset state
                setConversationLimits(null);
                setGirlIsTyping(false);
            }
        }, (error) => {
            console.error('Error in limits subscription:', error);
        });

        // Set up message listener
        const messageUnsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConversationHistory(messages);
        }, (error) => {
            console.error('Error in messages subscription:', error);
        });

        // Cleanup both subscriptions on unmount
        return () => {
            messageUnsubscribe();
            limitsUnsubscribe();
        };
    }, [userId, girlId, setConversationHistory, setConversationLimits]);
};