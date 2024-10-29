import {adminDb} from '@/app/utils/firebaseAdmin';
// Helper function to get random number between min and max (inclusive)
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to determine if girl should go offline and for how long
export async function determineOfflineStatus (currentOnlineStatus, girl) {
    // If already offline, maintain offline status
    if (!currentOnlineStatus) {
        return {
            isGirlOnline: false,
            girlOfflineUntil: null
        };
    }

    // 30% chance of going offline
    const shouldGoOffline = Math.random() < 0.7;

    if (!shouldGoOffline) {
        return {
            isGirlOnline: girl.isGirlOnline,
            girlOfflineUntil: girl.girlOfflineUntil
        };
    }

    // Random duration between 5-20 seconds
    const offlineSeconds = getRandomNumber(9, 12);
    const currentTime = new Date();
    const offlineUntil = new Date(currentTime.getTime() + (offlineSeconds * 1000));

    return {
        isGirlOnline: false,
        girlOfflineUntil: adminDb.firestore.Timestamp.fromDate(offlineUntil)
    };
}