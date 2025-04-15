//app/page.js
import React from 'react';
import dynamicImport from 'next/dynamic';  // Rename the import
import Schema from "@/app/components/schema/Schema";
import Creators from "@/app/components/home/Creators";

// Lazy load components that aren't needed for initial viewport
const FeatureHighlights = dynamicImport(() => import('@/app/components/home/FeatureHighlights'), {
    loading: () => <div>Loading...</div>,
    ssr: true
});

const HowItWorks = dynamicImport(() => import('@/app/components/home/HowItWorks'), {
    loading: () => <div>Loading...</div>,
    ssr: true
});

const UserTestimonials = dynamicImport(() => import('@/app/components/home/UserTestimonials'), {
    loading: () => <div>Loading...</div>,
    ssr: true
});

const FAQ = dynamicImport(() => import('@/app/components/home/FAQ'), {
    loading: () => <div>Loading...</div>,
    ssr: true
});

const Footer = dynamicImport(() => import('@/app/components/home/Footer'), {
    ssr: true
});


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
            <Creators/>
            {/* Add other section components here as you develop them */}
            <FeatureHighlights />
             <HowItWorks />
             <UserTestimonials />
             <FAQ />
             <Footer />
            <Schema />
        </div>
    );
};

export const dynamic = "force-static"; // Use this if the page is truly static!
// export const revalidate = 60;

export default Home;