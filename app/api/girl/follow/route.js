import { adminAuth, adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: authResult.error }, { status: 401 });
        }
        const userId = authResult.user.uid;

        const { girlId } = await req.json();

        // Reference to the specific girl document
        const girlRef = adminDb.firestore().collection('girls').doc(girlId);

        // Get the girl document
        const girlDoc = await girlRef.get();

        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        // Get the current girl data
        const girlData = girlDoc.data();

        // Initialize followers array if it doesn't exist
        let followers = girlData.followers || [];
        let followersCount = girlData.followersCount || 0;

        // Check if the user is already following
        const isFollowing = followers.includes(userId);

        if (isFollowing) {
            // Unfollow: Remove userId from followers array
            followers = followers.filter(id => id !== userId);
            followersCount = Math.max(followersCount - 1, 0);
        } else {
            // Follow: Add userId to followers array
            followers.push(userId);
            followersCount += 1;
        }

        // Update the girl document
        await girlRef.update({
            followers: followers,
            followersCount: followersCount
        });

        // Return the new followers array, followersCount, and follow status
        return NextResponse.json({
            followers,
            followersCount,
            isFollowing: !isFollowing
        }, { status: 200 });
    } catch (error) {
        console.error('Error updating followers:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}