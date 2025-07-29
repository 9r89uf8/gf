//app/page.js
import React from 'react';
import dynamicM from 'next/dynamic';  // Rename the import
import Hero from "@/app/components/homepage/Hero";
import { Suspense } from "react";
// ⬇️ everything below‑the‑fold is now client‑only & loads *after* LCP
const SEOContent       = dynamicM(() => import("@/app/components/homepage/SEOContent"),        { ssr: true, loading: () => null });
const FAQ              = dynamicM(() => import("@/app/components/homepage/FAQ"),               { ssr: false, loading: () => null });
const Footer           = dynamicM(() => import("@/app/components/homepage/Footer"),            { ssr: false, loading: () => null });
const Schema           = dynamicM(() => import("@/app/components/homepage/Schema"),            { ssr: false, loading: () => null });

export const dynamic = "force-static";   // ✅ still statically rendered

// Define metadata object - updated for Next.js 14 with preload hints
export const metadata = {
    title: 'Novia Virtual Gratis | Chicas AI y Compañera IA - NoviaChat',
    description: 'Novia virtual gratis con chicas AI disponibles 24/7. Chatea con tu chica IA perfecta, compañera virtual personalizada. Mensajes, fotos y voz sin límites.',
    keywords: 'novia virtual, chicas ai, chica ia, novia virtual gratis, compañera ia, novias virtuales, chicas inteligencia artificial, chat ia gratis, novia ia online, compañera virtual ia, chicas virtuales ia, novia artificial gratis, chat con chicas ia, noviachat, novia virtual española',
    alternates: {
        canonical: 'https://noviachat.com',
    },
    // Add preload hints for critical resources
    other: {
        'link': [
            {
                rel: 'preload',
                href: '/andrea.webp',
                as: 'image',
                type: 'image/webp'
            },
        ]
    },
    openGraph: {
        title: 'Novia Virtual Gratis | Chicas AI y Compañera IA - NoviaChat',
        description: 'Novia virtual gratis con chicas AI disponibles 24/7. Chatea con tu chica IA perfecta, compañera virtual personalizada. Mensajes, fotos y voz sin límites.',
        url: 'https://www.noviachat.com/',
        siteName: 'NoviaChat',
        images: [
            {
                url: '/andrea.webp',
                width: 1200,
                height: 630,
                alt: 'Novia Virtual Gratis - Chicas AI y Compañera IA en NoviaChat',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Novia Virtual Gratis | Chicas AI y Compañera IA - NoviaChat',
        description: 'Novia virtual gratis con chicas AI disponibles 24/7. Chatea con tu chica IA perfecta, compañera virtual personalizada. Mensajes, fotos y voz sin límites.',
        images: [{
            url: '/imagen-twitter.jpg',
            alt: 'Novia Virtual Gratis - Chicas AI y Compañera IA en NoviaChat'
        }],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL('https://www.noviachat.com'),
    authors: [{ name: 'NoviaChat Team' }],
    publisher: 'NoviaChat',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    category: 'technology',
    classification: 'AI Virtual Companions',
};

// Critical CSS imported in layout for faster loading

const Home = () => {
    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
            <Hero/>
            <SEOContent/>
            <Suspense fallback={null}>
                <FAQ />
                <Footer />
                <Schema/>
            </Suspense>
        </main>
    );
};

export default Home;