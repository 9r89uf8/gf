// app/api/v2/conversations/get-conversation/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { getConversationById } from '@/app/api/v2/utils/conversationHelpers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getConversationHandler(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');
        const girlId = searchParams.get('girlId');

        if (!userId || !girlId) {
            return new Response(JSON.stringify({ error: 'userId and girlId are required' }), {
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

        // Get conversation
        const conversation = await getConversationById(userId, girlId);
        
        if (!conversation) {
            return new Response(JSON.stringify({ 
                conversation: null,
                messages: []
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, max-age=0'
                }
            });
        }

        // Sort messages by timestamp and handle different timestamp formats
        const sortedMessages = (conversation.messages || []).sort((a, b) => {
            let aTime, bTime;
            
            // Handle different timestamp formats
            if (a.timestamp instanceof Date) {
                aTime = a.timestamp;
            } else if (a.timestamp?.toDate) {
                aTime = a.timestamp.toDate();
            } else {
                aTime = new Date(a.timestamp);
            }
            
            if (b.timestamp instanceof Date) {
                bTime = b.timestamp;
            } else if (b.timestamp?.toDate) {
                bTime = b.timestamp.toDate();
            } else {
                bTime = new Date(b.timestamp);
            }
            
            return aTime - bTime;
        });

        return new Response(JSON.stringify({
            conversation: {
                id: conversation.id,
                userId: conversation.userId,
                girlId: conversation.girlId,
                lastActivity: conversation.lastActivity,
                latestMessage: conversation.latestMessage,
                freeAudio: conversation.freeAudio || 0,
                freeImages: conversation.freeImages || 0,
                freeMessages: conversation.freeMessages || 0
            },
            messages: sortedMessages
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error getting conversation:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Apply rate limiting
export const GET = getConversationHandler