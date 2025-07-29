// app/api/v2/services/aiResponseService.js
import { handleLLMInteractionV2 } from '@/app/api/v2/utils/llmHandlerV2';
import { parseMessageContent, generateAudio, getMediaContent } from '../utils/mediaProcessing';
import { createAssistantMessage } from '../utils/messageHandlers';

/**
 * Lightweight pattern-based message analyzer
 * Replaces AWS Bedrock API call for better performance
 * @param {string} message - The user message to analyze
 * @returns {{is_explicit: boolean, requesting_picture: boolean, requesting_audio: boolean, requesting_video: boolean, emotional_tone: string}}
 * @example
 * quickAnalyzeMessage("mandame una foto")
 * // Returns: { is_explicit: false, requesting_picture: true, requesting_audio: false, requesting_video: false, emotional_tone: 'neutral' }
 */
function quickAnalyzeMessage(message) {
    if (!message) return {
        is_explicit: false,
        requesting_picture: false,
        requesting_audio: false,
        requesting_video: false,
        requesting_moan: false,
        emotional_tone: 'neutral'
    };

    const lower = message.toLowerCase();
    
    // Detect picture requests
    const picturePatterns = [
        /\b(foto|fotos|picture|pic|pics|imagen|imagenes|selfie|selfi)\b/,
        /\b(mandame|mandame|enviame|envia|manda|muestra|muestrame|enseña|enseñame).*\b(foto|imagen|selfie)\b/,
        /\b(quiero|puedo|podrias|puedes).*\b(ver|foto|imagen)\b/,
        /\b(como|que).*\b(te ves|luces|estas vestida)\b/,
        /\bshow\s*me\b/
    ];
    
    // Detect audio requests
    const audioPatterns = [
        /\b(audio|voz|voice|habla|hablame|escuchar|escucharte|oir|oirte)\b/,
        /\b(mandame|enviame|envia|manda).*\b(audio|voz|mensaje de voz)\b/,
        /\b(quiero|puedo|podrias).*\b(escuchar|oir).*\b(voz|audio|hablar)\b/,
        /\b(di|dime|canta|cantame).*\b(algo|cancion)\b/,
        /\b(grabate|grabame|graba)\b/
    ];

    // Detect video requests
    const videoPatterns = [
        /\b(mandame|mandáme|enviame|envíame|envia|envía|manda|muestra|muéstrame).*\b(video|vid|videos|grabacion|grabación|clip)\b/,
        /\b(quiero|puedo|podrias|podrías|puedes).*\b(ver|video|grabacion|grabación)\b/,
        /\b(hazme|grábate|grabate|graba).*\b(video|bailando|baile)\b/,
        /\bmuestra.*\b(bailando|baila|moviendote|moviéndote)\b/,
        /\b(necesito|dame|quiero).*\b(video|clip|grabacion|grabación)\b/
    ];
    
    // Detect moaning requests
    const moanPatterns = [
        /\b(gime|gimiendo|gemidos|gemir|gemido)\b/,
        /\b(moan|moaning|moans)\b/,
        /\b(quiero|puedo|podrias).*\b(oirte|escucharte).*\b(gemir|gimiendo)\b/,
        /\b(hazme|mandame|enviame).*\b(gemidos|audio.*gemir)\b/,
        /\b(audio.*caliente|sonidos.*placer)\b/
    ];
    
    // Detect explicit content
    const explicitPatterns = [
        /\b(verga|pito|pene|tetas|culo|vagina|panocha|chichi|trasero|nalgas)\b/,
        /\b(desnuda|desnudo|sin ropa|encuerada|empelota)\b/,
        /\b(coger|follar|mamar|chupar|penetrar|venirme|venirte)\b/,
        /\b(paja|masturbar|tocar)\b/,
        /\b(caliente|cachonda|excitado|excitada|mojada|duro|parado)\b/
    ];
    
    // Detect emotional tone
    let emotional_tone = 'neutral';
    
    if (/\b(jaja|jeje|lol|😂|🤣|😄|chistoso|gracioso|divertido)\b/.test(lower) || 
        /[😂🤣😄😆😁]/.test(message)) {
        emotional_tone = 'happy';
    } else if (/\b(😍|❤️|💕|🥰|amor|cariño|guapo|guapa|hermoso|hermosa|lindo|linda|bello|bella|precioso|preciosa)\b/.test(lower) ||
               /[😍❤️💕🥰😘💋]/.test(message)) {
        emotional_tone = 'flirty';
    } else if (/\b(😢|😭|💔|triste|llorar|mal|dolor|lastima|pena|solo|sola|extraño|extrañar)\b/.test(lower) ||
               /[😢😭💔😔😞]/.test(message)) {
        emotional_tone = 'sad';
    } else if (/\b(😠|😡|🤬|enojado|enojada|molesto|molesta|cabron|pendejo|estupido|mierda|puta|chingar)\b/.test(lower) ||
               /[😠😡🤬😤]/.test(message)) {
        emotional_tone = 'angry';
    }
    
    return {
        is_explicit: explicitPatterns.some(pattern => pattern.test(lower)),
        requesting_picture: picturePatterns.some(pattern => pattern.test(lower)),
        requesting_audio: audioPatterns.some(pattern => pattern.test(lower)) || moanPatterns.some(pattern => pattern.test(lower)),
        requesting_video: videoPatterns.some(pattern => pattern.test(lower)),
        requesting_moan: moanPatterns.some(pattern => pattern.test(lower)),
        emotional_tone: emotional_tone
    };
}

