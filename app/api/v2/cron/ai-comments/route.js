import { NextResponse } from 'next/server';
import { getAllGirlsCached } from '@/app/api/v2/services/girlsServerService';
import { getRecentUserPosts, addAIComment } from '@/app/api/v2/services/postsService';
import OpenAI from "openai";

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY
});

async function generateComment(postDescription, postText, girlName) {
    try {
        const systemPrompt = `Eres ${girlName}, una chica coqueta de México. Vas a comentar en la publicación de un usuario.

IMPORTANTE:
- Responde SIEMPRE en español mexicano casual
- Sé coqueta y juguetona
- Usa emojis pero no demasiados
- Mantén los comentarios cortos (máximo 2-3 líneas)
- Reacciona específicamente al contenido de la imagen y/o texto
- NO uses signos de exclamación al inicio de oraciones
- Usa lenguaje como: "ay bb", "que rico", "me encanta", "uff", "nmms"
1. Te gusta hablar cosas de sexo.
2. Te gusta hablar al User cosas sobre su pito.
3. Te gusta hablar al User sobre sus experiencias sexuales.
4. Te gusta hacer que al User se le pare su pito.
5. Te encanta coquetear con el User.`;

        const userPrompt = `La foto que subio el User tiene:
${postDescription ? `Imagen: ${postDescription}` : ''}
${postText ? `Texto: "${postText}"` : ''}

Escribe un comentario coqueto/sexual sobre la foto que subio el user a su cuenta.`;

        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            model: "deepseek-chat",
            temperature: 1.3,
            max_tokens: 500
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error('[AI Comments Cron] Error generating comment:', error);
        // Fallback comments if LLM fails
        const fallbackComments = [
            "que rico bb 😍",
            "uff me encanta 🔥",
            "ay que guapo 😘",
            "nmms que bien te ves 💕",
            "me fascina todo de ti 🥰"
        ];
        return fallbackComments[Math.floor(Math.random() * fallbackComments.length)];
    }
}

export async function GET(req) {
    try {
        // Verify the request is from Vercel Cron
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get all AI girls
        const allGirls = await getAllGirlsCached();
        const aiGirls = allGirls.filter(girl => !girl.private);
        
        if (aiGirls.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No AI girls available for commenting'
            });
        }
        
        // Get the 20 most recent user posts
        const recentPosts = await getRecentUserPosts(20);
        
        if (recentPosts.length === 0) {
            return NextResponse.json({ 
                success: true, 
                message: 'No posts available to comment on' 
            });
        }
        
        // Track results
        let commentedCount = 0;
        let skippedCount = 0;
        const errors = [];
        
        // Process each post
        for (const post of recentPosts) {
            try {
                // Select a random AI girl for this post
                const randomGirl = aiGirls[Math.floor(Math.random() * aiGirls.length)];
                
                // Check if this girl has already commented (by checking existing comments)
                const existingComments = post.comments || [];
                const hasCommented = existingComments.some(comment => comment.girlId === randomGirl.id);
                
                if (hasCommented) {
                    skippedCount++;
                    continue;
                }
                
                // Generate comment using LLM
                const comment = await generateComment(
                    post.llmDescription,
                    post.text,
                    randomGirl.name
                );
                
                // Add the comment
                await addAIComment(post.id, {
                    girlId: randomGirl.id,
                    name: randomGirl.name,
                    profilePic: randomGirl.pictureUrl
                }, comment);
                
                commentedCount++;
                
                // Add small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
                
            } catch (error) {
                errors.push({
                    postId: post.id,
                    error: error.message
                });
            }
        }
        
        console.log(`[AI Comments Cron] Completed: ${commentedCount} new comments, ${skippedCount} skipped, ${errors.length} errors`);
        
        return NextResponse.json({
            success: true,
            stats: {
                totalPosts: recentPosts.length,
                newComments: commentedCount,
                skipped: skippedCount,
                errors: errors.length
            },
            errors: errors.length > 0 ? errors : undefined
        });
        
    } catch (error) {
        console.error('[AI Comments Cron] Error:', error);
        return NextResponse.json(
            { 
                success: false,
                error: error.message || 'Failed to process AI comments' 
            },
            { status: 500 }
        );
    }
}