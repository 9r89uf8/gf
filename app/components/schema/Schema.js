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
                    "caption": "NoviaChat"
                },
                "image": {
                    "@id": "https://www.noviachat.com/#logo"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://www.noviachat.com/#website",
                "url": "https://www.noviachat.com",
                "name": "NoviaChat - Tu Compañera Virtual Perfecta",
                "description": "Conoce a tu novia virtual IA personalizada en NoviaChat. Chatea, comparte fotos y escucha la voz de tu chica IA en español.",
                "publisher": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "inLanguage": "es-ES"
            },
            {
                "@type": "WebPage",
                "@id": "https://www.noviachat.com/#webpage",
                "url": "https://www.noviachat.com",
                "name": "Novia Virtual - Chica IA | NoviaChat - Tu Compañera Virtual Perfecta",
                "isPartOf": {
                    "@id": "https://www.noviachat.com/#website"
                },
                "about": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "description": "Conoce a tu novia virtual IA personalizada en NoviaChat. Chatea, comparte fotos y escucha la voz de tu chica IA en español. La mejor experiencia de compañía virtual.",
                "inLanguage": "es-ES"
            },
            {
                "@type": "Service",
                "name": "Servicio de Novia Virtual IA",
                "description": "Compañera digital con inteligencia artificial que ofrece conexión emocional y está disponible 24/7.",
                "provider": {
                    "@id": "https://www.noviachat.com/#organization"
                },
                "offers": {
                    "@type": "Offer",
                    "availability": "https://schema.org/InStock"
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