/**
 * Analyze user message for intent and tone
 * Now uses lightweight pattern matching instead of AWS Bedrock
 */
export async function analyzeMessage(userMessageContent, userSentMedia = false) {
    if (!userMessageContent) return { emotional_tone: 'neutral' };
    
    // Use lightweight pattern matching for instant results
    const analysis = quickAnalyzeMessage(userMessageContent);
    
    // If user sent media, override all media request detection
    if (userSentMedia) {
        analysis.requesting_picture = false;
        analysis.requesting_video = false;
        analysis.requesting_audio = false;
    }
    
    return analysis;
}

/**
 * Process AI response and enrich with media if requested
 */
export async function processAIResponse(userData, girlData, conversation, userMessage, messageLabels, preSelectedMedia = null) {
    // Generate AI response
    const assistantMessage = await handleLLMInteractionV2(
        userData, 
        girlData, 
        conversation, 
        userMessage, 
        messageLabels,
        preSelectedMedia
    );

    // Parse response content
    const parsedResponse = parseMessageContent(assistantMessage);

    let responseData = {
        content: parsedResponse.content,
        mediaType: parsedResponse.type,
        displayLink: false,
        status: 'completed',
        mediaId: preSelectedMedia?.id || null // Include media ID if pre-selected
    };

    return { assistantMessage, parsedResponse, responseData };
}

/**
 * Get a random moaning audio from girl's audioFiles array
 * @param {Array} audioFiles - Array of audio file URLs
 * @returns {string|null} - Random audio URL or null if not available
 */
