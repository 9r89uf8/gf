// app/api/v2/utils/messageValidation.js

/**
 * Validate file type and size
 */
export function validateFile(file) {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/quicktime'];
    const validAudioTypes = ['audio/mp3', 'audio/wav', 'audio/m4a'];
    const maxVideoSize = 10 * 1024 * 1024; // 10MB
    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxAudioSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
        return { valid: true, type: null };
    }

    const fileType = file.type;
    const fileSize = file.size;

    if (validImageTypes.includes(fileType)) {
        if (fileSize > maxImageSize) {
            return { valid: false, error: 'Image must be smaller than 5MB' };
        }
        return { valid: true, type: 'image' };
    }
    
    if (validVideoTypes.includes(fileType)) {
        if (fileSize > maxVideoSize) {
            return { valid: false, error: 'Video must be smaller than 10MB' };
        }
        return { valid: true, type: 'video' };
    }
    
    if (validAudioTypes.includes(fileType)) {
        if (fileSize > maxAudioSize) {
            return { valid: false, error: 'Audio must be smaller than 5MB' };
        }
        return { valid: true, type: 'audio' };
    }

    return { valid: false, error: 'Invalid file type. Please upload an image, video, or audio file.' };
}

/**
 * Validate message content
 */
export function validateMessageContent(content, mediaType) {
    // Allow empty content for media messages
    if (mediaType && !content) {
        return { valid: true };
    }
    
    // For text messages, content is required
    if (!mediaType && (!content || content.trim().length === 0)) {
        return { valid: false, error: 'Message content is required' };
    }
    
    // Check message length
    if (content && content.length > 1000) {
        return { valid: false, error: 'Message is too long (max 1000 characters)' };
    }
    
    return { valid: true };
}

/**
 * Validate user permissions
 */
export function validateUserPermissions(userData, girlData, mediaType) {
    // Check if girl is premium and user is not
    if (girlData?.premium && !userData?.premium) {
        return { valid: false, error: 'Girl is premium only' };
    }
    
    // Videos still require premium (you can change this if needed)
    // if (mediaType === 'video' && !userData?.premium) {
    //     return { valid: false, error: 'Premium required for videos' };
    // }
    
    // Images and audio are now validated against conversation limits, not user premium status
    return { valid: true };
}

/**
 * Sanitize message content
 */
export function sanitizeMessageContent(content) {
    if (!content) return '';
    
    // Remove any HTML tags
    const cleanContent = content.replace(/<[^>]*>/g, '');
    
    // Trim whitespace
    return cleanContent.trim();
}

/**
 * Validate conversation limits
 */
export function validateConversationLimits(limits, userData, actionType) {
    if (userData?.premium) {
        return { valid: true }; // Premium users have unlimited access
    }
    
    switch (actionType) {
        case 'message':
            if (limits.freeMessages <= 0) {
                return { valid: false, error: 'No free messages left. Upgrade to premium for unlimited messaging!' };
            }
            break;
        case 'audio':
            if (limits.freeAudio <= 0) {
                return { valid: false, error: 'No free audio messages left. Upgrade to premium for unlimited audio!' };
            }
            break;
        case 'image':
            if (limits.freeImages <= 0) {
                return { valid: false, error: 'No free images left. Upgrade to premium for unlimited images!' };
            }
            break;
    }
    
    return { valid: true };
}