// app/api/v2/utils/errorHandler.js

/**
 * Error types for better error handling
 */
export const ErrorTypes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    PERMISSION_ERROR: 'PERMISSION_ERROR',
    RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
    TRANSCRIPTION_ERROR: 'TRANSCRIPTION_ERROR',
    AI_GENERATION_ERROR: 'AI_GENERATION_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    MEDIA_PROCESSING_ERROR: 'MEDIA_PROCESSING_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
    constructor(message, type, statusCode, details = null) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.details = details;
    }
}

/**
 * Create error response
 */
export function createErrorResponse(error, additionalData = {}) {
    const baseResponse = {
        error: error.message || 'An error occurred',
        type: error.type || ErrorTypes.UNKNOWN_ERROR,
        ...additionalData
    };

    // Add details if available and not in production
    if (process.env.NODE_ENV !== 'production' && error.details) {
        baseResponse.details = error.details;
    }

    return new Response(JSON.stringify(baseResponse), {
        status: error.statusCode || 500,
        headers: { 'Content-Type': 'application/json' },
    });
}

/**
 * Error logger
 */
export function logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorLog = {
        timestamp,
        message: error.message,
        type: error.type || 'UNKNOWN',
        stack: error.stack,
        context
    };

    // In production, you might want to send this to a logging service
    console.error('API Error:', errorLog);
}

/**
 * Wrap async handler with error handling
 */
export function withErrorHandler(handler) {
    return async (req) => {
        try {
            return await handler(req);
        } catch (error) {
            logError(error, { url: req.url, method: req.method });
            
            // Handle known error types
            if (error instanceof APIError) {
                return createErrorResponse(error);
            }

            // Handle database errors
            if (error.code === 'failed-precondition' || error.code === 'unavailable') {
                return createErrorResponse(
                    new APIError(
                        'Database temporarily unavailable. Please try again.',
                        ErrorTypes.DATABASE_ERROR,
                        503
                    )
                );
            }

            // Handle network errors
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                return createErrorResponse(
                    new APIError(
                        'External service temporarily unavailable.',
                        ErrorTypes.UNKNOWN_ERROR,
                        503
                    )
                );
            }

            // Default error response
            return createErrorResponse(
                new APIError(
                    'An unexpected error occurred. Please try again.',
                    ErrorTypes.UNKNOWN_ERROR,
                    500
                )
            );
        }
    };
}

/**
 * Retry wrapper for external service calls
 */
export async function withRetry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}