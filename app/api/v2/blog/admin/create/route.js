import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import admin from 'firebase-admin';
import { authMiddleware } from "@/app/middleware/authMiddleware";
import { postToReddit } from '@/app/api/v2/services/redditService';

export async function POST(request) {
  try {
    // Verify admin authentication
    const authResult = await authMiddleware(request); // Fixed: was 'req'
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you may want to adjust this based on your admin identification logic)
    const userId = authResult.user.uid;
    if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') { // Replace with your admin check logic
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      published = false,
    } = body;

    // Validate required fields
    if (!title || !slug || !excerpt || !content || !category || !author) {
      return NextResponse.json(
          { error: 'Faltan campos requeridos' },
          { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPosts = await adminDb
        .firestore()
        .collection('blog-posts')
        .where('slug', '==', slug)
        .get();

    if (!existingPosts.empty) {
      return NextResponse.json(
          { error: 'Ya existe un artículo con este slug' },
          { status: 400 }
      );
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Create the blog post
    const newPost = {
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || null,
      category,
      tags: tags || [],
      author: {
        name: author.name,
        avatar: author.avatar || '/default-avatar.png',
      },
      published,
      publishedAt: published ? admin.firestore.FieldValue.serverTimestamp() : null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      viewCount: 0,
      readTime,
    };

    const docRef = await adminDb
        .firestore()
        .collection('blog-posts')
        .add(newPost);

    // Post to Reddit if the blog post is being published
    if (published) {
      const blogUrl = `https://www.noviachat.com/blog/${slug}`;
      const redditResult = await postToReddit(title, blogUrl, excerpt);
      
      if (redditResult.success) {
        console.log(`Blog post shared to Reddit: ${redditResult.submissionUrl}`);
      } else {
        console.error(`Failed to share to Reddit: ${redditResult.error}`);
        // Don't fail the blog creation if Reddit posting fails
      }
    }

    return NextResponse.json({
      id: docRef.id,
      ...newPost,
      publishedAt: published ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
        { error: 'Error al crear el artículo' },
        { status: 500 }
    );
  }
}