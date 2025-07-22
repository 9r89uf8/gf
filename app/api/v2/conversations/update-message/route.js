// app/api/v2/conversations/update-message/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { updateMessageInConversation } from '@/app/api/v2/utils/conversationHelpers';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function updateMessageHandler(req) {
    try {
        const body = await req.json();
        const { userId, girlId, messageId, updates } = body;

        if (!userId || !girlId || !messageId || !updates) {
            return new Response(JSON.stringify({ 
                error: 'userId, girlId, messageId, and updates are required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verify user exists
        const userDoc = await adminDb.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate allowed updates
        const allowedUpdates = ['liked', 'displayLink'];
        const validUpdates = {};
        
        for (const [key, value] of Object.entries(updates)) {
            if (allowedUpdates.includes(key)) {
                validUpdates[key] = value;
            }
        }

        if (Object.keys(validUpdates).length === 0) {
            return new Response(JSON.stringify({ 
                error: 'No valid updates provided' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Update message in conversation
        const updatedMessage = await updateMessageInConversation(userId, girlId, messageId, validUpdates);

        if (!updatedMessage) {
            return new Response(JSON.stringify({ error: 'Message not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: updatedMessage
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error updating message:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Apply rate limiting
export const POST = updateMessageHandler