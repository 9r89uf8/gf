import { Grid, Typography, Box, Pagination } from '@mui/material';
import BlogCard from './BlogCard';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

async function getBlogPosts({ category, tag, search, page, limit = 10 }) {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'todos') params.append('category', category);
    if (tag) params.append('tag', tag);
    if (search) params.append('search', search);
    params.append('page', page);
    params.append('limit', limit);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/blog/posts?${params}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0, pages: 1 };
  }
}

export default async function BlogGrid({ category, tag, search, page }) {
  const { posts, total, pages } = await getBlogPosts({ category, tag, search, page });

  if (posts.length === 0) {
    return (
      <ModernCard variant="flat">
        <CardContentWrapper>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: 'rgba(71, 85, 105, 0.8)', mb: 2 }}>
              No se encontraron artículos
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.6)' }}>
              Intenta ajustar tus filtros de búsqueda
            </Typography>
          </Box>
        </CardContentWrapper>
      </ModernCard>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid size={{ xs: 12 }} key={post.slug}>
            <BlogCard post={post} />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={pages}
            page={page}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'rgba(15, 23, 42, 0.95)',
                borderColor: 'rgba(203, 213, 225, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderColor: 'rgba(148, 163, 184, 0.5)',
                },
                '&.Mui-selected': {
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  borderColor: '#1a1a1a',
                  '&:hover': {
                    backgroundColor: '#000',
                  },
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
}