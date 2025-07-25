import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { postToReddit } from '@/app/api/v2/services/redditService';

export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const userId = authResult.user.uid;
    if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get postId or slug from request body
    const postId = 'ndYYaVnNR2NnCufYI8RN'

    if (!postId && !slug) {
      return NextResponse.json({
        error: 'Either postId or slug is required'
      }, { status: 400 });
    }

    let postDoc;

    // Fetch the specific blog post
    if (postId) {
      // Fetch by ID
      postDoc = await adminDb
          .firestore()
          .collection('blog-posts')
          .doc(postId)
          .get();
    } else {
      // Fetch by slug
      const postsSnapshot = await adminDb
          .firestore()
          .collection('blog-posts')
          .where('slug', '==', slug)
          .limit(1)
          .get();

      if (!postsSnapshot.empty) {
        postDoc = postsSnapshot.docs[0];
      }
    }

    if (!postDoc || !postDoc.exists) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const post = { id: postDoc.id, ...postDoc.data() };

    // Check if post is published
    if (!post.published) {
      return NextResponse.json({
        error: 'Post is not published'
      }, { status: 400 });
    }

    console.log(`Posting to Reddit: ${post.title}`);

    const blogUrl = `https://www.noviachat.com/blog/${post.slug}`;

    try {
      const redditResult = await postToReddit(post.title, blogUrl, post.excerpt);

      if (redditResult.success) {
        console.log(`Successfully posted: ${redditResult.submissionUrl}`);
        return NextResponse.json({
          message: 'Successfully posted to Reddit',
          post: {
            title: post.title,
            slug: post.slug,
            blogUrl: blogUrl,
            redditUrl: redditResult.submissionUrl,
          },
        });
      } else {
        console.error(`Failed to post: ${redditResult.error}`);
        return NextResponse.json({
          error: 'Failed to post to Reddit',
          details: redditResult.error,
        }, { status: 500 });
      }
    } catch (error) {
      console.error(`Error posting ${post.title}:`, error);
      return NextResponse.json({
        error: 'Error posting to Reddit',
        details: error.message,
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in Reddit posting:', error);
    return NextResponse.json(
        { error: 'Error al publicar en Reddit' },
        { status: 500 }
    );
  }
}