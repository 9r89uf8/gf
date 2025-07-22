// app/api/v2/conversations/clear-messages/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { clearConversationMessages } from '@/app/api/v2/services/conversationService';


export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function clearMessagesHandler(req) {
    try {
        const body = await req.json();
        const { userId, girlId } = body;

        // Validate required parameters
        if (!userId || !girlId) {
            return new Response(JSON.stringify({ 
                error: 'userId and girlId are required' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Verify user exists
        const userDoc = await adminDb.firestore().collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return new Response(JSON.stringify({ 
                error: 'User not found' 
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Clear conversation messages
        const result = await clearConversationMessages(userId, girlId);

        return new Response(JSON.stringify({
            success: true,
            message: 'All messages cleared successfully',
            conversationId: result.conversationId
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error clearing conversation messages:', error);
        
        // Handle specific errors
        if (error.message === 'Conversation not found') {
            return new Response(JSON.stringify({ 
                error: 'Conversation not found' 
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ 
            error: 'Failed to clear messages',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Apply rate limiting
export const POST = clearMessagesHandler