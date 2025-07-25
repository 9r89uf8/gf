import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import admin from 'firebase-admin';
import { authMiddleware } from '@/app/middleware/authMiddleware';
import { postToReddit } from '@/app/api/v2/services/redditService';

export async function PUT(request) {
  try {
    // Verify admin authentication
    const authResult = await authMiddleware(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you may want to adjust this based on your admin identification logic)
    const userId = authResult.user.uid;
    if (userId !== '3UaQ4dtkNthHMq9VKqDCGA0uPix2') { // Replace with your admin check logic
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
          { error: 'ID del artículo requerido' },
          { status: 400 }
      );
    }

    // Get the document reference
    const postRef = adminDb.firestore().collection('blog-posts').doc(id);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
      );
    }

    // Calculate read time if content is updated
    if (updateData.content) {
      const wordCount = updateData.content.split(/\s+/).length;
      updateData.readTime = Math.ceil(wordCount / 200);
    }

    // Update timestamp
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    // Check if publishing for the first time
    const wasPublished = postDoc.data().published;
    const isNowPublished = updateData.published;
    
    // If publishing for the first time
    if (isNowPublished && !wasPublished) {
      updateData.publishedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    // Update the document
    await postRef.update(updateData);

    // Post to Reddit if the blog post is being published for the first time
    if (isNowPublished && !wasPublished) {
      const postData = postDoc.data();
      const slug = updateData.slug || postData.slug;
      const title = updateData.title || postData.title;
      const excerpt = updateData.excerpt || postData.excerpt;
      const blogUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}`;
      const redditResult = await postToReddit(title, blogUrl, excerpt);
      
      if (redditResult.success) {
        console.log(`Blog post shared to Reddit: ${redditResult.submissionUrl}`);
      } else {
        console.error(`Failed to share to Reddit: ${redditResult.error}`);
        // Don't fail the blog update if Reddit posting fails
      }
    }

    // Get updated document
    const updatedDoc = await postRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedData,
      publishedAt: updatedData.publishedAt?.toDate?.() || updatedData.publishedAt,
      updatedAt: updatedData.updatedAt?.toDate?.() || updatedData.updatedAt,
      createdAt: updatedData.createdAt?.toDate?.() || updatedData.createdAt,
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
        { error: 'Error al actualizar el artículo' },
        { status: 500 }
    );
  }
}