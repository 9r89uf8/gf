import { adminDb } from '@/app/utils/firebaseAdmin';
import { uploadAudioFilesToS3 } from '@/app/api/v2/utils/s3Upload';
import { invalidateGirlCache } from './girlsServerService';

/**
 * Service function to update an existing girl with media uploads
 * @param {string} girlId - The ID of the girl to update
 * @param {Object} girlData - Updated girl data from form
 * @param {File} profileImage - New profile image file (optional)
 * @param {File} backgroundImage - New background image file (optional)
 * @param {Array<File>} newAudioFiles - Array of new audio files to add
 * @param {Array<string>} existingAudioFiles - Array of existing audio file URLs to keep
 * @returns {Promise<Object>} Updated girl data
 */
export async function updateGirl(girlId, girlData, profileImage = null, backgroundImage = null, newAudioFiles = [], existingAudioFiles = []) {
    try {
        // Validate girl ID
        if (!girlId) {
            throw new Error('Girl ID is required');
        }

        // Get existing girl data
        const girlDoc = await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .get();

        if (!girlDoc.exists) {
            throw new Error('Girl not found');
        }

        const existingData = girlDoc.data();

        // Validate required fields
        const requiredFields = ['username', 'name', 'fullName', 'age', 'country', 'bio'];
        for (const field of requiredFields) {
            if (!girlData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Check if username changed and already exists
        if (girlData.username.toLowerCase() !== existingData.username) {
            const existingUsername = await adminDb.firestore()
                .collection('girls')
                .where('username', '==', girlData.username.toLowerCase())
                .get();

            if (!existingUsername.empty) {
                throw new Error('Username already exists');
            }
        }

        // Prepare updated data
        const updatedData = {
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
            updatedAt: new Date().toISOString(),
        };

        // Upload new profile image if provided
        if (profileImage) {
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

            updatedData.pictureUrl = profileUploadResult.result.variants.find(v => v.includes('/public')) || profileUploadResult.result.variants[0];
        } else {
            updatedData.pictureUrl = existingData.pictureUrl;
        }

        // Upload new background image if provided
        if (backgroundImage) {
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

            updatedData.backgroundUrl = backgroundUploadResult.result.variants.find(v => v.includes('/public')) || backgroundUploadResult.result.variants[0];
        } else {
            updatedData.backgroundUrl = existingData.backgroundUrl;
        }

        // Handle audio files - combine existing with new
        let finalAudioFiles = [...existingAudioFiles];
        
        if (newAudioFiles && newAudioFiles.length > 0) {
            const uploadedAudioUrls = await uploadAudioFilesToS3(newAudioFiles);
            finalAudioFiles = [...finalAudioFiles, ...uploadedAudioUrls];
        }
        
        updatedData.audioFiles = finalAudioFiles;

        // Keep other existing fields
        const fieldsToKeep = ['followers', 'followersCount', 'timestamp', 'createdAt'];
        fieldsToKeep.forEach(field => {
            if (existingData[field] !== undefined) {
                updatedData[field] = existingData[field];
            }
        });

        // Update in Firestore
        await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .update(updatedData);

        // Invalidate Redis cache
        await invalidateGirlCache(girlId);

        return {
            id: girlId,
            ...updatedData
        };

    } catch (error) {
        console.error('Update girl service error:', error);
        throw error;
    }
}