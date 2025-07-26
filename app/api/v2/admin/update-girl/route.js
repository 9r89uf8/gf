import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { uploadToFirebaseStorage } from '@/app/middleware/firebaseStorage';
import { invalidateGirlCache } from '@/app/api/v2/services/girlsServerService';

// Helper function to upload multiple audio files to Firebase Storage
const uploadAudioFilesToFirebase = async (audioFiles, girlId) => {
    if (!audioFiles || audioFiles.length === 0) {
        return [];
    }

    const audioFileUrls = [];
    
    for (const audioFile of audioFiles) {
        try {
            // Convert File to Buffer
            const buffer = Buffer.from(await audioFile.arrayBuffer());
            
            // Generate unique filename with proper path
            const fileName = `audio/girls/${girlId}/moaning/${Date.now()}_${uuidv4()}.mp3`;
            
            // Upload to Firebase Storage
            const audioUrl = await uploadToFirebaseStorage(buffer, fileName, audioFile.type || 'audio/mpeg');
            audioFileUrls.push(audioUrl);
        } catch (error) {
            console.error('Error uploading audio file:', error);
            // Continue with other files even if one fails
        }
    }
    
    return audioFileUrls;
};

export async function POST(req) {
    try {
        // Verify admin authentication
        const authResult = await authMiddleware(req);
        if (!authResult.authenticated) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') { // Replace with your admin check logic
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Parse form data
        const formData = await req.formData();
        
        // Get girl ID
        const girlId = formData.get('girlId');
        if (!girlId) {
            return NextResponse.json({ error: 'Girl ID is required' }, { status: 400 });
        }

        // Get existing girl data
        const girlDoc = await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .get();

        if (!girlDoc.exists) {
            return NextResponse.json({ error: 'Girl not found' }, { status: 404 });
        }

        const existingData = girlDoc.data();

        // Extract updated text fields
        const updatedData = {
            username: formData.get('username')?.toLowerCase() || existingData.username,
            name: formData.get('name')?.toLowerCase() || existingData.name,
            fullName: formData.get('fullName') || existingData.fullName,
            age: parseInt(formData.get('age')) || existingData.age,
            country: formData.get('country') || existingData.country,
            bio: formData.get('bio') || existingData.bio,
            private: formData.get('private') === 'true',
            premium: formData.get('premium') === 'true',
            audioEnabled: formData.get('audioEnabled') === 'true',
            imagesEnabled: formData.get('imagesEnabled') === 'true',
            videosEnabled: formData.get('videosEnabled') === 'true',
            birthDate: formData.get('birthDate') || existingData.birthDate || '',
            instagram: formData.get('instagram') || existingData.instagram || '',
            brothers: formData.get('brothers') || existingData.brothers || '',
            mom: formData.get('mom') || existingData.mom || '',
            dad: formData.get('dad') || existingData.dad || '',
            sexHistory: formData.get('sexHistory') || existingData.sexHistory || '',
            audioId: formData.get('audioId') || existingData.audioId || '',
            bioPrompt: formData.get('bioPrompt') || existingData.bioPrompt || '',
            physicalAttributes: formData.get('physicalAttributes') || existingData.physicalAttributes || '',
            slang: formData.get('slang') || existingData.slang || '',
            priority: parseInt(formData.get('priority')) || existingData.priority,
            updatedAt: new Date().toISOString(),
        };

        // Validate required fields
        if (!updatedData.username || !updatedData.name || !updatedData.fullName || !updatedData.age || !updatedData.country || !updatedData.bio) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if username changed and already exists
        if (updatedData.username !== existingData.username) {
            const existingUsername = await adminDb.firestore()
                .collection('girls')
                .where('username', '==', updatedData.username)
                .get();

            if (!existingUsername.empty) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
            }
        }

        // Handle profile image upload if provided
        const profileImage = formData.get('profileImage');
        if (profileImage && profileImage.size > 0) {
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
                throw new Error('Failed to upload profile image to Cloudflare');
            }

            const profileUploadResult = await profileUploadResponse.json();
            if (!profileUploadResult.success) {
                throw new Error('Cloudflare profile image upload failed');
            }

            updatedData.pictureUrl = profileUploadResult.result.variants.find(v => v.includes('/public')) || profileUploadResult.result.variants[0];
        } else {
            // Keep existing profile image
            updatedData.pictureUrl = existingData.pictureUrl;
        }

        // Handle background image upload if provided
        const backgroundImage = formData.get('backgroundImage');
        if (backgroundImage && backgroundImage.size > 0) {
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
                throw new Error('Failed to upload background image to Cloudflare');
            }

            const backgroundUploadResult = await backgroundUploadResponse.json();
            if (!backgroundUploadResult.success) {
                throw new Error('Cloudflare background image upload failed');
            }

            updatedData.backgroundUrl = backgroundUploadResult.result.variants.find(v => v.includes('/public')) || backgroundUploadResult.result.variants[0];
        } else {
            // Keep existing background image
            updatedData.backgroundUrl = existingData.backgroundUrl;
        }

        // Handle audio files
        const existingAudioFiles = JSON.parse(formData.get('existingAudioFiles') || '[]');
        const audioFileCount = parseInt(formData.get('audioFileCount')) || 0;
        
        let finalAudioFiles = [...existingAudioFiles];
        
        if (audioFileCount > 0) {
            const newAudioFiles = [];
            for (let i = 0; i < audioFileCount; i++) {
                const audioFile = formData.get(`audioFile${i}`);
                if (audioFile) {
                    newAudioFiles.push(audioFile);
                }
            }
            
            if (newAudioFiles.length > 0) {
                const uploadedAudioUrls = await uploadAudioFilesToFirebase(newAudioFiles, girlId);
                finalAudioFiles = [...finalAudioFiles, ...uploadedAudioUrls];
            }
        }
        
        updatedData.audioFiles = finalAudioFiles;

        // Keep other existing fields that aren't being updated
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

        // Invalidate Redis cache for this girl
        await invalidateGirlCache(girlId);

        return NextResponse.json({
            success: true,
            message: 'Girl updated successfully'
        });

    } catch (error) {
        console.error('Update girl error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update girl' },
            { status: 500 }
        );
    }
}