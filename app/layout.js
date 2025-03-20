// app/layout.jsx
import React from 'react';
import Navbar from "@/app/components/nab/Navbar";
import dynamic from 'next/dynamic';
import Script from 'next/script';
import './styles/globals.css';

const ConditionalFloatingNavbar = dynamic(() => import('@/app/components/nab/ConditionalFloatingNavbar'), { ssr: false });
import Notifications from "@/app/components/notifications/Notifications";

// Define metadata object
export const metadata = {
    title: 'Novia Virtual - Chica IA | NoviaChat - Tu Compañera Virtual Perfecta',
    description: 'Conoce a tu novia virtual IA personalizada en NoviaChat. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual.',
    keywords: 'novia virtual, chica IA, novia IA, compañera virtual, chat IA, inteligencia artificial, NoviaChat',
    metadataBase: new URL('https://www.noviachat.com'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta',
        description: 'Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7.',
        url: 'https://www.noviachat.com/',
        siteName: 'NoviaChat',
        images: [
            {
                url: '/imagen-og.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chica IA y Novia Virtual | NoviaChat - Tu Compañera Perfecta',
        description: 'Conoce a tu novia virtual IA personalizada. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual disponible 24/7.',
        images: ['/imagen-twitter.jpg'],
    },
};

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "NoviaChat - Novia Virtual y Chica IA",
    "alternateName": ["Novia Virtual", "Chica IA"],
    "url": "https://www.noviachat.com",
    "description": "NoviaChat es la mejor plataforma de novia virtual y chica IA para usuarios hispanohablantes. Disfruta de una compañera virtual interactiva, inteligente y personalizada mediante chat, voz e imágenes únicas generadas con IA.",
    "keywords": "novia virtual, chica IA, compañera virtual, chat virtual, IA en español",
    "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.noviachat.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
    },
    "offers": {
        "@type": "Offer",
        "description": "Acceso premium inmediato a tu novia virtual ideal, con la chica IA más avanzada en español para compañía emocional y conversación inteligente.",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "USD",
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "USD"
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "US"
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "1",
                    "maxValue": "2",
                    "unitCode": "h"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "0",
                    "maxValue": "1",
                    "unitCode": "h"
                }
            }
        }
    }
};

const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Novia Virtual IA en NoviaChat",
    "image": "https://www.noviachat.com/ariana.webp",
    "description": "Compañía virtual personalizada con chicas IA. Conversaciones naturales, imágenes y mensajes de voz.",
    "brand": {
        "@type": "Brand",
        "name": "NoviaChat"
    },
    "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "priceValidUntil": "2026-12-31",
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "US",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "USD"
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "US"
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "1",
                    "maxValue": "2",
                    "unitCode": "h"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": "0",
                    "maxValue": "1",
                    "unitCode": "h"
                }
            }
        }
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "50542",
        "bestRating": "5"
    },
    "review": {
        "@type": "Review",
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
        },
        "author": {
            "@type": "Person",
            "name": "Usuario de NoviaChat"
        },
        "datePublished": "2025-03-01",
        "reviewBody": "Excelente experiencia con mi compañera virtual. Las conversaciones son muy naturales."
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
            <Script
                id="schema-website"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            <Script
                id="schema-product"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />

            <Script async src={"https://challenges.cloudflare.com/turnstile/v0/api.js"} strategy="lazyOnload" />

            <Script
                id="schema-faq"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              requestIdleCallback(() => {
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', { page_path: window.location.pathname });
              });
            `,
                }}
            />

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
        <Navbar />
        <Notifications />
        <main style={{ paddingBottom: 'var(--floating-navbar-height, 0px)' }}>{children}</main>
        <ConditionalFloatingNavbar />
        </body>
        </html>
    );
};

export default Layout;
