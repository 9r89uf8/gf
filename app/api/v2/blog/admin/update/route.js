import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import admin from 'firebase-admin';
import { authMiddleware } from '@/app/middleware/authMiddleware';

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

    // If publishing for the first time
    if (updateData.published && !postDoc.data().published) {
      updateData.publishedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    // Update the document
    await postRef.update(updateData);

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