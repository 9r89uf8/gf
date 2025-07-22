import { notFound } from 'next/navigation';
import { Container, Typography, Box, Grid, Chip, Avatar, Divider, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import BlogContent from '@/app/components/blog/BlogContent';
import RelatedPosts from '@/app/components/blog/RelatedPosts';
import ShareButtons from '@/app/components/blog/ShareButtons';

async function getBlogPost(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v2/blog/post/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
    };
  }

  return {
    title: `${post.title} | Blog noviachat`,
    description: post.excerpt,
    keywords: [...post.tags, 'novia virtual', 'chicas ia', 'novia ia'],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [post.featuredImage || '/og-blog.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || '/og-blog.jpg'],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      image: post.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: 'noviachat',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
        <Container maxWidth="md">
          {/* Back Button */}
          <Button
            component={Link}
            href="/blog"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 3,
              color: 'rgba(71, 85, 105, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Volver al Blog
          </Button>

          {/* Article */}
          <ModernCard variant="elevated" animate={true}>
            <CardContentWrapper>
              {/* Featured Image */}
              {post.featuredImage && (
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: 250, md: 400 },
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: 4,
                  }}
                >
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              )}

              {/* Category */}
              <Chip
                label={post.category}
                sx={{
                  mb: 2,
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />

              {/* Title */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  color: 'rgba(15, 23, 42, 0.95)',
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                {post.title}
              </Typography>

              {/* Meta Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    alt={post.author.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                      {post.author.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                      {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 18, color: 'rgba(71, 85, 105, 0.8)' }} />
                  <Typography variant="body2" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    {post.readTime} min de lectura
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Content */}
              <BlogContent content={post.content} />

              {/* Tags */}
              <Box sx={{ mt: 4, mb: 3 }}>
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    size="small"
                    sx={{
                      m: 0.5,
                      backgroundColor: 'rgba(241, 245, 249, 0.8)',
                      color: 'rgba(71, 85, 105, 0.9)',
                      '&:hover': {
                        backgroundColor: 'rgba(226, 232, 240, 1)',
                      },
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* Share */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'rgba(15, 23, 42, 0.95)' }}>
                  Comparte este artículo
                </Typography>
                <ShareButtons
                  url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${params.slug}`}
                  title={post.title}
                />
              </Box>
            </CardContentWrapper>
          </ModernCard>

          {/* Related Posts */}
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: 'rgba(15, 23, 42, 0.95)',
              }}
            >
              Artículos Relacionados
            </Typography>
            <RelatedPosts currentSlug={params.slug} category={post.category} />
          </Box>
        </Container>
      </Box>
    </>
  );
}