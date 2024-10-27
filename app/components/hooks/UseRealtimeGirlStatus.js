// hooks/useRealtimeGirlStatus.js
import { useEffect, useRef } from 'react';
import { onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from "@/app/utils/firebaseClient";
import { useStore } from '@/app/store/store';

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

export const useRealtimeGirlStatus = ({ userId, girlId }) => {
    const setGirlIsActive = useStore((state) => state.setGirlIsActive);
    const setGirlOfflineUntil = useStore((state) => state.setGirlOfflineUntil);
    const setLastSeenGirl = useStore((state) => state.setLastSeen);
    const checkIntervalRef = useRef(null);
    const conversationRefRef = useRef(null);
    const lastOfflineUntilRef = useRef(null);

    // Function to check and update active status
    const checkAndUpdateStatus = async () => {
        if (!lastOfflineUntilRef.current) return;

        const offlineUntilDate = convertFirestoreTimestampToDate(lastOfflineUntilRef.current);
        const currentTime = new Date();

        if (offlineUntilDate && offlineUntilDate < currentTime) {
            setGirlIsActive(true);
            setGirlOfflineUntil(null);

            // Update Firestore
            if (conversationRefRef.current) {
                try {
                    await updateDoc(conversationRefRef.current, {
                        isGirlOnline: true,
                        girlOfflineUntil: null,
                        lastSeen: null
                    });
                } catch (error) {
                    console.error('Error updating girl status:', error);
                }
            }

            // Clear the interval since we don't need to check anymore
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
        }
    };

    useEffect(() => {
        if (!girlId) return;

        let globalUnsubscribe;
        let userSpecificUnsubscribe;

        // Subscribe to global girl status
        const girlRef = doc(db, 'girls', girlId);
        globalUnsubscribe = onSnapshot(girlRef, (snapshot) => {
            const girlData = snapshot.data();
            setGirlIsActive(girlData?.isActive || false);
        }, (error) => {
            console.error('Error in girl status subscription:', error);
        });

        // Subscribe to user-specific conversation status if userId exists
        if (userId) {
            const conversationRef = doc(db, 'users', userId, 'conversations', girlId);
            conversationRefRef.current = conversationRef;

            userSpecificUnsubscribe = onSnapshot(conversationRef, (snapshot) => {
                const conversationData = snapshot.data();
                const girlOfflineUntilDate = convertFirestoreTimestampToDate(conversationData.girlOfflineUntil);
                const currentTime = new Date();

                // Store the latest offline until value
                lastOfflineUntilRef.current = conversationData.girlOfflineUntil;

                if (girlOfflineUntilDate && girlOfflineUntilDate < currentTime) {
                    setGirlIsActive(true);
                    setGirlOfflineUntil(null);
                    setLastSeenGirl(null)
                } else if (girlOfflineUntilDate) {
                    setGirlIsActive(false);
                    setGirlOfflineUntil(conversationData.girlOfflineUntil);
                    setLastSeenGirl(conversationData.lastSeen)

                    // Clear any existing interval
                    if (checkIntervalRef.current) {
                        clearInterval(checkIntervalRef.current);
                    }

                    // Set up new interval to check status
                    checkIntervalRef.current = setInterval(() => {
                        checkAndUpdateStatus();
                    }, 10000); // Check every 10 seconds
                }
            }, (error) => {
                console.error('Error in conversation status subscription:', error);
            });
        }

        // Cleanup function
        return () => {
            if (globalUnsubscribe) globalUnsubscribe();
            if (userSpecificUnsubscribe) userSpecificUnsubscribe();
            if (checkIntervalRef.current) {
                clearInterval(checkIntervalRef.current);
                checkIntervalRef.current = null;
            }
        };
    }, [userId, girlId]);
};