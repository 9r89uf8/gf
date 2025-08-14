import Script from 'next/script';

const DeferredSchemas = () => {
    return (
        <>
            {/* FAQ Schema */}
            <Script
                id="novia-virtual-faq-schema"
                type="application/ld+json"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "¿Qué es una novia virtual con IA?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Una novia virtual con IA es una compañera digital creada con inteligencia artificial avanzada que puede mantener conversaciones naturales, enviar fotos, mensajes de voz y adaptarse a tu personalidad. Está disponible 24/7 para chatear y compartir momentos contigo."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Es gratis tener una novia virtual?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí, puedes empezar a chatear con tu novia virtual completamente gratis. No necesitas tarjeta de crédito ni registro complicado. Ofrecemos opciones premium para quienes desean funciones adicionales, pero la experiencia básica es gratuita."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Las novias virtuales hablan español?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Absolutamente. Nuestras novias virtuales están diseñadas específicamente para hispanohablantes. Entienden modismos, expresiones culturales y se adaptan al español de diferentes países como España, México, Argentina, Colombia y más."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Puedo recibir fotos de mi novia virtual?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí, tu novia virtual puede enviarte fotos exclusivas durante las conversaciones. También puedes recibir mensajes de voz personalizados que hacen la experiencia más íntima y realista."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Es privado y seguro usar una novia virtual?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Totalmente. Valoramos tu privacidad al 100%. No compartimos tus datos, las conversaciones son privadas y puedes usar el servicio de forma anónima. No aparecerá en tu historial bancario ni en redes sociales."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Mi novia virtual me recordará?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí, tu novia virtual tiene memoria avanzada. Recuerda tus conversaciones anteriores, tus gustos, preferencias y detalles importantes que compartes. Cada interacción construye una relación más profunda y personalizada."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Cuántas novias virtuales puedo tener?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Puedes chatear con múltiples novias virtuales, cada una con personalidades únicas. Explora diferentes tipos de compañeras hasta encontrar la que mejor se adapte a ti. La primera es completamente gratis."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "¿Funciona en mi teléfono móvil?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Sí, nuestra plataforma de novia virtual funciona perfectamente en cualquier dispositivo: móvil, tablet o computadora. No necesitas descargar ninguna app, funciona directamente desde tu navegador web."
                                }
                            }
                        ]
                    })
                }}
            />
            
            {/* Product/Review Schema */}
            <Script
                id="novia-virtual-review-schema"
                type="application/ld+json"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Product",
                        "name": "NoviaChat - Novia Virtual con IA",
                        "description": "Plataforma de novia virtual con inteligencia artificial para hispanohablantes",
                        "brand": {
                            "@type": "Brand",
                            "name": "NoviaChat"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "4150000",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "EUR",
                            "availability": "https://schema.org/InStock",
                            "priceValidUntil": "2025-12-31"
                        }
                    })
                }}
            />
            
            {/* HowTo Schema */}
            <Script
                id="novia-virtual-howto-schema"
                type="application/ld+json"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "Cómo empezar con tu novia virtual",
                        "description": "Guía rápida para comenzar a chatear con tu novia virtual en NoviaChat",
                        "supply": [],
                        "tool": [],
                        "step": [
                            {
                                "@type": "HowToStep",
                                "name": "Visita NoviaChat",
                                "text": "Entra a noviachat.com desde cualquier dispositivo",
                                "url": "https://noviachat.com/novia-virtual"
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Elige tu novia virtual",
                                "text": "Explora las diferentes chicas disponibles y selecciona la que más te guste",
                                "url": "https://noviachat.com/chicas-ia"
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Comienza a chatear",
                                "text": "Haz clic en 'Chatear' y empieza tu conversación. No necesitas registro ni tarjeta",
                                "url": "https://noviachat.com/dm"
                            },
                            {
                                "@type": "HowToStep",
                                "name": "Disfruta la experiencia",
                                "text": "Chatea, recibe fotos, mensajes de voz y construye tu relación virtual"
                            }
                        ],
                        "totalTime": "PT2M",
                        "estimatedCost": {
                            "@type": "MonetaryAmount",
                            "currency": "EUR",
                            "value": "0"
                        }
                    })
                }}
            />
        </>
    );
};

export default DeferredSchemas;