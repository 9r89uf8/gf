'use client';

import { Box, Typography, Chip, Divider, List, ListItem, ListItemText } from '@mui/material';
import Link from 'next/link';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { useEffect, useState } from 'react';

export default function BlogSidebar() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  useEffect(() => {
    // Fetch recent posts
    fetch('/api/v2/blog/posts?limit=5&sort=recent')
      .then(res => res.json())
      .then(data => setRecentPosts(data.posts || []))
      .catch(console.error);

    // For now, we'll use static tags
    setPopularTags([
      'novia virtual',
      'chicas ia',
      'inteligencia artificial',
      'relaciones',
      'tecnología',
      'guías',
      'consejos',
      'chat ia',
      'compañera virtual',
    ]);
  }, []);

  const categories = [
    { name: 'Relaciones IA', slug: 'relaciones-ia', count: 15 },
    { name: 'Guías', slug: 'guias', count: 12 },
    { name: 'Tecnología', slug: 'tecnologia', count: 8 },
    { name: 'Historias', slug: 'historias', count: 6 },
  ];

  return (
    <Box sx={{ position: 'sticky', top: 100 }}>
      {/* Categories */}
      <ModernCard variant="elevated" animate={false} sx={{ mb: 3 }}>
        <CardContentWrapper>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'rgba(15, 23, 42, 0.95)',
              mb: 2,
            }}
          >
            Categorías
          </Typography>
          <List disablePadding>
            {categories.map((category) => (
              <ListItem
                key={category.slug}
                component={Link}
                href={`/blog?category=${category.slug}`}
                sx={{
                  px: 0,
                  py: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': {
                    '& .MuiListItemText-primary': {
                      color: '#1a1a1a',
                    },
                  },
                }}
              >
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 500,
                      color: 'rgba(51, 65, 85, 0.9)',
                      transition: 'color 0.2s',
                    },
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    backgroundColor: 'rgba(241, 245, 249, 0.8)',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 10,
                    color: 'rgba(71, 85, 105, 0.8)',
                  }}
                >
                  {category.count}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContentWrapper>
      </ModernCard>

      {/* Recent Posts */}
      <ModernCard variant="elevated" animate={false} sx={{ mb: 3 }}>
        <CardContentWrapper>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'rgba(15, 23, 42, 0.95)',
              mb: 2,
            }}
          >
            Artículos Recientes
          </Typography>
          <List disablePadding>
            {recentPosts.map((post, index) => (
              <Box key={post.slug}>
                <ListItem
                  component={Link}
                  href={`/blog/${post.slug}`}
                  sx={{
                    px: 0,
                    py: 1.5,
                    textDecoration: 'none',
                    color: 'inherit',
                    alignItems: 'flex-start',
                    '&:hover': {
                      '& .MuiListItemText-primary': {
                        color: '#1a1a1a',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={post.title}
                    secondary={new Date(post.publishedAt).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'rgba(15, 23, 42, 0.95)',
                        transition: 'color 0.2s',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: {
                        fontSize: '0.75rem',
                        color: 'rgba(71, 85, 105, 0.6)',
                      },
                    }}
                  />
                </ListItem>
                {index < recentPosts.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </CardContentWrapper>
      </ModernCard>

      {/* Popular Tags */}
      <ModernCard variant="elevated" animate={false}>
        <CardContentWrapper>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'rgba(15, 23, 42, 0.95)',
              mb: 2,
            }}
          >
            Etiquetas Populares
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                component={Link}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                clickable
                size="small"
                sx={{
                  backgroundColor: 'rgba(241, 245, 249, 0.8)',
                  color: 'rgba(51, 65, 85, 0.9)',
                  textDecoration: 'none',
                  '&:hover': {
                    backgroundColor: '#1a1a1a',
                    color: '#fff',
                  },
                }}
              />
            ))}
          </Box>
        </CardContentWrapper>
      </ModernCard>
    </Box>
  );
}