// hooks/useRealtimeChats.js
import { useEffect } from 'react';
import { onSnapshot, doc, collection, query, orderBy } from 'firebase/firestore';
import {db} from "@/app/utils/firebaseClient"; // Adjust this import based on your Firebase config path
import { useStore } from '@/app/store/store';


export const useRealtimeConversation = ({ userId, girlId }) => {
    const setConversationHistory = useStore((state) => state.setConversationHistory);


    useEffect(() => {
        if (!userId || !girlId) return;

        // Reference to messages collection
        const messagesRef = collection(
            db,
            'users',
            userId,
            'conversations',
            girlId,
            'displayMessages'
        );


        // Create queries with ordering
        const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));


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
        };
    }, [userId, girlId]);
};