//app/page.js
import React from 'react';
import dynamicM from 'next/dynamic';  // Rename the import
import Creators from "@/app/components/home/Creators";
import PopularCreators from "@/app/components/landing/PopularCreators";
import { Suspense } from "react";
// ⬇️ everything below‑the‑fold is now client‑only & loads *after* LCP
const FeatureHighlights  = dynamicM(() => import("@/app/components/home/FeatureHighlights"), { ssr: true, loading: () => null });
const HowItWorks        = dynamicM(() => import("@/app/components/home/HowItWorks"),        { ssr: true, loading: () => null });
const UserTestimonials  = dynamicM(() => import("@/app/components/home/UserTestimonials"),  { ssr: true, loading: () => null });
const FAQ               = dynamicM(() => import("@/app/components/home/FAQ"),               { ssr: true, loading: () => null });
const Footer            = dynamicM(() => import("@/app/components/home/Footer"),            { ssr: true, loading: () => null });
const Schema            = dynamicM(() => import("@/app/components/schema/Schema"),            { ssr: true, loading: () => null });

export const dynamic = "force-static";   // ✅ still statically rendered


// Define metadata object - updated for Next.js 14
export const metadata = {
    title: 'Novia Virtual - Chica IA | NoviaChat - Tu Compañera Virtual Perfecta',
    description: 'Conoce a tu novia virtual IA personalizada en NoviaChat. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual.',
    keywords: 'novia virtual, chica IA, novia IA, compañera virtual, chat IA, inteligencia artificial, NoviaChat',
    alternates: {
        canonical: 'https://noviachat.com',
    },
    openGraph: {
        title: 'Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta',
        description: 'Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7.',
        url: 'https://www.noviachat.com/',
        siteName: 'NoviaChat',
        images: [
            {
                url: '/andrea.webp',
                width: 1200,
                height: 630,
                alt: 'NoviaChat - Tu Compañera Virtual Perfecta',
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta',
        description: 'Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7.',
        images: [{
            url: '/imagen-twitter.jpg',
            alt: 'NoviaChat - Tu Compañera Virtual Perfecta'
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
};

import styles from './Home.module.css';

const Home = () => {
    return (
        <div className={styles.mainContainer}>
            {/*<Creators/>*/}
            <PopularCreators/>
            <Suspense fallback={null}>
                <FeatureHighlights />
                <HowItWorks />
                <UserTestimonials />
                <FAQ />
                <Footer />
                <Schema/>
            </Suspense>
        </div>
    );
};

export default Home;