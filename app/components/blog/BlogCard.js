'use client';

import { Box, Typography, Chip, Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

export default function BlogCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
      <ModernCard 
        variant="elevated" 
        animate={true}
        sx={{
          height: '100%',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <CardContentWrapper>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {/* Featured Image */}
            {/*{post.featuredImage && (*/}
            {/*  <Box*/}
            {/*    sx={{*/}
            {/*      width: { xs: '100%', sm: 240 },*/}
            {/*      height: { xs: 180, sm: 160 },*/}
            {/*      flexShrink: 0,*/}
            {/*      borderRadius: 2,*/}
            {/*      overflow: 'hidden',*/}
            {/*      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <img*/}
            {/*      src={post.featuredImage}*/}
            {/*      alt={post.title}*/}
            {/*      style={{*/}
            {/*        width: '100%',*/}
            {/*        height: '100%',*/}
            {/*        objectFit: 'cover',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </Box>*/}
            {/*)}*/}

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              {/* Category */}
              <Chip
                label={post.category}
                size="small"
                sx={{
                  mb: 1,
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />

              {/* Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'rgba(15, 23, 42, 0.95)',
                  mb: 1,
                  lineHeight: 1.3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.title}
              </Typography>

              {/* Excerpt */}
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(71, 85, 105, 0.8)',
                  mb: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {post.excerpt}
              </Typography>

              {/* Meta Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    alt={post.author.name}
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    {post.author.name}
                  </Typography>
                </Box>
                
                <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                  •
                </Typography>
                
                <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Typography>
                
                <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                  •
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 14, color: 'rgba(71, 85, 105, 0.8)' }} />
                  <Typography variant="caption" sx={{ color: 'rgba(71, 85, 105, 0.8)' }}>
                    {post.readTime} min
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContentWrapper>
      </ModernCard>
    </Link>
  );
}