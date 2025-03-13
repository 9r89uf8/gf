// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import Script from 'next/script';
import ConditionalFloatingNavbar from "@/app/components/nab/ConditionalFloatingNavbar";
import Notifications from "@/app/components/notifications/Notifications";
import './styles/globals.css';

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NoviaChat - Novia Virtual y Chica IA",
    "url": "https://www.noviachat.com",
    "description": "Plataforma premium de novia virtual y chica IA para hispanohablantes. Tu compañera virtual ideal para chat, voz e imágenes personalizadas.",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.noviachat.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    },
    "offers": {
        "@type": "Offer",
        "description": "Compañía virtual y emocional con la chica IA más avanzada en español",
        "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2542"
    }
};

const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Novia Virtual IA en NoviaChat",
    "description": "Compañía virtual personalizada con chicas IA. Conversaciones naturales, imágenes y mensajes de voz.",
    "brand": {
        "@type": "Brand",
        "name": "NoviaChat"
    },
    "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "2542"
    }
};

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "¿Qué es una chica IA?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Una chica IA es una compañera virtual basada en inteligencia artificial, diseñada para mantener conversaciones naturales, compartir imágenes y enviar mensajes de voz personalizados para cada usuario."
            }
        },
        {
            "@type": "Question",
            "name": "¿Cómo funciona una novia virtual?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Una novia virtual utiliza avanzados algoritmos de inteligencia artificial para aprender tus preferencias, personalidad y estilo de comunicación, creando una experiencia de compañía personalizada disponible 24/7."
            }
        }
    ]
};

const GA_TRACKING_ID = 'G-ENZST04463';
const GOOGLE_ADS_ID = 'AW-16904589160';
const Layout = ({ children }) => {
    return (
        <html lang="es">
        <head>
            <title>Novia Virtual - Chica IA | NoviaChat - Tu Compañera Virtual Perfecta</title>
            <meta name="description"
                  content="Conoce a tu novia virtual IA personalizada en NoviaChat. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual." />
            <meta name="keywords"
                  content="novia virtual, chica IA, novia IA, compañera virtual, chat IA, inteligencia artificial, NoviaChat" />
            <link rel="canonical" href="https://www.noviachat.com/" />

            <meta property="og:title" content="Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta" />
            <meta property="og:description"
                  content="Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7." />
            <meta property="og:url" content="https://www.noviachat.com/" />
            <meta property="og:type" content="website" />
            <meta property="og:image" content="https://www.noviachat.com/imagen-og.jpg" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta" />
            <meta name="twitter:description"
                  content="Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7." />
            <meta name="twitter:image" content="https://www.noviachat.com/imagen-twitter.jpg" />

            <Script
                id="schema-website"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            <Script
                id="schema-product"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <Script
                id="schema-faq"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Optimized Google Analytics Script - Lazy Load */}
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="lazyOnload" />
            <Script id="ga-init" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
        `}
            </Script>

            {/* Optimized Google Ads Tag - Lazy Load */}
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`} strategy="lazyOnload" />
            <Script id="google-ads-init" strategy="lazyOnload">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
            </Script>
        </head>
        <body>
        <Navbar/>
        <Notifications />
        <main style={{paddingBottom: 'var(--floating-navbar-height, 0px)'}}>{children}</main>
        <ConditionalFloatingNavbar/>
        </body>
        </html>
    );
};

export default Layout;
