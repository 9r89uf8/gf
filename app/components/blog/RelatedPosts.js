import { Grid } from '@mui/material';
import BlogCard from './BlogCard';

async function getRelatedPosts(currentSlug, category) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/blog/posts?category=${category}&limit=3&exclude=${currentSlug}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export default async function RelatedPosts({ currentSlug, category }) {
  const posts = await getRelatedPosts(currentSlug, category);

  if (posts.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={3}>
      {posts.map((post) => (
        <Grid size={{ xs: 12, md: 4 }} key={post.slug}>
          <BlogCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
}