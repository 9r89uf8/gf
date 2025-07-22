// app/api/v2/admin/conversations/recent/route.js
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req) {
    try {
        // 1. Authenticate user
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }

        const userId = authResult.user.uid;
        
        // 2. Check if user is admin
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }

        // 3. Get query params
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        // 4. Fetch recent conversations
        const conversationsSnapshot = await adminDb.firestore()
            .collection('conversations')
            .orderBy('lastActivity', 'desc')
            .limit(limit + offset)
            .get();

        const conversations = [];
        const conversationDocs = conversationsSnapshot.docs.slice(offset, offset + limit);

        // 5. Process each conversation
        for (const doc of conversationDocs) {
            const conversationData = doc.data();
            const [userIdFromConv, girlIdFromConv] = doc.id.split('_');

            // Get user data
            const userDoc = await adminDb.firestore()
                .collection('users')
                .doc(userIdFromConv)
                .get();
            
            const userData = userDoc.exists ? userDoc.data() : null;

            // Get girl data
            const girlDoc = await adminDb.firestore()
                .collection('girls')
                .doc(girlIdFromConv)
                .get();
            
            const girlData = girlDoc.exists ? girlDoc.data() : null;

            // Format messages
            const messages = (conversationData.messages || [])
                .map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp
                }))
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            conversations.push({
                id: doc.id,
                userId: userIdFromConv,
                girlId: girlIdFromConv,
                user: userData ? {
                    name: userData.name || 'Unknown User',
                    email: userData.email,
                    profilePic: userData.profilePic,
                    premium: userData.premium || false
                } : null,
                girl: girlData ? {
                    name: girlData.name || 'Unknown Girl',
                    username: girlData.username,
                    pictureUrl: girlData.pictureUrl,
                    audioEnabled: girlData.audioEnabled || false,
                    imagesEnabled: girlData.imagesEnabled || false
                } : null,
                messages: messages,
                messageCount: messages.length,
                lastActivity: conversationData.lastActivity?.toDate ? 
                    conversationData.lastActivity.toDate() : 
                    conversationData.lastActivity,
                limits: {
                    freeMessages: conversationData.freeMessages || 0,
                    freeAudio: conversationData.freeAudio || 0,
                    freeImages: conversationData.freeImages || 0
                }
            });
        }

        // 6. Check if there are more conversations
        const totalCount = conversationsSnapshot.size;
        const hasMore = (offset + limit) < totalCount;

        return NextResponse.json({
            conversations,
            pagination: {
                offset,
                limit,
                total: totalCount,
                hasMore
            }
        }, { 
            status: 200,
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });

    } catch (error) {
        console.error('Error fetching recent conversations:', error);
        return NextResponse.json({ 
            error: error.message || 'Failed to fetch conversations' 
        }, { 
            status: 500 
        });
    }
}