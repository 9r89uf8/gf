import { NextResponse } from 'next/server';
import { db } from '@/firebase.config';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { authenticateRequest } from '@/app/api/v2/middleware/authMiddleware';

export async function POST(request) {
  try {
    // Authenticate request - admin only
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 403 });
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
    const q = query(collection(db, 'blog-posts'), where('slug', '==', slug));
    const existingPosts = await getDocs(q);

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
      publishedAt: published ? serverTimestamp() : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      viewCount: 0,
      readTime,
    };

    const docRef = await addDoc(collection(db, 'blog-posts'), newPost);

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