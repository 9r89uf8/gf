import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';
import { authMiddleware } from "@/app/middleware/authMiddleware";

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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

    // Delete the document
    await postRef.delete();

    return NextResponse.json({
      success: true,
      message: 'Artículo eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
        { error: 'Error al eliminar el artículo' },
        { status: 500 }
    );
  }
}