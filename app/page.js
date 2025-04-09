import React from 'react';
import dynamicM from 'next/dynamic';
import Schema from "@/app/components/schema/Schema";
import Link from 'next/link';
import Hero from '@/app/components/home/Hero'; // Import the Hero component
import FeatureHighlights from '@/app/components/home/FeatureHighlights'; // Import the FeatureHighlights component
import HowItWorks from '@/app/components/home/HowItWorks'; // Import the HowItWorks component
import UserTestimonials from "@/app/components/home/UserTestimonials";
import FAQ from "@/app/components/home/FAQ";
import Footer from "@/app/components/home/Footer";

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
            <Hero />
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