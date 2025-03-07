import {adminDb} from '@/app/utils/firebaseAdmin';

// Helper function to get random number between min and max (inclusive)
const getRandomDelay = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to set a response delay for more realistic conversations
export async function setResponseDelay() {
    // Set a random delay between 4-8 seconds (customize as needed)
    const delaySeconds = getRandomDelay(2, 6);
    const currentTime = new Date();
    const respondUntil = new Date(currentTime.getTime() + (delaySeconds * 1000));

    return {
        respondUntil: adminDb.firestore.Timestamp.fromDate(respondUntil)
    };
}