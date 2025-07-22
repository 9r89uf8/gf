import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { seedArticles, generateArticleHTML } from '../seed-articles';

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

    const results = {
      created: [],
      skipped: [],
      errors: [],
    };

    // Process each seed article
    for (const article of seedArticles) {
      try {
        // Check if article already exists
        const existingPosts = await adminDb
            .firestore()
            .collection('blog-posts')
            .where('slug', '==', article.slug)
            .get();

        if (!existingPosts.empty) {
          results.skipped.push(article.slug);
          continue;
        }

        // Generate the full article data
        const articleData = generateArticleHTML(article);

        // Add to Firestore
        const docRef = await adminDb
            .firestore()
            .collection('blog-posts')
            .add(articleData);

        results.created.push({
          id: docRef.id,
          slug: article.slug,
          title: article.title,
        });
      } catch (error) {
        console.error(`Error seeding article ${article.slug}:`, error);
        results.errors.push({
          slug: article.slug,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Proceso de siembra completado',
      results,
    });
  } catch (error) {
    console.error('Error in seed process:', error);
    return NextResponse.json(
        { error: 'Error al ejecutar el proceso de siembra' },
        { status: 500 }
    );
  }
}