import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limitCount = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'recent';
    const exclude = searchParams.get('exclude');

    // Build query using Admin SDK
    let q = adminDb.firestore().collection('blog-posts');

    // Only published posts
    q = q.where('published', '==', true);

    // Category filter
    if (category && category !== 'todos') {
      q = q.where('category', '==', category);
    }

    // Tag filter
    if (tag) {
      q = q.where('tags', 'array-contains', tag);
    }

    // Sorting
    if (sort === 'popular') {
      q = q.orderBy('viewCount', 'desc');
    } else {
      q = q.orderBy('publishedAt', 'desc');
    }

    // Get all documents (we'll handle pagination manually)
    const snapshot = await q.get();
    let posts = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!exclude || data.slug !== exclude) {
        posts.push({
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate?.() || data.publishedAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        });
      }
    });

    // Search filter (client-side)
    if (search) {
      const searchLower = search.toLowerCase();
      posts = posts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    const total = posts.length;
    const totalPages = Math.ceil(total / limitCount);

    // Pagination
    const startIndex = (page - 1) * limitCount;
    const endIndex = startIndex + limitCount;
    const paginatedPosts = posts.slice(startIndex, endIndex);

    return NextResponse.json({
      posts: paginatedPosts,
      total,
      pages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
        { error: 'Error al obtener los artículos del blog' },
        { status: 500 }
    );
  }
}