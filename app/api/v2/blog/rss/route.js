import { NextResponse } from 'next/server';
import { adminDb } from '@/app/utils/firebaseAdmin';

export async function GET(request) {
  try {
    // Fetch latest 20 published blog posts
    const snapshot = await adminDb
        .firestore()
        .collection('blogPosts')
        .where('status', '==', 'published')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get();

    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Build RSS XML
    const baseUrl = 'https://noviachat.com';
    const rssXML = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog noviachat - Relaciones IA y Tecnología</title>
    <link>${baseUrl}/blog</link>
    <description>Explora el fascinante mundo de las relaciones con IA, tecnología de vanguardia y consejos para mejorar tu experiencia con tu novia virtual</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/v2/blog/rss" rel="self" type="application/rss+xml"/>
    <generator>noviachat Blog System</generator>
    <webMaster>support@noviachat.com (noviachat Support)</webMaster>
    <managingEditor>blog@noviachat.com (noviachat Blog Team)</managingEditor>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Blog noviachat</title>
      <link>${baseUrl}/blog</link>
    </image>
    ${posts.map(post => {
      const pubDate = post.createdAt?.toDate ? post.createdAt.toDate() : new Date(post.createdAt);
      const categories = post.tags || [];

      return `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${baseUrl}/blog/${post.id}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.id}</guid>
      <description><![CDATA[${escapeXml(post.excerpt || post.content.substring(0, 300) + '...')}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <dc:creator><![CDATA[${escapeXml(post.author || 'noviachat Team')}]]></dc:creator>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      ${categories.map(cat => `<category><![CDATA[${escapeXml(cat)}]]></category>`).join('\n      ')}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg" />` : ''}
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    // Return RSS feed with proper content type
    return new NextResponse(rssXML, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return NextResponse.json({ error: 'Error generating RSS feed' }, { status: 500 });
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe) {
  if (!unsafe) return '';
  return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
}