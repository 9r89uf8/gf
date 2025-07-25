import { adminDb } from '@/app/utils/firebaseAdmin';
import { uploadToS3 } from '@/app/api/v2/utils/s3Upload';
import { RekognitionClient, DetectModerationLabelsCommand, DetectLabelsCommand } from "@aws-sdk/client-rekognition";
import { v4 as uuidv4 } from 'uuid';

const CLOUDFRONT_BASE_URL = 'https://d3sog3sqr61u3b.cloudfront.net';

const rekognitionClient = new RekognitionClient({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
});

function buildImageDescription(labels) {
    let description = "This image contains: ";
    const topLabels = labels.slice(0, 5).map(label => label.Name.toLowerCase());
    description += topLabels.join(", ");
    return description;
}

export async function createPost(userId, imageFile, text = '') {
    try {
        const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
        
        const moderationParams = {
            Image: { Bytes: fileBuffer },
            MinConfidence: 75
        };
        const moderationCommand = new DetectModerationLabelsCommand(moderationParams);
        const moderationResponse = await rekognitionClient.send(moderationCommand);
        
        const hasChild = moderationResponse.ModerationLabels.some(label =>
            ['Child', 'Minor', 'Kid'].some(term => label.Name.includes(term))
        );
        
        if (hasChild) {
            throw new Error('Images containing children are not allowed');
        }
        
        const labelsParams = {
            Image: { Bytes: fileBuffer },
            MaxLabels: 10,
            MinConfidence: 70,
        };
        const labelsCommand = new DetectLabelsCommand(labelsParams);
        const labelsResponse = await rekognitionClient.send(labelsCommand);
        
        const llmDescription = buildImageDescription(labelsResponse.Labels);
        
        const imageId = uuidv4();
        const s3Key = `posts/${userId}/${imageId}`;
        const s3Url = await uploadToS3(imageFile, s3Key);
        
        // Extract just the key path from the S3 URL
        const imagePath = s3Url.replace('https://finaltw.s3.amazonaws.com/', '');
        
        const postData = {
            userId,
            imagePath, // Store just the S3 key path
            text: text || '',
            llmDescription,
            likes: [],
            comments: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const postRef = await adminDb.firestore().collection('posts').add(postData);
        
        return {
            id: postRef.id,
            ...postData,
            imageUrl: `${CLOUDFRONT_BASE_URL}/${imagePath}` // Return CloudFront URL for display
        };
        
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
}

export async function getUserPosts(userId, limit = 20) {
    try {
        const snapshot = await adminDb.firestore()
            .collection('posts')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        
        const posts = [];
        snapshot.forEach(doc => {
            const postData = doc.data();
            posts.push({
                id: doc.id,
                ...postData,
                imageUrl: `${CLOUDFRONT_BASE_URL}/${postData.imagePath}` // Convert to CloudFront URL
            });
        });
        
        return posts;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
}

export async function deletePost(postId, userId) {
    try {
        const postRef = adminDb.firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        
        if (!postDoc.exists) {
            throw new Error('Post not found');
        }
        
        const postData = postDoc.data();
        if (postData.userId !== userId) {
            throw new Error('Unauthorized: You can only delete your own posts');
        }
        
        await postRef.delete();
        
        return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}

export async function addAILike(postId, girlData) {
    try {
        const postRef = adminDb.firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        
        if (!postDoc.exists) {
            throw new Error('Post not found');
        }
        
        const postData = postDoc.data();
        const existingLike = postData.likes.find(like => like.girlId === girlData.girlId);
        
        if (existingLike) {
            throw new Error('This AI girl has already liked this post');
        }
        
        const newLike = {
            girlId: girlData.girlId,
            name: girlData.name,
            profilePic: girlData.profilePic
        };
        
        await postRef.update({
            likes: [...postData.likes, newLike],
            updatedAt: new Date()
        });
        
        return { success: true, message: 'Like added successfully' };
    } catch (error) {
        console.error('Error adding AI like:', error);
        throw error;
    }
}

export async function addAIComment(postId, girlData, comment) {
    try {
        const postRef = adminDb.firestore().collection('posts').doc(postId);
        const postDoc = await postRef.get();
        
        if (!postDoc.exists) {
            throw new Error('Post not found');
        }
        
        const postData = postDoc.data();
        
        const newComment = {
            girlId: girlData.girlId,
            name: girlData.name,
            profilePic: girlData.profilePic,
            comment: comment,
            createdAt: new Date()
        };
        
        // Initialize comments array if it doesn't exist (for existing posts)
        const comments = postData.comments || [];
        
        await postRef.update({
            comments: [...comments, newComment],
            updatedAt: new Date()
        });
        
        return { success: true, message: 'Comment added successfully' };
    } catch (error) {
        console.error('Error adding AI comment:', error);
        throw error;
    }
}

export async function getRecentUserPosts(limit = 20) {
    try {
        const snapshot = await adminDb.firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        
        const posts = [];
        snapshot.forEach(doc => {
            const postData = doc.data();
            posts.push({
                id: doc.id,
                ...postData,
                imageUrl: `${CLOUDFRONT_BASE_URL}/${postData.imagePath}` // Convert to CloudFront URL
            });
        });
        
        return posts;
    } catch (error) {
        console.error('Error fetching recent user posts:', error);
        throw error;
    }
}