// app/utils/chat/llmHandler.js
import Together from "together-ai";
import { DateTime } from 'luxon';
import {getConversationLimits} from "@/app/api/chat/conversationLimits/route";

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });

// Function to generate the dynamic system prompt
function generateSystemPrompt(userMessage) {

    // Combine all prompts
    return {
        "role": "system",
        "content": `
Analyze the following message and categorize it by providing the following labels:
    1. is_explicit: true/false - Is the message sexually explicit or inappropriate?
    2. requesting_picture: true/false - Is the user asking for a picture?
    3. requesting_audio: true/false - Is the user asking for audio/voice message?
    4. requesting_video: true/false - Is the user asking for a video?
    5. emotional_tone: (one of: neutral, flirty, angry, sad, happy) - What's the emotional tone?
    
    Provide your analysis as valid JSON with only these 5 fields. Just the JSON, no other text or commentary.
    ex: {"is_explicit": false,
  "requesting_picture": false,
  "requesting_audio": false,
  "requesting_video": false,
  "emotional_tone": "flirty"}
        `.trim()
    }

}

async function getLLMResponse(messages) {
    // Default model list if none provided
    const modelsToTry =  [
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3",
        // Add more fallback models here
    ];

    let lastError = null;

    // Try each model in sequence until one works
    for (const model of modelsToTry) {
        try {
            const response = await together.chat.completions.create({
                messages: messages,
                model: model,
                max_tokens: 90,
                temperature: 0.7,
                top_p: 0.7,
                top_k: 50,
                repetition_penalty: 1,
                stop: ["<｜end▁of▁sentence｜>"],
                stream: false
            });

            console.log(`Successfully used model: ${model}`);
            return response.choices[0].message.content;
        } catch (error) {
            console.warn(`Error with model ${model}:`, error.message);
            lastError = error;
            // Continue to the next model
        }
    }

    // If we've tried all models and none worked
    throw new Error(`All models failed. Last error: ${lastError?.message}`);
}

export async function analyzeUserMessageLlama(userMessage) {
    // Generate the dynamic system prompt
    const systemPrompt = generateSystemPrompt(userMessage);
    let conversationHistory =[{'role': 'user', 'content': userMessage}];

    // Prepare messages for LLM processing
    const messagesForLLM = [systemPrompt, ...conversationHistory];
    // Get response from LLM with fallback options
    try {
        const assistantMessage = await getLLMResponse(messagesForLLM);
        return JSON.parse(assistantMessage);
    } catch (error) {
        console.error("All LLM models failed:", error);
        return "Tengo que irme. Te mando un mensaje más tarde";
    }
}