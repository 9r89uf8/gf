import {adminDb} from '@/app/utils/firebaseAdmin';
import axios from 'axios';
import {uploadToFirebaseStorage} from "@/app/middleware/firebaseStorage";
import {determineOfflineStatus} from "@/app/utils/chat/girlOfflineHandler";
const { DateTime } = require('luxon');

const {v4: uuidv4} = require("uuid");

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getOrCreateConversationHistory(doc) {
    if (doc.exists) {
        // Retrieve only user and assistant messages for display
        const messages = doc.data().messages.filter(message => message.role !== 'system');
        return messages;
    } else {
        // Return an empty array; system prompts will be added later for LLM processing
        return [];
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const userId = formData.get('userId');
        const girlId = formData.get('girlId');
        let userMessage = formData.get('userMessage');
        const file = formData.get('image');

        const userDocF = await adminDb.firestore()
            .collection('users')
            .doc(userId)
            .get();
        const userData = userDocF.data();

        const girlDoc = await adminDb.firestore().collection('girls').doc(girlId).get();
        const girlData = girlDoc.data();


        // Get the conversation history from Firestore
        const conversationRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId);

        let doc = await conversationRef.get();
        let conversationHistory = doc.exists ? doc.data().messages : await getOrCreateConversationHistory(doc, userData, girlData);



        let fileUrl = null;
        if (file) {
            const fileExtension = file.type.split('/')[1];
            const filePath = `users-pictures/${uuidv4()}.${fileExtension}`;

            // Convert the file to a buffer
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fileUrl = await uploadToFirebaseStorage(buffer, filePath, file.mimetype);
        }

        // Add user's message to the conversation history
        conversationHistory.push({ role: 'user', content: userMessage });


        const displayMessageRef = adminDb.firestore()
            .collection('users')
            .doc(userId)
            .collection('conversations')
            .doc(girlId)
            .collection('displayMessages');
        await displayMessageRef.add({
            role: 'user',
            content: userMessage,
            image: fileUrl,
            liked: false,
            sent: true,
            seen: false,
            processed: false,
            timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
        });

        // Save the updated conversation history back to Firestore
        // After adding the message to 'displayMessages'

        const currentDoc = await conversationRef.get();
        const currentOnlineStatus = currentDoc.exists ? currentDoc.data().isGirlOnline : null;

        // Create base update object
        const updateData = {
            messages: conversationHistory,
            lastMessage: {
                content: userMessage,
                timestamp: adminDb.firestore.FieldValue.serverTimestamp(),
                sender: 'user'
            }
        };

        // Only check and update online status if currently online
        if (currentOnlineStatus) {
            const offlineStatus = await determineOfflineStatus(currentOnlineStatus, currentDoc.data());
            if (offlineStatus) {  // Add a null check
                updateData.isGirlOnline = offlineStatus.isGirlOnline;
                updateData.girlOfflineUntil = offlineStatus.girlOfflineUntil;
            }
        }

        await conversationRef.set(updateData, { merge: true });

        let updatedUserData;

        const userRef = adminDb.firestore().collection('users').doc(userId);
        await userRef.update({
            freeMessages: adminDb.firestore.FieldValue.increment(-1)
        });
        // Retrieve the updated user data from Firestore
        const updatedUserDoc = await userRef.get();
        updatedUserData = updatedUserDoc.data();


        return new Response(JSON.stringify({updatedUserData, girlName: girlData.name }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.log(error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}