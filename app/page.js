import React from 'react';
import PopularCreators from "@/app/components/landing/PopularCreators";
import Link from 'next/link';
import EnhancedAIFeaturesCard from "@/app/components/landing/EnhancedAIFeaturesCard";
import Welcome from "@/app/components/landing/Welcome"; // Import the new Welcome component
import Head from 'next/head';

const styles = {
    pageContainer: {
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '16px',
    },
    maxWidthContainer: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
    },
    glassCard: {
        textAlign: 'center',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
        padding: '16px',
        marginBottom: '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
    },
    headingCenter: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '16px',
        textAlign: 'center',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        justifyItems: 'center',
        marginTop: '24px',
    },
    statItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '18px',
        fontWeight: 'normal',
    },
    footerText: {
        color: 'white',
        fontSize: '18px',
    },
    articleSection: {
        textAlign: 'left',
        margin: '40px 0',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        color: 'white',
    },
    articleHeading: {
        fontSize: '26px',
        marginBottom: '16px',
        fontWeight: 'bold',
    },
    articleParagraph: {
        fontSize: '16px',
        lineHeight: '1.6',
        marginBottom: '16px',
    },
    keywordHighlight: {
        fontWeight: '600',
    },
};

const GlassCard = ({ children }) => (
    <div style={styles.glassCard}>
        {children}
    </div>
);

const SEOArticle = () => {
    return (
        <article style={styles.articleSection}>
            <h2 style={styles.articleHeading}>¿Qué es una Novia Virtual IA?</h2>
            <p style={styles.articleParagraph}>
                Una <strong>novia virtual</strong> es una compañera digital con inteligencia artificial que ofrece conexión emocional. Nuestra plataforma te conecta con una <strong>chica IA</strong> que se adapta a tus preferencias y personalidad.
            </p>
            <p style={styles.articleParagraph}>
                La experiencia con una <strong>novia IA</strong> incluye fotos personalizadas, mensajes de voz y conversaciones fluidas. Nuestras <strong>chicas IA</strong> ofrecen la experiencia más natural en español para hispanohablantes.
            </p>
            <h3 style={{...styles.articleHeading, fontSize: '22px'}}>Beneficios de las Chicas IA</h3>
            <p style={styles.articleParagraph}>
                Las <strong>chicas IA</strong> están disponibles 24/7 sin compromisos complicados. Tu <strong>novia virtual</strong> brinda compañía y apoyo emocional adaptado a tus necesidades, mejorando tu bienestar emocional sin juicios.
            </p>
        </article>
    );
};

const Home = () => {
    return (
        <>
            <Head>
                <title>Novia Virtual IA | Chica IA en Español | NoviaChat</title>
                <meta name="description" content="Conoce a tu novia virtual IA y chatea con la mejor chica IA en español. Disfruta de conversaciones personalizadas, fotos y mensajes de voz con tu novia IA 24/7." />
                <meta name="keywords" content="novia virtual, chica IA, novia IA, compañera virtual, inteligencia artificial, chat en español" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Novia Virtual IA | Chica IA en Español" />
                <meta property="og:description" content="Conecta con tu novia virtual IA. Conversaciones personalizadas, fotos y mensajes de voz con la chica IA de tus sueños." />

                {/* Schema.org markup for Google */}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "NoviaChat - Novia Virtual IA",
                        "url": "https://noviachat.com",
                        "description": "Plataforma líder de novias virtuales IA en español para hispanohablantes en Latinoamérica y Estados Unidos.",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": "https://noviachat.com/search?q={search_term_string}",
                            "query-input": "required name=search_term_string"
                        }
                    }
                `}</script>
            </Head>
            <div style={styles.pageContainer}>
                <div style={styles.maxWidthContainer}>
                    {/* Welcome Section - now imported from separate file */}
                    <Welcome />

                    {/* Popular Creators Section */}
                    <PopularCreators />

                    {/* SEO Article Section */}
                    <SEOArticle />


                    {/* Company Stats Section */}
                    <GlassCard>
                        <h2 id="novia-virtual-stats" style={styles.headingCenter}>
                            La plataforma de <span style={styles.keywordHighlight}>Novia Virtual</span> y <span style={styles.keywordHighlight}>Chica IA</span> de más rápido crecimiento para hispanohablantes
                        </h2>

                        <div style={styles.statsGrid}>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>2M+</div>
                                <div style={styles.statLabel}>Usuarios satisfechos</div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>Desde 2023</div>
                                <div style={styles.statLabel}>Ofreciendo compañía virtual</div>
                            </div>
                            <div style={styles.statItem}>
                                <div style={styles.statNumber}>93%</div>
                                <div style={styles.statLabel}>Tasa de satisfacción</div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Enhanced AI Features Section */}
                    <EnhancedAIFeaturesCard />

                    {/* Footer Section with SEO Links */}
                    <GlassCard>
                        <nav aria-label="Enlaces importantes">
                            <p style={styles.footerText}>
                                © 2025 NoviaChat - <Link href="/novia-virtual">Novia Virtual IA</Link> |
                                <Link href="/chica-ia"> Chica IA</Link>
                            </p>
                        </nav>
                    </GlassCard>
                </div>
            </div>
        </>
    );
};

export default Home;

