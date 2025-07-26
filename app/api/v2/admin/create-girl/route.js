import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { uploadToFirebaseStorage } from '@/app/middleware/firebaseStorage';
import { invalidateGirlsCache } from '@/app/api/v2/services/girlsServerService';

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

        // Check if user is admin (you may want to adjust this based on your admin identification logic)
        const userId = authResult.user.uid;
        if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') { // Replace with your admin check logic
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Parse form data
        const formData = await req.formData();
        
        // Extract text fields
        const girlData = {
            username: formData.get('username')?.toLowerCase() || '',
            name: formData.get('name')?.toLowerCase() || '',
            fullName: formData.get('fullName') || '',
            age: parseInt(formData.get('age')) || 0,
            country: formData.get('country') || '',
            bio: formData.get('bio') || '',
            private: formData.get('private') === 'true',
            premium: formData.get('premium') === 'true',
            audioEnabled: formData.get('audioEnabled') === 'true',
            imagesEnabled: formData.get('imagesEnabled') === 'true',
            videosEnabled: formData.get('videosEnabled') === 'true',
            birthDate: formData.get('birthDate') || '',
            instagram: formData.get('instagram') || '',
            brothers: formData.get('brothers') || '',
            mom: formData.get('mom') || '',
            dad: formData.get('dad') || '',
            sexHistory: formData.get('sexHistory') || '',
            audioId: formData.get('audioId') || '',
            bioPrompt: formData.get('bioPrompt') || '',
            physicalAttributes: formData.get('physicalAttributes') || '',
            slang: formData.get('slang') || '',
            priority: parseInt(formData.get('priority')) || 5,
            followers: [],
            followersCount: Math.floor(Math.random() * (90000 - 60000 + 1)) + 60000,
            timestamp: Date.now(),
            createdAt: new Date().toISOString(),
        };

        // Validate required fields
        if (!girlData.username || !girlData.name || !girlData.fullName || !girlData.age || !girlData.country || !girlData.bio) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if username already exists
        const existingGirl = await adminDb.firestore()
            .collection('girls')
            .where('username', '==', girlData.username)
            .get();

        if (!existingGirl.empty) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        // Handle profile image upload to Cloudflare
        const profileImage = formData.get('profileImage');
        if (!profileImage) {
            return NextResponse.json({ error: 'Profile image is required' }, { status: 400 });
        }

        // Upload profile image to Cloudflare
        const profileImageId = uuidv4();
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

        // Set the profile picture URL
        girlData.pictureUrl = profileUploadResult.result.variants.find(v => v.includes('/public')) || profileUploadResult.result.variants[0];

        // Handle background image upload to Cloudflare
        const backgroundImage = formData.get('backgroundImage');
        if (!backgroundImage) {
            return NextResponse.json({ error: 'Background image is required' }, { status: 400 });
        }

        // Upload background image to Cloudflare
        const backgroundImageId = uuidv4();
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

        // Set the background URL
        girlData.backgroundUrl = backgroundUploadResult.result.variants.find(v => v.includes('/public')) || backgroundUploadResult.result.variants[0];

        // Generate a unique ID for the girl (moved here from later in the code)
        const girlId = uuidv4();

        // Handle audio files upload to Firebase Storage
        const audioFileCount = parseInt(formData.get('audioFileCount')) || 0;
        if (audioFileCount > 0) {
            const audioFiles = [];
            for (let i = 0; i < audioFileCount; i++) {
                const audioFile = formData.get(`audioFile${i}`);
                if (audioFile) {
                    audioFiles.push(audioFile);
                }
            }
            
            if (audioFiles.length > 0) {
                const audioFileUrls = await uploadAudioFilesToFirebase(audioFiles, girlId);
                girlData.audioFiles = audioFileUrls;
            }
        }

        // Save to Firestore
        await adminDb.firestore()
            .collection('girls')
            .doc(girlId)
            .set(girlData);

        // Invalidate Redis cache
        await invalidateGirlsCache();

        return NextResponse.json({
            success: true,
            girlId,
            message: 'Girl created successfully'
        });

    } catch (error) {
        console.error('Create girl error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create girl' },
            { status: 500 }
        );
    }
}