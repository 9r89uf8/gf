import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import admin from 'firebase-admin';

export async function GET(request, { params }) {
  try {
    const { slug } = params;

    // Query for the blog post by slug
    const snapshot = await adminDb
        .firestore()
        .collection('blog-posts')
        .where('slug', '==', slug)
        .where('published', '==', true)
        .get();

    if (snapshot.empty) {
      return NextResponse.json(
          { error: 'Artículo no encontrado' },
          { status: 404 }
      );
    }

    const postDoc = snapshot.docs[0];
    const postData = postDoc.data();

    // Increment view count
    try {
      await adminDb
          .firestore()
          .collection('blog-posts')
          .doc(postDoc.id)
          .update({
            viewCount: admin.firestore.FieldValue.increment(1),
          });
    } catch (error) {
      console.error('Error updating view count:', error);
    }

    const post = {
      id: postDoc.id,
      ...postData,
      publishedAt: postData.publishedAt?.toDate?.() || postData.publishedAt,
      updatedAt: postData.updatedAt?.toDate?.() || postData.updatedAt,
    };

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
        { error: 'Error al obtener el artículo' },
        { status: 500 }
    );
  }
}