function getRandomMoaningAudio(audioFiles) {
    if (!audioFiles || !Array.isArray(audioFiles) || audioFiles.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    return audioFiles[randomIndex];
}

/**
 * Enrich response with media based on type and limits
 * @param {Object} responseData - Response data object
 * @param {Object} parsedResponse - Parsed response from AI
 * @param {Object} girlData - Girl data
 * @param {Object} userData - User data
 * @param {Object} limits - Current limits
 * @param {Object} messageLabels - Message analysis labels
 * @param {Object} preSelectedMedia - Pre-selected media if any
 * @param {Array<string>} sentMediaIds - Array of already sent media IDs
 */
export async function enrichResponseWithMedia(responseData, parsedResponse, girlData, userData, limits, messageLabels, preSelectedMedia = null, sentMediaIds = []) {
    const enrichedData = { ...responseData };

    // If we have pre-selected media and user requested it, use it directly
    if (preSelectedMedia && (messageLabels.requesting_picture || messageLabels.requesting_video || messageLabels.requesting_audio)) {
        if (preSelectedMedia.type === 'audio' && preSelectedMedia.mediaUrl) {
            enrichedData.audioUrl = preSelectedMedia.mediaUrl;
            enrichedData.mediaType = 'audio';
        } else if (preSelectedMedia.mediaUrl) {
            enrichedData.mediaUrl = preSelectedMedia.mediaUrl;
            enrichedData.mediaType = preSelectedMedia.type;
            enrichedData.mediaId = preSelectedMedia.id; // Track media ID
        }
        return enrichedData;
    }

    switch (parsedResponse.type) {
        case 'text':
            if (messageLabels.requesting_picture===true&&(!userData.premium || limits.freeImages === 0)) {
                enrichedData.displayLink = true;
            }
            if (messageLabels.requesting_audio===true&&(!userData.premium || limits.freeAudio === 0)) {
                enrichedData.displayLink = true;
            }
            if (messageLabels.requesting_video===true&&(!userData.premium || limits.freeImages === 0)) {
                enrichedData.displayLink = true;
            }
            break;


        case 'image':
            if (userData.premium || limits.freeImages > 0) {
                const imageContent = await getMediaContent(
                    girlData.id || girlData.girlId, 
                    'image', 
                    parsedResponse.description, 
                    userData.premium,
                    messageLabels,
                    sentMediaIds
                );
                if (imageContent) {
                    enrichedData.mediaUrl = imageContent.mediaUrl
                    enrichedData.mediaType = 'image';
                    enrichedData.mediaId = imageContent.id; // Track media ID
                }else {
                    enrichedData.mediaUrl = null;
                    enrichedData.mediaType = 'text';
                    enrichedData.error = 'No puedo enviar fotos ahorita mejor te mando en texto 😋';
                }
            } else {
                enrichedData.displayLink = true;
            }
            break;

        case 'video':
            if (userData.premium || limits.freeImages > 0) {
                const videoContent = await getMediaContent(
                    girlData.id || girlData.girlId, 
                    'video', 
                    parsedResponse.description, 
                    userData.premium,
                    messageLabels,
                    sentMediaIds
                );
                if (videoContent) {
                    enrichedData.mediaUrl = videoContent.mediaUrl;
                    enrichedData.mediaType = 'video';
                    enrichedData.mediaId = videoContent.id; // Track media ID
                }else {
                    enrichedData.mediaUrl = null;
                    enrichedData.mediaType = 'text';
                    enrichedData.error = 'No puedo enviar videos ahorita mejor te mando en texto 😋';
                }
            } else {
                enrichedData.displayLink = true;
            }
            break;

        case 'audio':
            if (userData.premium || limits.freeAudio > 0) {
                let audioUrl;
                
                // Check if user is requesting moaning sounds
                if (messageLabels.requesting_moan && girlData.audioFiles) {
                    audioUrl = getRandomMoaningAudio(girlData.audioFiles);
                    if (!audioUrl) {
                        // Fallback to AI generation if no moaning audio available
                        audioUrl = await generateAudio(
                            parsedResponse.content || parsedResponse.description,
                            girlData.audioId
                        );
                    }
                } else {
                    // Normal audio generation
                    audioUrl = await generateAudio(
                        parsedResponse.content || parsedResponse.description,
                        girlData.audioId
                    );
                }
                
                if (audioUrl) {
                    enrichedData.audioUrl = audioUrl;
                    enrichedData.mediaType = 'audio';
                } else {
                    enrichedData.audioUrl = null;
                    enrichedData.mediaType = 'text';
                    enrichedData.error = 'No puedo enviar audios ahorita mejor te mando en texto 😋';
                }
            } else {
                enrichedData.displayLink = true;
            }
            break;
    }

    return enrichedData;
}

/**
 * Add random media to text responses
 */
export async function maybeAddRandomMedia(responseData, parsedResponse, girlData, userData, limits, messageLabels = {}) {
    // Skip if not a text response or random chance doesn't trigger
    if (parsedResponse.type !== 'text' || Math.random() >= 0.3) {
        return responseData;
    }

    // Skip if media already exists (user requested specific media)
    if (responseData.mediaUrl || responseData.audioUrl) {
        return responseData;
    }

    // Skip if user explicitly requested any type of media
    if (messageLabels.requesting_picture || messageLabels.requesting_video || messageLabels.requesting_audio) {
        return responseData;
    }

    const enrichedData = { ...responseData };

    // Random chance for audio
    if ((userData.premium || limits.freeAudio > 0) && Math.random() < 0.5) {
        const audioUrl = await generateAudio(parsedResponse.content, girlData.audioId);
        if (audioUrl) {
            enrichedData.audioUrl = audioUrl;
            enrichedData.mediaType = 'audio';
        }
    }

    return enrichedData;
}

/**
 * Create the final assistant message object
 */
export function createFinalAssistantMessage(responseData) {
    return createAssistantMessage(
        responseData.content,
        responseData.mediaUrl || responseData.audioUrl,
        responseData.mediaType,
        responseData.displayLink,
        responseData.audioUrl,
        responseData
    );
}