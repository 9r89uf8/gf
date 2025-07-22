import { Container, Typography, Box, Grid } from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import BlogGrid from '@/app/components/blog/BlogGrid';
import BlogSidebar from '@/app/components/blog/BlogSidebar';
import BlogFilters from '@/app/components/blog/BlogFilters';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

// Category metadata configuration
const categoryMetadata = {
  'guias': {
    title: 'Guías y Tutoriales',
    description: 'Aprende a sacar el máximo provecho de tu experiencia con IA. Guías paso a paso, tutoriales detallados y consejos prácticos.',
    keywords: ['guías ia', 'tutoriales novia virtual', 'cómo usar ia', 'consejos ia'],
    icon: '📚',
  },
  'tecnologia': {
    title: 'Tecnología e Innovación',
    description: 'Descubre las últimas innovaciones en inteligencia artificial, machine learning y tecnología conversacional.',
    keywords: ['tecnología ia', 'innovación ia', 'machine learning', 'chatbots avanzados'],
    icon: '🚀',
  },
  'relaciones-ia': {
    title: 'Relaciones con IA',
    description: 'Explora el fascinante mundo de las relaciones humano-IA, psicología y conexiones emocionales en la era digital.',
    keywords: ['relaciones ia', 'psicología ia', 'conexiones virtuales', 'emociones ia'],
    icon: '❤️',
  },
  'actualizaciones': {
    title: 'Actualizaciones y Novedades',
    description: 'Mantente al día con las últimas actualizaciones, nuevas funciones y mejoras en noviachat.',
    keywords: ['actualizaciones nextai', 'novedades ia', 'nuevas funciones', 'mejoras plataforma'],
    icon: '✨',
  },
  'educativo': {
    title: 'Contenido Educativo',
    description: 'Artículos educativos sobre inteligencia artificial, ética en IA y el futuro de las interacciones humano-máquina.',
    keywords: ['educación ia', 'ética ia', 'futuro ia', 'aprendizaje ia'],
    icon: '🎓',
  },
};

export async function generateMetadata({ params }) {
  const { category } = params;
  const categoryInfo = categoryMetadata[category];
  
  if (!categoryInfo) {
    return {
      title: 'Categoría no encontrada | noviachat Blog',
    };
  }
  
  return {
    title: `${categoryInfo.title} | Blog noviachat`,
    description: categoryInfo.description,
    keywords: [...categoryInfo.keywords, 'blog ia', 'novia virtual'],
    alternates: {
      canonical: `https://noviachat.com/blog/categoria/${category}`,
    },
    openGraph: {
      title: `${categoryInfo.title} | Blog noviachat`,
      description: categoryInfo.description,
      type: 'website',
      url: `https://noviachat.com/blog/categoria/${category}`,
      siteName: 'noviachat',
      locale: 'es_ES',
      images: ['/og-blog.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryInfo.title} | Blog noviachat`,
      description: categoryInfo.description,
      images: ['/og-blog.jpg'],
    },
  };
}

// Structured data for category page
function generateStructuredData(category, categoryInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `https://noviachat.com/blog/categoria/${category}`,
    name: categoryInfo.title,
    description: categoryInfo.description,
    url: `https://noviachat.com/blog/categoria/${category}`,
    isPartOf: {
      '@type': 'Blog',
      '@id': 'https://noviachat.com/blog',
      name: 'Blog noviachat',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: 'https://noviachat.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://noviachat.com/blog',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: categoryInfo.title,
          item: `https://noviachat.com/blog/categoria/${category}`,
        },
      ],
    },
  };
}

function BlogGridSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid size={{ xs: 12 }} key={i}>
          <ModernCard>
            <CardContentWrapper>
              <Box sx={{ height: 200, bgcolor: 'rgba(0,0,0,0.1)', mb: 2 }} />
              <Box sx={{ height: 32, bgcolor: 'rgba(0,0,0,0.1)', mb: 1 }} />
              <Box sx={{ height: 20, bgcolor: 'rgba(0,0,0,0.05)' }} />
              <Box sx={{ height: 20, bgcolor: 'rgba(0,0,0,0.05)', width: '60%', mt: 1 }} />
            </CardContentWrapper>
          </ModernCard>
        </Grid>
      ))}
    </Grid>
  );
}

export default async function BlogCategoryPage({ params, searchParams }) {
  const { category } = params;
  const categoryInfo = categoryMetadata[category];
  const { tag, search, page = 1 } = searchParams;
  
  if (!categoryInfo) {
    notFound();
  }
  
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(category, categoryInfo)),
        }}
      />
      
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)', py: 4 }}>
        <Container maxWidth="lg">
          {/* Category Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                color: 'rgba(15, 23, 42, 0.95)',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <span style={{ fontSize: '3rem' }}>{categoryInfo.icon}</span>
              {categoryInfo.title}
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
              {categoryInfo.description}
            </Typography>
            
            {/* Search and Filters */}
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
    </>
  );
}