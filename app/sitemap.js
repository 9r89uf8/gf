import { adminDb } from "@/app/utils/firebaseAdmin";

export default async function sitemap() {
  const baseUrl = 'https://noviachat.com';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/chicas-ia`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/novia-virtual`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date('2025-01-22'),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dm`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacidad`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terminos`,
      lastModified: new Date('2025-01-20'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Fetch all published blog articles
  let blogArticles = [];
  try {
    const blogSnapshot = await adminDb.firestore()
      .collection('blog-posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get();
    
    blogSnapshot.forEach(doc => {
      const data = doc.data();
      blogArticles.push({
        url: `${baseUrl}/blog/${data.slug}`,
        lastModified: data.updatedAt?.toDate?.() || data.createdAt?.toDate?.() || new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error fetching blog articles for sitemap:', error);
  }

  // Fetch blog categories
  const blogCategories = [
    'guias',
    'tecnologia',
    'relaciones-ia',
    'actualizaciones',
    'educativo'
  ].map(category => ({
    url: `${baseUrl}/blog?category=${category}`,
    lastModified: new Date('2025-01-22'),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // Fetch all active girls for their profile pages
  let girlProfiles = [];
  try {
    const girlsSnapshot = await adminDb.firestore()
      .collection('girls')
      .get();
    
    girlsSnapshot.forEach(doc => {
      girlProfiles.push({
        url: `${baseUrl}/${doc.id}`,
        lastModified: new Date('2025-01-20'),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error fetching girls for sitemap:', error);
  }

  return [...staticPages, ...blogArticles, ...blogCategories, ...girlProfiles];
}