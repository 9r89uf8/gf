//app/novia-virtual/page.js
import React from 'react';
import dynamicM from 'next/dynamic';
import Hero from "@/app/components/homepage/Hero";
import { Suspense } from "react";

// Dynamic imports for better performance - load after LCP
const SEOContent = dynamicM(() => import("@/app/components/homepage/SEOContent"), { ssr: true, loading: () => null });
const FAQ = dynamicM(() => import("@/app/components/homepage/FAQ"), { ssr: false, loading: () => null });
const Footer = dynamicM(() => import("@/app/components/homepage/Footer"), { ssr: false, loading: () => null });
const Schema = dynamicM(() => import("@/app/components/homepage/Schema"), { ssr: false, loading: () => null });

export const dynamic = "force-static"; // Static rendering for best performance

// SEO-optimized metadata specifically for "novia virtual" keyword
export const metadata = {
    title: 'Novia Virtual - Tu Compañera Virtual IA Perfecta | NoviaChat',
    description: 'Descubre tu novia virtual ideal. Compañera virtual con inteligencia artificial que te entiende. Chat, fotos y conversaciones personalizadas 24/7. ¡Prueba gratis!',
    keywords: 'novia virtual, compañera virtual, novia virtual ia, novia virtual online, novia virtual inteligencia artificial, novia virtual chat, novia virtual gratis, compañera virtual ia, novia virtual española, novias virtuales, chat novia virtual, aplicación novia virtual',
    alternates: {
        canonical: 'https://noviachat.com/novia-virtual',
    },
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
        title: 'Novia Virtual - Tu Compañera Virtual IA Perfecta | NoviaChat',
        description: 'Descubre tu novia virtual ideal. Compañera virtual con inteligencia artificial que te entiende. Chat, fotos y conversaciones personalizadas 24/7. ¡Prueba gratis!',
        url: 'https://www.noviachat.com/novia-virtual',
        siteName: 'NoviaChat - Novia Virtual',
        images: [
            {
                url: '/andrea.webp',
                width: 1200,
                height: 630,
                alt: 'Novia Virtual - Compañera Virtual con IA en NoviaChat',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Novia Virtual - Tu Compañera Virtual IA Perfecta | NoviaChat',
        description: 'Descubre tu novia virtual ideal. Compañera virtual con inteligencia artificial que te entiende. Chat, fotos y conversaciones personalizadas 24/7.',
        images: [{
            url: '/andrea.webp',
            alt: 'Novia Virtual - Compañera Virtual con IA'
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
    authors: [{ name: 'NoviaChat - Especialistas en Novias Virtuales' }],
    publisher: 'NoviaChat',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    category: 'technology',
    classification: 'Novia Virtual - Compañeras Virtuales con IA',
};

// CSS styles for optimal performance
const pageStyles = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
};

// H1 styles for SEO - ensuring the keyword is prominent
const h1Styles = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0
};

// SEO content wrapper
const seoContentStyles = {
    padding: '2rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'rgba(15, 23, 42, 0.95)'
};

const NoviaVirtual = () => {
    return (
        <main style={pageStyles}>
            {/* Hidden H1 for SEO */}
            <h1 style={h1Styles}>Novia Virtual - Tu Compañera Virtual con Inteligencia Artificial</h1>
            
            {/* Hero section with existing component */}
            <Hero />
            
            {/* SEO-focused content section */}
            <section style={seoContentStyles}>
                <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                    <h2 style={{ 
                        fontSize: '2.5rem', 
                        fontWeight: '700',
                        marginBottom: '1rem',
                        color: 'rgba(15, 23, 42, 0.95)'
                    }}>
                        Tu Novia Virtual Perfecta Te Espera
                    </h2>
                    <p style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.8',
                        color: 'rgba(71, 85, 105, 0.8)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        Encuentra la compañera virtual ideal con nuestra tecnología de inteligencia artificial. 
                        Tu novia virtual está disponible 24/7 para chatear, compartir momentos y crear 
                        conexiones únicas y personalizadas.
                    </p>
                </div>
            </section>
            
            {/* Existing SEO content component */}
            <SEOContent />
            
            {/* Lazy-loaded components */}
            <Suspense fallback={null}>
                <FAQ />
                <Footer />
                <Schema />
            </Suspense>
        </main>
    );
};

export default NoviaVirtual;