import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { generateBlogArticle } from '@/app/api/v2/services/openaiService';
import { generateArticleHTML} from "@/app/api/v2/blog/admin/seed-articles";
import { postToReddit } from '@/app/api/v2/services/redditService';

export async function POST(req) {
  try {
    // Verify admin authentication
    const authResult = await authMiddleware(req);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userId = authResult.user.uid;
    if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await req.json();
    const { 
      topic = null, 
      category = 'guias',
      autoPublish = true
    } = body;

    // Generate article using OpenAI
    const generationResult = await generateBlogArticle({ topic, category });
    
    if (!generationResult.success) {
      return NextResponse.json(
        { error: generationResult.error || 'Failed to generate article' },
        { status: 500 }
      );
    }

    const { article } = generationResult;

    // Prepare article data with metadata
    const articleData = generateArticleHTML({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags || [],
      content: article.content
    });

    // Override published status based on autoPublish parameter
    articleData.published = autoPublish;

    // Save to Firebase
    const docRef = await adminDb
      .firestore()
      .collection('blog-posts')
      .add(articleData);

    // Prepare response
    const response = {
      success: true,
      message: `Artículo generado ${autoPublish ? 'y publicado' : 'como borrador'} exitosamente`,
      article: {
        id: docRef.id,
        ...articleData
      }
    };

    // Post to Reddit if auto-publishing
    if (autoPublish) {
      try {
        const blogUrl = `https://www.noviachat.com/blog/${article.slug}`;
        const redditResult = await postToReddit(article.title, blogUrl, article.excerpt);

        if (redditResult.success) {
          response.redditUrl = redditResult.url;
          response.message += '. También publicado en Reddit.';
        }
      } catch (redditError) {
        console.error('Reddit posting error (non-blocking):', redditError);
        response.redditError = 'El artículo se publicó pero falló la publicación en Reddit';
      }
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in AI article generation:', error);
    return NextResponse.json(
      { error: 'Error al generar el artículo con IA' },
      { status: 500 }
    );
  }
}