// AWS Bedrock utility functions
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
    region: "us-east-2", // Update with your AWS region
    credentials: {
        accessKeyId: process.env.STHREE,
        secretAccessKey: process.env.STHREESEC,
    },
    endpoint: "https://bedrock-runtime.us-east-2.amazonaws.com" // Explicitly set endpoint
});

/**
 * Analyzes a user message using AWS Bedrock to identify content types
 * @param {string} userMessage - The message to analyze
 * @returns {Promise<Object>} - Labels for the message content
 */
export async function analyzeUserMessage(userMessage) {
    try {
        const modelId = "arn:aws:bedrock:us-east-2:563561751769:inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1:0";

        const promptTemplate = `
    Analyze the following message and categorize it by providing the following labels:
    
    1. is_explicit: true/false - Is the message sexually explicit or inappropriate?
    2. requesting_picture: true/false - Is the user asking for a picture?
    3. requesting_audio: true/false - Is the user asking for audio/voice message?
    4. requesting_video: true/false - Is the user asking for a video?
    5. emotional_tone: (one of: neutral, flirty, angry, sad, happy) - What's the emotional tone?
    
    Provide your analysis as valid JSON with only these 5 fields. Just the JSON, no other text or commentary.
    
    User message: "${userMessage}"
    `;

        const payload = {
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 200,
            top_k: 250,
            temperature: 0.2, // Lower temperature for more deterministic responses
            top_p: 0.999,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: promptTemplate
                        }
                    ]
                }
            ]
        };

        const command = new InvokeModelCommand({
            modelId,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await bedrockClient.send(command);
        const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));

        // Extract the content from the response
        const content = responseBody.content[0].text;

        // Parse the JSON from the content
        // Using try/catch as the response might not always be valid JSON
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error("Error parsing Bedrock response as JSON:", error.message);
            // Return a default object if parsing fails
            return {
                is_explicit: false,
                requesting_picture: false,
                requesting_audio: false,
                requesting_video: false,
                emotional_tone: "neutral"
            };
        }
    } catch (error) {
        console.error("Error calling AWS Bedrock:", error);
        throw error;
    }
}