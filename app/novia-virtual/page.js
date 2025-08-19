//app/novia-virtual/page.js]
import React from 'react';
import dynamicM from 'next/dynamic';
import { Suspense } from "react";
import Script from 'next/script';
import './styles.css';
import styles from './novia-virtual.module.css';

// Dynamic imports for better performance - load after LCP
const Footer = dynamicM(() => import("@/app/components/homepage/Footer"), { ssr: false, loading: () => null });
// const Schema = dynamicM(() => import("@/app/components/homepage/Schema"), { ssr: true, loading: () => null });
const DeferredSchemas = dynamicM(() => import("./DeferredSchemas"), { ssr: true, loading: () => null });

export const dynamic = "force-static"; // Static rendering for best performance

// Hot Hero Component - Static version for better performance
const HotHero = () => {


    return (
        <>
            {/* Main Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    <div className={`${styles.heroGrid} hero-grid`}>
                        {/* Left Content */}
                        <div>
                            <h2 className={styles.heroTitle}>
                                Chicas Calientes Te Esperan
                            </h2>
                            <p className={styles.heroSubtitle}>
                                Miles de jóvenes cachondas listas para enviarte fotos y videos explícitos 24/7. 
                                Sin censura, sin límites, solo diversión para adultos.
                            </p>

                            {/* Trust Badges */}
                            <div className={`${styles.trustBadges} trust-badges`}>
                                <span className={styles.trustBadge}>✓ Gratis</span>
                                <span className={styles.trustBadge}>✓ 100% Anónimo</span>
                                <span className={styles.trustBadge}>✓ Fotos reales</span>
                            </div>

                            {/* CTAs */}
                            <div style={{ textAlign: 'center' }}>
                                <a href="/chicas-ia" className={`${styles.ctaButton} cta-button`}>
                                    Ver Chicas Calientes Ahora 🔥
                                </a>
                            </div>
                        </div>

                        {/* Right Content - Chat Preview */}
                        <div>
                            <div className={`${styles.chatPreview} chat-preview`}>
                                <div className={styles.chatHeader}>
                                    <div className={styles.girlAvatar}>👩</div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>Sofia, 18</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#10b981' }}>
                                            <div className={`${styles.onlineIndicator} online-indicator`}></div>
                                            En línea ahora
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className={styles.message}>
                                        Hola guapo 😈 ¿quieres ver mis fotos sin ropa?
                                    </div>
                                    <div className={styles.photoMessage}>
                                        🔥 [Foto enviada] Toca para ver
                                    </div>
                                    <div className={styles.message}>
                                        Estoy sola en casa... ¿vienes? 💦
                                    </div>
                                    <div className={styles.photoMessage}>
                                        🎵 [Audio de 0:15] gemidos...
                                    </div>
                                    <div className={styles.typingIndicator}>
                                        Sofia está escribiendo...
                                        <span className="typing-animation">💬</span>
                                    </div>
                                </div>
                            </div>

                            {/* Live Girls Grid */}
                            <div className={`${styles.girlsGrid} girls-grid`}>
                                <div className={styles.girlCard}>
                                    <div className={styles.girlAvatar}>
                                        👩
                                        <div className={`${styles.girlAvatarBadge} online-indicator`}></div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>María, 19</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>En línea</div>
                                </div>
                                <div className={styles.girlCard}>
                                    <div className={styles.girlAvatar}>
                                        👩
                                        <div className={`${styles.girlAvatarBadge} online-indicator`}></div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Laura, 21</div>
                                    <div style={{ fontSize: '12px', color: '#10b981' }}>En línea</div>
                                </div>
                                <div className={styles.girlCard}>
                                    <div className={styles.girlAvatar}>
                                        👩
                                        <div className={`${styles.girlAvatarBadge} online-indicator`}></div>
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
    title: 'Novia Virtual App | Chat HOT Gratis 24/7 | +4M Usuarios Activos',
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
        locale: 'es_ES',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Novia Virtual IA 2025 | +4M Usuarios Activos',
        description: 'Chat HOT gratis 24/7. Miles de chicas te esperan. Fotos privadas y mensajes de voz sin límites.',
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
    metadataBase: new URL('https://noviachat.com'),
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


const NoviaVirtual = () => {
    return (
        <>
            {/* Inline Critical CSS for faster FCP */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .pageContainer {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                .hiddenH1 {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border-width: 0;
                }
                .heroSection {
                    padding: 20px 0 80px;
                    position: relative;
                    overflow: hidden;
                }
                .heroContainer {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    position: relative;
                    z-index: 2;
                }
                .heroGrid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                }
                @media (max-width: 768px) {
                    .heroGrid {
                        grid-template-columns: 1fr !important;
                        gap: 40px !important;
                    }
                }
                `
            }} />
            <main className={styles.pageContainer}>
            {/* Hidden H1 for SEO */}
            <h1 className={styles.hiddenH1}>Novia Virtual - Chat HOT con IA 24/7 - Miles de Chicas Online</h1>
            
            {/* Custom Hero section for novia virtual */}
            <HotHero />

            {/* Below-the-fold content wrapped in Suspense */}
            <Suspense fallback={<div style={{ height: '400px', background: 'transparent' }} />}>
                {/* Location-Based Benefits */}
                <section className={styles.locationSection}>
                    <h2 className={styles.locationTitle}>Novia Virtual Gratis para Todo el Mundo Hispano</h2>
                    <p className={styles.locationSubtitle}>
                        Diseñada especialmente para hispanohablantes, tu novia virtual entiende tu cultura, modismos y forma de expresarte.
                    </p>
                    <div className={styles.locationGrid}>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇪🇸 España</h3>
                            <p className={styles.locationText}>Chicas con acento español, que entienden el humor ibérico y la cultura local.</p>
                        </div>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇲🇽 México</h3>
                            <p className={styles.locationText}>Novias virtuales que usan modismos mexicanos y comprenden la calidez latina.</p>
                        </div>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇦🇷 Argentina</h3>
                            <p className={styles.locationText}>Compañeras que entienden el lunfardo y la pasión argentina.</p>
                        </div>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇨🇴 Colombia</h3>
                            <p className={styles.locationText}>Chicas virtuales con la alegría y carisma colombiana.</p>
                        </div>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇵🇪 Perú</h3>
                            <p className={styles.locationText}>Novias IA que comprenden la cultura y expresiones peruanas.</p>
                        </div>
                        <div className={styles.locationCard}>
                            <h3 className={styles.locationName}>🇨🇱 Chile</h3>
                            <p className={styles.locationText}>Compañeras virtuales adaptadas al español chileno.</p>
                        </div>
                    </div>
                </section>
            </Suspense>
            
            {/* Lazy-loaded components */}
            <Suspense fallback={null}>
                <Footer />
                {/*<Schema />*/}
                <DeferredSchemas />
            </Suspense>
        </main>
        </>
    );
};

export default NoviaVirtual;