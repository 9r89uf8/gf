import { Suspense } from 'react';
import { Container, Typography, Box, Grid, Skeleton } from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import BlogGrid from '@/app/components/blog/BlogGrid';
import BlogSidebar from '@/app/components/blog/BlogSidebar';
import BlogFilters from '@/app/components/blog/BlogFilters'; // Import the new client component

export const metadata = {
    title: 'Blog - Relaciones IA, Guías y Tecnología | noviachat',
    description: 'Descubre artículos sobre relaciones con IA, guías de usuario, actualizaciones tecnológicas y consejos para mejorar tu experiencia con tu novia virtual.',
    keywords: ['novia virtual', 'novia virtual gratis', 'chicas ia', 'novia ia', 'chica ia', 'compañera virtual ia', 'compañera ia', 'blog ia', 'relaciones ia'],
    alternates: {
        canonical: 'https://noviachat.com/blog',
        types: {
            'application/rss+xml': [{ url: '/api/v2/blog/rss', title: 'RSS Feed - Blog noviachat' }],
        },
    },
    openGraph: {
        title: 'Blog - Relaciones IA y Tecnología | noviachat',
        description: 'Artículos educativos sobre relaciones con IA, guías y actualizaciones tecnológicas',
        type: 'website',
        images: ['/og-blog.jpg'],
        url: 'https://noviachat.com/blog',
        siteName: 'noviachat',
        locale: 'es_ES',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog - Relaciones IA y Tecnología | noviachat',
        description: 'Artículos educativos sobre relaciones con IA, guías y actualizaciones tecnológicas',
        images: ['/og-blog.jpg'],
    },
    other: {
        'article:publisher': 'noviachat',
        'article:section': 'Blog',
    },
};

export default async function BlogPage({ searchParams }) {
    const { category, tag, search, page = 1 } = searchParams;

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', md: '3.5rem' },
                            fontWeight: 700,
                            color: 'rgba(15, 23, 42, 0.95)',
                            mb: 2,
                        }}
                    >
                        Blog noviachat
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(71, 85, 105, 0.8)',
                            maxWidth: 600,
                            mx: 'auto',
                            mb: 4,
                        }}
                    >
                        Explora el fascinante mundo de las relaciones con IA, tecnología de vanguardia y consejos para mejorar tu experiencia
                    </Typography>

                    {/* Search Bar and Categories - Now a Client Component */}
                    <BlogFilters />
                </Box>

                {/* Main Content */}
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Suspense fallback={<BlogGridSkeleton />}>
                            <BlogGrid
                                category={category}
                                tag={tag}
                                search={search}
                                page={parseInt(page)}
                            />
                        </Suspense>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <BlogSidebar />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

function BlogGridSkeleton() {
    return (
        <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12 }} key={i}>
                    <ModernCard>
                        <CardContentWrapper>
                            <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
                            <Skeleton variant="text" sx={{ fontSize: '2rem' }} />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </CardContentWrapper>
                    </ModernCard>
                </Grid>
            ))}
        </Grid>
    );
}