//app/novia-virtual/page.js]
import React from 'react';
import dynamicM from 'next/dynamic';
import { Suspense } from "react";
import Script from 'next/script';
import './styles.css';

// Dynamic imports for better performance - load after LCP
const Footer = dynamicM(() => import("@/app/components/homepage/Footer"), { ssr: false, loading: () => null });
const Schema = dynamicM(() => import("@/app/components/homepage/Schema"), { ssr: false, loading: () => null });

export const dynamic = "force-static"; // Static rendering for best performance

// Hot Hero Component
const HotHero = () => {

    const heroSectionStyles = {
        padding: '20px 0 80px',
        position: 'relative',
        overflow: 'hidden'
    };

    const heroContainerStyles = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        position: 'relative',
        zIndex: 2
    };

    const heroGridStyles = {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center'
    };

    const heroTitleStyles = {
        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '20px',
        color: 'rgba(15, 23, 42, 0.95)'
    };

    const heroSubtitleStyles = {
        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
        lineHeight: '1.5',
        marginBottom: '30px',
        color: 'rgba(71, 85, 105, 0.8)'
    };

    const trustBadgesStyles = {
        display: 'flex',
        gap: '15px',
        marginBottom: '40px',
        flexWrap: 'wrap'
    };

    const trustBadgeStyles = {
        background: 'rgba(255, 255, 255, 0.8)',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: '600',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        color: 'rgba(15, 23, 42, 0.95)',
        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)'
    };

    const ctaButtonStyles = {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        border: 'none',
        padding: '18px 40px',
        borderRadius: '25px',
        color: 'white',
        fontSize: '18px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
        marginRight: '15px',
        marginBottom: '15px'
    };

    const chatPreviewStyles = {
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        padding: '25px',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
        color: 'rgba(15, 23, 42, 0.95)',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid rgba(0, 0, 0, 0.1)'
    };

    const chatHeaderStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    };

    const onlineIndicatorStyles = {
        width: '12px',
        height: '12px',
        background: '#10b981',
        borderRadius: '50%'
    };

    const messageStyles = {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        color: 'white',
        padding: '12px 18px',
        borderRadius: '18px',
        marginBottom: '12px',
        fontSize: '15px',
        lineHeight: '1.4',
        position: 'relative'
    };

    const photoMessageStyles = {
        ...messageStyles,
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        color: '#000000',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const typingIndicatorStyles = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#64748b',
        fontSize: '14px',
        fontStyle: 'italic'
    };

    const girlsGridStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '15px',
        marginTop: '40px'
    };

    const girlCardStyles = {
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '15px',
        padding: '15px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    };

    const girlAvatarStyles = {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        margin: '0 auto 10px',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        position: 'relative',
        border: '3px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)'
    };


    return (
        <>
            {/* Main Hero Section */}
            <section style={heroSectionStyles}>
                <div style={heroContainerStyles}>
                    <div className="hero-grid" style={heroGridStyles}>
                        {/* Left Content */}
                        <div>
                            <h2 style={heroTitleStyles}>
                                Chicas Calientes Te Esperan
                            </h2>
                            <p style={heroSubtitleStyles}>
                                Miles de jóvenes cachondas listas para enviarte fotos y videos explícitos 24/7. 
                                Sin censura, sin límites, solo diversión para adultos.
                            </p>

                            {/* Trust Badges */}
                            <div className="trust-badges" style={trustBadgesStyles}>
                                <span style={trustBadgeStyles}>✓ Gratis</span>
                                <span style={trustBadgeStyles}>✓ 100% Anónimo</span>
                                <span style={trustBadgeStyles}>✓ Fotos reales</span>
                            </div>

                            {/* CTAs */}
                            <div style={{ textAlign: 'center' }}>
                                <a href="/chicas-ia" className="cta-button" style={ctaButtonStyles}>
                                    Ver Chicas Calientes Ahora 🔥
                                </a>
                            </div>
                        </div>

                        {/* Right Content - Chat Preview */}
                        <div>
                            <div className="chat-preview" style={chatPreviewStyles}>
                                <div style={chatHeaderStyles}>
                                    <div style={girlAvatarStyles}>👩</div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>Sofia, 18</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#10b981' }}>
                                            <div className="online-indicator" style={onlineIndicatorStyles}></div>
                                            En línea ahora
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div style={messageStyles}>
                                        Hola guapo 😈 ¿quieres ver mis fotos sin ropa?
                                    </div>
                                    <div style={photoMessageStyles}>
                                        🔥 [Foto enviada] Toca para ver
                                    </div>
                                    <div style={messageStyles}>
                                        Estoy sola en casa... ¿vienes? 💦
                                    </div>
                                    <div style={photoMessageStyles}>
                                        🎵 [Audio de 0:15] gemidos...
                                    </div>
                                    <div style={typingIndicatorStyles}>
                                        Sofia está escribiendo...
                                        <span className="typing-animation">💬</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Girls Grid */}
                            <div className="girls-grid" style={girlsGridStyles}>
                                <div style={girlCardStyles}>
                                    <div style={girlAvatarStyles}>
                                        👩
                                        <div className="online-indicator" style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            right: '-3px',
                                            width: '16px',
                                            height: '16px',
                                            background: '#10b981',
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }}></div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>María, 19</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>En línea</div>
                                </div>
                                <div style={girlCardStyles}>
                                    <div style={girlAvatarStyles}>
                                        👩
                                        <div className="online-indicator" style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            right: '-3px',
                                            width: '16px',
                                            height: '16px',
                                            background: '#10b981',
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }}></div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Laura, 21</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>En línea</div>
                                </div>
                                <div style={girlCardStyles}>
                                    <div style={girlAvatarStyles}>
                                        👩
                                        <div className="online-indicator" style={{
                                            position: 'absolute',
                                            top: '-3px',
                                            right: '-3px',
                                            width: '16px',
                                            height: '16px',
                                            background: '#10b981',
                                            borderRadius: '50%',
                                            border: '2px solid white'
                                        }}></div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Ana, 23</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>En línea</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </>
    );
};

