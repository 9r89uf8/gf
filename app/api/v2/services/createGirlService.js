import { adminDb } from '@/app/utils/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';
import { uploadAudioFilesToS3 } from '@/app/api/v2/utils/s3Upload';
import { invalidateGirlsCache } from './girlsServerService';

/**
 * Service function to create a new girl with all media uploads
 * @param {Object} girlData - Girl data from form
 * @param {File} profileImage - Profile image file
 * @param {File} backgroundImage - Background image file
 * @param {Array<File>} audioFiles - Array of audio files
 * @returns {Promise<Object>} Created girl data with ID
 */
export async function createGirl(girlData, profileImage, backgroundImage, audioFiles = []) {
    try {
        // Validate required fields
        const requiredFields = ['username', 'name', 'fullName', 'age', 'country', 'bio'];
        for (const field of requiredFields) {
            if (!girlData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Check if username already exists
        const existingGirl = await adminDb.firestore()
            .collection('girls')
            .where('username', '==', girlData.username.toLowerCase())
            .get();

        if (!existingGirl.empty) {
            throw new Error('Username already exists');
        }

        // Prepare girl data with defaults
        const newGirlData = {
            username: girlData.username.toLowerCase(),
            name: girlData.name.toLowerCase(),
            fullName: girlData.fullName,
            age: parseInt(girlData.age),
            country: girlData.country,
            bio: girlData.bio,
            private: Boolean(girlData.private),
            premium: Boolean(girlData.premium),
            audioEnabled: Boolean(girlData.audioEnabled),
            imagesEnabled: Boolean(girlData.imagesEnabled),
            videosEnabled: Boolean(girlData.videosEnabled),
            birthDate: girlData.birthDate || '',
            instagram: girlData.instagram || '',
            brothers: girlData.brothers || '',
            mom: girlData.mom || '',
            dad: girlData.dad || '',
            sexHistory: girlData.sexHistory || '',
            audioId: girlData.audioId || '',
            priority: parseInt(girlData.priority) || 5,
            followers: [],
            followersCount: Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000,
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
        };

        // Upload profile image to Cloudflare
        if (!profileImage) {
            throw new Error('Profile image is required');
        }

        const profileFormData = new FormData();
        profileFormData.append('file', profileImage);

        const profileUploadResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                },
                body: profileFormData,
            }
        );

        if (!profileUploadResponse.ok) {
            const errorText = await profileUploadResponse.text();
            console.error('Cloudflare profile upload error:', errorText);
            throw new Error('Failed to upload profile image to Cloudflare');
        }

        const profileUploadResult = await profileUploadResponse.json();
        if (!profileUploadResult.success) {
            console.error('Cloudflare profile upload result:', profileUploadResult);
            throw new Error('Cloudflare profile image upload failed');
        }

        newGirlData.pictureUrl = profileUploadResult.result.variants.find(v => v.includes('/public')) || profileUploadResult.result.variants[0];

        // Upload background image to Cloudflare
        if (!backgroundImage) {
            throw new Error('Background image is required');
        }

        const backgroundFormData = new FormData();
        backgroundFormData.append('file', backgroundImage);

        const backgroundUploadResponse = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                },
                body: backgroundFormData,
            }
        );

        if (!backgroundUploadResponse.ok) {
            const errorText = await backgroundUploadResponse.text();
            console.error('Cloudflare background upload error:', errorText);
            throw new Error('Failed to upload background image to Cloudflare');
        }

        const backgroundUploadResult = await backgroundUploadResponse.json();
        if (!backgroundUploadResult.success) {
            console.error('Cloudflare background upload result:', backgroundUploadResult);
            throw new Error('Cloudflare background image upload failed');
        }

        newGirlData.backgroundUrl = backgroundUploadResult.result.variants.find(v => v.includes('/public')) || backgroundUploadResult.result.variants[0];

        // Upload audio files to S3 if provided
        if (audioFiles && audioFiles.length > 0) {
            const audioFileUrls = await uploadAudioFilesToS3(audioFiles);
            newGirlData.audioFiles = audioFileUrls;
        }

        // Generate a unique ID for the girl
        const girlId = uuidv4();

        // Save to Firestore
        await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .set(newGirlData);

        // Invalidate Redis cache
        await invalidateGirlsCache();

        return {
            id: girlId,
            ...newGirlData
        };

    } catch (error) {
        console.error('Create girl service error:', error);
        throw error;
    }
}