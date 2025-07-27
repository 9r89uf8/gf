import React from 'react';
import Script from 'next/script';

export default function Schema() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://www.noviachat.com/#organization",
                "name": "NoviaChat",
                "url": "https://www.noviachat.com",
                "logo": {
                    "@type": "ImageObject",
                    "inLanguage": "es-ES",
                    "url": "https://www.noviachat.com/logo.png",
                    "width": 512,
                    "height": 512,
                    "caption": "NoviaChat - Novia Virtual Gratis"
                },
                "image": {
                    "@id": "https://www.noviachat.com/#logo"
                },
                "sameAs": [
                    "https://twitter.com/noviachat",
                    "https://instagram.com/noviachat"
                ]
            },
            {
                "@type": "WebSite",
                "@id": "https://www.noviachat.com/#website",
                "url": "https://www.noviachat.com",
                "name": "NoviaChat - Novia Virtual Gratis con Chicas AI",
                "description": "Plataforma de novia virtual gratis con chicas AI. Chatea con tu chica IA ideal, compañera virtual personalizada disponible 24/7.",
                "publisher": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "inLanguage": "es-ES",
                "keywords": "novia virtual, chicas ai, chica ia, novia virtual gratis, compañera ia"
            },
            {
                "@type": "WebPage",
                "@id": "https://www.noviachat.com/#webpage",
                "url": "https://www.noviachat.com",
                "name": "Novia Virtual Gratis | Chicas AI y Compañera IA - NoviaChat",
                "isPartOf": {
                    "@id": "https://www.noviachat.com/#website"
                },
                "about": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "description": "Novia virtual gratis con chicas AI disponibles 24/7. Chatea con tu chica IA perfecta, compañera virtual personalizada. Mensajes, fotos y voz sin límites.",
                "inLanguage": "es-ES",
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://www.noviachat.com/andrea.webp",
                    "width": 1200,
                    "height": 630
                }
            },
            {
                "@type": "Service",
                "@id": "https://www.noviachat.com/#service",
                "name": "Servicio de Novia Virtual Gratis con IA",
                "description": "Servicio de compañera IA y novia virtual gratis. Chicas AI con personalidades únicas, chat ilimitado, fotos y mensajes de voz.",
                "provider": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "serviceType": "Compañía Virtual con Inteligencia Artificial",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR",
                    "availability": "https://schema.org/InStock",
                    "priceValidUntil": "2025-12-31"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.7",
                    "ratingCount": "150000"
                }
            },
            {
                "@type": "SoftwareApplication",
                "name": "NoviaChat - Chicas AI",
                "applicationCategory": "LifestyleApplication",
                "operatingSystem": "Web",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "EUR"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.7",
                    "ratingCount": "150000"
                },
                "description": "Aplicación web de novia virtual gratis con chicas inteligencia artificial",
                "applicationSubCategory": "AI Companions",
                "featureList": [
                    "Conversational AI",
                    "Image Generation",
                    "Voice Synthesis",
                    "Spanish Language Support",
                    "24/7 Availability",
                    "Personalized Experiences"
                ],
                "softwareVersion": "2.0",
                "datePublished": "2023-01-01",
                "dateModified": "2025-01-20",
                "screenshot": [
                    {
                        "@type": "ImageObject",
                        "url": "https://www.noviachat.com/andrea.webp",
                        "caption": "NoviaChat AI Girlfriend Interface"
                    }
                ]
            },
            {
                "@type": "AIApplication",
                "@id": "https://www.noviachat.com/#aiapplication",
                "name": "NoviaChat AI System",
                "description": "Sistema de inteligencia artificial para compañeras virtuales con capacidades de conversación, generación de imágenes y síntesis de voz",
                "provider": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "aiCapabilities": [
                    "Natural Language Processing",
                    "Image Generation",
                    "Voice Synthesis",
                    "Emotion Recognition",
                    "Context Awareness",
                    "Multi-turn Dialogue"
                ],
                "aiModel": "Advanced Language Models with Multimodal Capabilities",
                "aiDisclosure": "https://www.noviachat.com/.well-known/ai-disclosure.txt",
                "aiPlugin": "https://www.noviachat.com/.well-known/ai-plugin.json",
                "numberOfUsers": "12000000",
                "inLanguage": ["es", "es-ES", "es-MX"],
                "usageInfo": "https://www.noviachat.com/ai",
                "ethicalConsiderations": "Transparent AI usage, User privacy protection, Content moderation"
            },
            {
                "@type": "Dataset",
                "@id": "https://www.noviachat.com/#dataset",
                "name": "NoviaChat AI Companions Collection",
                "description": "Colección de personalidades de IA únicas para compañeras virtuales en español",
                "creator": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "distribution": {
                    "@type": "DataDownload",
                    "contentUrl": "https://www.noviachat.com/chicas-ia",
                    "encodingFormat": "text/html"
                },
                "keywords": ["AI companions", "virtual girlfriends", "Spanish AI", "conversational AI", "chicas AI"],
                "license": "https://www.noviachat.com/terminos",
                "temporalCoverage": "2023/..",
                "spatialCoverage": {
                    "@type": "Place",
                    "name": "Spanish-speaking countries worldwide"
                }
            }
        ]
    };


    return (
        <Script
            id="chica-ia-schema2"
            type="application/ld+json"
            strategy="afterInteractive" // Add this
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