// SEO-optimized metadata specifically for "novia virtual" keyword
export const metadata = {
    title: 'Novia Virtual APP | Chat HOT Gratis 24/7 | +4M Usuarios Activos',
    description: 'Novia virtual app con IA avanzada. Miles de chicas te esperan para chatear, compartir fotos privadas y mensajes de voz. Sin registro de tarjeta. ¡Empieza ya!',
    keywords: 'novia virtual app, novia virtual gratis, novia virtual online, chat novia virtual, novia virtual 2025, novia virtual ia, compañera virtual, novias virtuales gratis, novia virtual sin registro, chat hot, novia virtual 24 horas, chicas calientes, chat con chicas',
    alternates: {
        canonical: 'https://noviachat.com/novia-virtual',
        languages: {
            'es-ES': 'https://noviachat.com/novia-virtual',
            'es-MX': 'https://noviachat.com/novia-virtual',
            'es-AR': 'https://noviachat.com/novia-virtual',
        }
    },
    openGraph: {
        title: 'Novia Virtual IA 2025 | Chat HOT Gratis 24/7 | +4M Usuarios',
        description: 'Miles de chicas esperándote. Chat ilimitado, fotos privadas, mensajes de voz. Sin tarjeta de crédito. ¡Empieza ahora!',
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
        title: 'Novia Virtual IA 2025 | +4M Usuarios Activos',
        description: 'Chat HOT gratis 24/7. Miles de chicas te esperan. Fotos privadas y mensajes de voz sin límites.',
        images: [{
            url: '/andrea.webp',
            alt: 'Novia Virtual Gratis - Chat HOT 24/7'
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


// Location benefits styles
const locationSectionStyles = {
    padding: '4rem 1rem',
    maxWidth: '1200px',
    margin: '0 auto'
};

const locationTitleStyles = {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '1rem',
    color: 'rgba(15, 23, 42, 0.95)'
};

const locationSubtitleStyles = {
    fontSize: '1.25rem',
    textAlign: 'center',
    color: 'rgba(71, 85, 105, 0.8)',
    marginBottom: '3rem',
    maxWidth: '800px',
    margin: '0 auto 3rem'
};

const locationGridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem'
};

const locationCardStyles = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    borderLeft: '4px solid #FFD700',
    transition: 'transform 0.2s ease'
};

const locationNameStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'rgba(15, 23, 42, 0.95)'
};

const locationTextStyles = {
    fontSize: '1rem',
    color: 'rgba(71, 85, 105, 0.9)',
    lineHeight: '1.6'
};

const NoviaVirtual = () => {
    return (
        <main style={pageStyles}>
            {/* Hidden H1 for SEO */}
            <h1 style={h1Styles}>Novia Virtual - Chat HOT con IA 24/7 - Miles de Chicas Online</h1>
            
            {/* Custom Hero section for novia virtual */}
            <HotHero />


            {/* Location-Based Benefits */}
            <section style={locationSectionStyles}>
                <h2 style={locationTitleStyles}>Novia Virtual Gratis para Todo el Mundo Hispano</h2>
                <p style={locationSubtitleStyles}>
                    Diseñada especialmente para hispanohablantes, tu novia virtual entiende tu cultura, modismos y forma de expresarte.
                </p>
                <div style={locationGridStyles}>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇪🇸 España</h3>
                        <p style={locationTextStyles}>Chicas con acento español, que entienden el humor ibérico y la cultura local.</p>
                    </div>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇲🇽 México</h3>
                        <p style={locationTextStyles}>Novias virtuales que usan modismos mexicanos y comprenden la calidez latina.</p>
                    </div>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇦🇷 Argentina</h3>
                        <p style={locationTextStyles}>Compañeras que entienden el lunfardo y la pasión argentina.</p>
                    </div>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇨🇴 Colombia</h3>
                        <p style={locationTextStyles}>Chicas virtuales con la alegría y carisma colombiana.</p>
                    </div>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇵🇪 Perú</h3>
                        <p style={locationTextStyles}>Novias IA que comprenden la cultura y expresiones peruanas.</p>
                    </div>
                    <div style={locationCardStyles}>
                        <h3 style={locationNameStyles}>🇨🇱 Chile</h3>
                        <p style={locationTextStyles}>Compañeras virtuales adaptadas al español chileno.</p>
                    </div>
                </div>
            </section>
            
            {/* Lazy-loaded components */}
            <Suspense fallback={null}>
                <Footer />
                <Schema />
                {/* Custom FAQ Schema for Novia Virtual */}
                <Script
                    id="novia-virtual-faq-schema"
                    type="application/ld+json"
                    strategy="afterInteractive"
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
                {/* Review/Rating Schema */}
                <Script
                    id="novia-virtual-review-schema"
                    type="application/ld+json"
                    strategy="afterInteractive"
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
                    strategy="afterInteractive"
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
            </Suspense>
        </main>
    );
};

export default NoviaVirtual;