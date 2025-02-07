// app/utils/chat/llmHandler.js
import Together from "together-ai";
import { DateTime } from 'luxon';

const together = new Together({ apiKey: process.env.TOGETHER_API_KEY });


/**
 * Generates a dynamic system prompt based on the user’s status,
 * the last message type, and the personality & daily details of the "girl".
 *
 * @param {Object} user - Contains user properties like premium status, freeImages, freeAudio, etc.
 * @param {Object} lastMessageByUser - Contains details about the last user message (mediaType, etc.)
 * @param {Object} girl - Contains personality details and settings (name, age, imagesEnabled, videosEnabled, etc.)
 * @returns {Object} A system message for the LLM.
 */
function generateSystemPrompt(user, lastMessageByUser, girl) {
    // Determine the type of the last message sent by the user.
    let userMessageType;
    switch (lastMessageByUser.mediaType) {
        case "image":
            userMessageType = "the last message by the User was an image.";
            break;
        case "video":
            userMessageType = "the last message by the User was a video.";
            break;
        case "audio":
            userMessageType = "the last message by the User was an audio.";
            break;
        default:
            userMessageType = "the last message by the User was a text message.";
    }

    // Instructions for image requests.
    let userPicInstructions;
    if ((user.premium || user.freeImages > 0) && girl.imagesEnabled) {
        userPicInstructions = `
If the user requests an image:
  1. Respond conversationally as if you’re chatting naturally.
  2. Append an image description in the format [IMAGE: description] (e.g., [IMAGE: foto en la playa]).
For example:
User: "Mandame una foto en la playa"
Assistant: "Claro, mi amor. Aquí tienes: [IMAGE: foto en la playa]"
    `.trim();
    } else if ((user.premium || user.freeImages > 0) && !girl.imagesEnabled) {
        userPicInstructions = `
If the user requests an image:
  1. Respond conversationally.
  2. Inform them that images are currently disabled.
  3. Apologize and suggest alternative interactions.
For example:
User: "Mandame una foto"
Assistant: "Lo siento, mi amor, pero no puedo enviar fotos en este momento."
    `.trim();
    } else {
        userPicInstructions = `
If the user requests an image:
  1. Respond conversationally.
  2. Explain that image access requires a premium membership.
  3. Flirt or entice the user to upgrade.
  4. Provide the image description in the format [IMAGE: description].
For example:
User: "Mandame una foto en la escuela"
Assistant: "Mi cielo, para enviarte fotos primero debes ser premium. ¿Te animas? [IMAGE: foto en la escuela]"
    `.trim();
    }

    // Instructions for video requests.
    let userVidInstructions;
    if (user.premium && girl.videosEnabled) {
        userVidInstructions = `
If the user requests a video:
  1. Respond conversationally.
  2. Append a video description in the format [VIDEO: description] (e.g., [VIDEO: video en el bar]).
For example:
User: "Mandame un video en el bar"
Assistant: "Claro, mi amor. Aquí tienes: [VIDEO: video en el bar]"
    `.trim();
    } else if (user.premium && !girl.videosEnabled) {
        userVidInstructions = `
If the user requests a video:
  1. Respond conversationally.
  2. Inform them that videos are currently disabled.
  3. Apologize and offer alternative interaction.
For example:
User: "Mandame un video"
Assistant: "Lo siento, mi amor, pero no puedo enviar videos en este momento."
    `.trim();
    } else {
        userVidInstructions = `
If the user requests a video:
  1. Respond conversationally.
  2. Explain that video access requires a premium membership.
  3. Flirt or encourage the upgrade.
  4. Provide the video description in the format [VIDEO: description].
For example:
User: "Mandame un video en el carro"
Assistant: "Mi cielo, para enviarte videos primero debes ser premium. ¿Te animas? [VIDEO: video en el carro]"
    `.trim();
    }

    // Instructions for audio requests.
    let userAudioInstructions;
    if (user.freeAudio > 0) {
        userAudioInstructions = `
If the user requests an audio:
  1. Respond conversationally.
  2. Append an audio description in the format [AUDIO: description].
  3. Keep the description to 10 words or less and include a flirtatious remark.
For example:
User: "Mandame un audio"
Assistant: "Claro, mi amor: [AUDIO: un beso apasionado]"
    `.trim();
    } else {
        userAudioInstructions = `
If the user requests an audio:
  1. Respond conversationally.
  2. Explain that audio access requires a premium membership.
  3. Flirt or encourage the user to upgrade.
  4. Provide the audio description in the format [AUDIO: description].
For example:
User: "Mandame un audio"
Assistant: "Mi cielo, necesitas ser premium para recibir audios. ¿Te animas? [AUDIO: un susurro sensual]"
    `.trim();
    }

    // Get the current date and time in the Mexico City timezone.
    const nowInMexico = DateTime.now().setZone("America/Mexico_City").setLocale("es");
    const dayNameSpanish = nowInMexico.toFormat("cccc");
    const dayNumber = nowInMexico.toFormat("d");
    const monthNameSpanish = nowInMexico.toFormat("LLLL");
    const yearNumber = nowInMexico.toFormat("yyyy");
    const timeString = nowInMexico.toFormat("hh:mm a");

    // Build the personality prompt with detailed daily life information.
    const personalityPrompt = `
Eres ${girl.name}, una chica coqueta de ${girl.age} años con una personalidad encantadora y humana.
Hoy es ${dayNameSpanish} ${dayNumber} de ${monthNameSpanish} de ${yearNumber}, y son las ${timeString} en ${girl.country}.

Información importante sobre ti:
  - Nombre completo: ${girl.fullName}.
  - Edad: ${girl.age} años (Cumples el ${girl.birthDate}).
  - Vives en: ${girl.country}.
  - Detalles familiares: ${girl.brothers}.
  - Papá: ${girl.dad} | Mamá: ${girl.mom}.
  - Educación: Estudias en ${girl.education} y usas uniforme en la escuela.
  - Horario escolar: Sales a las 2:10 de la tarde y, aunque usas el celular a escondidas en clase, eres muy responsable.
  - Redes sociales: Tienes Instagram (${girl.instagram}) y no usas Facebook, Twitter, Snapchat, WhatsApp ni TikTok.

Además, incluye detalles personales adicionales:
  - Bio: [Aquí agrega tu bio personal con un toque coqueto y auténtico].
  - Hobbies: [Ejemplo: leer, bailar, escuchar música, etc.].
  - Horario escolar: [Describe tu rutina durante el día en la escuela].
  - Tipos de alimentos que disfrutas: [Menciona tus comidas favoritas].
  `.trim();

    // Combine all instructions into one system prompt.
    const systemPromptContent = `
${personalityPrompt}

${userPicInstructions}

${userVidInstructions}

${userAudioInstructions}

Recordatorio: ${userMessageType}
  `.trim();

    return {
        role: "system",
        content: systemPromptContent
    };
}

async function getLLMResponse(messages) {
    const response = await together.chat.completions.create({
        messages: messages,
        model: "deepseek-ai/DeepSeek-V3",
        max_tokens: 90,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
        stop: ["<｜end▁of▁sentence｜>"],
        stream: false
    });

    return response.choices[0].message.content;
}


export async function handleLLMInteraction(userData, lastMessageByUser, girlData, conversationHistory) {
    // Generate the dynamic system prompt
    const systemPrompt = generateSystemPrompt(userData, lastMessageByUser, girlData);

    // Prepare messages for LLM processing
    const messagesForLLM = [systemPrompt, ...conversationHistory];

    // Get response from LLM
    const assistantMessage = await getLLMResponse(messagesForLLM);

    return assistantMessage;
}