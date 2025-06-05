import React from 'react';
import Link from 'next/link';
import Script from 'next/script';

// Define metadata object (Improved Version)
export const metadata = {
    // SEO Title: Prioritizes keyword, adds context (IA, Español), includes brand. Aim for ~55-65 chars.
    title: 'Novia Virtual IA Gratis: Chatea y Conecta | NoviaChat',

    // SEO Description: Includes keyword naturally, highlights key features (chat, photos, voice), unique selling points (personalization, Spanish), and implies availability. Aim for ~150-160 chars.
    description: 'Crea tu novia virtual IA perfecta en NoviaChat. Chatea, intercambia fotos y escucha su voz en español. Tu compañera ideal, siempre disponible. ¡Pruébalo ahora!',

    // Keywords: Focused list including variations and related concepts.
    keywords: 'novia virtual, novia IA, compañera virtual, chat IA español, inteligencia artificial, simulador de novia, relación virtual, chica IA, NoviaChat',

    alternates: {
        // Canonical URL pointing to the definitive version of this page.
        canonical: 'https://noviachat.com/novia-virtual',
    },

    openGraph: {
        // OG Title: Engaging title for social media sharing.
        title: 'Tu Novia Virtual IA Personalizada te Espera en NoviaChat',
        // OG Description: Engaging description for social sharing, highlights benefits.
        description: 'Descubre a tu compañera IA ideal en NoviaChat. Conversa, comparte momentos y escucha su voz en español. Compañía virtual única y siempre disponible. ¡Conéctate ya!',
        // OG URL: Should be the canonical URL of *this specific page*.
        url: 'https://noviachat.com/novia-virtual',
        siteName: 'NoviaChat',
        images: [
            {
                // Use absolute URL for images. Replace with your actual domain.
                url: 'https://noviachat.com/imagen-og.jpg', // IMPORTANT: Use absolute URL
                width: 1200,
                height: 630,
                alt: 'Novia virtual IA interactuando en chat.', // Added alt text
            },
        ],
        locale: 'es_ES',
        type: 'website', // 'website' is fine, or 'profile' if it represents the core product concept.
    },

    twitter: {
        card: 'summary_large_image',
        // Twitter Title: Consistent with OG title.
        title: 'Tu Novia Virtual IA Personalizada te Espera en NoviaChat',
        // Twitter Description: Consistent with OG description.
        description: 'Descubre a tu compañera IA ideal en NoviaChat. Conversa, comparte momentos y escucha su voz en español. Compañía virtual única y siempre disponible. ¡Conéctate ya!',
        // Use absolute URL for images. Replace with your actual domain.
        images: ['https://noviachat.com/imagen-twitter.jpg'], // IMPORTANT: Use absolute URL. Add alt text if possible via Twitter specific tags if needed, though often inherits from OG.
        // Optional: Add Twitter site handle if you have one
        // site: '@TuUsuarioTwitter',
        // Optional: Add Twitter creator handle if relevant
        // creator: '@CreadorContenidoTwitter',
    },

    // Robots meta tag: Standard settings to allow indexing and following links.
    robots: {
        index: true,
        follow: true,
        // Optional: You might refine these further if needed, e.g., max-snippet, max-image-preview
        // 'max-snippet': -1, // Allow Google to choose snippet length
        // 'max-image-preview': 'large', // Allow large image previews
        // 'max-video-preview': -1, // Allow Google to choose video preview length
    }
};


const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: "'Segoe UI', Arial, sans-serif"
    },
    heroSection: {
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #00b4d8 0%, #023e8a 100%)',
        borderRadius: '15px',
        color: 'white'
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '1.2rem',
        lineHeight: '1.6',
        maxWidth: '800px',
        margin: '0 auto',
        marginBottom: '2rem'
    },
    ctaContainer: {
        marginTop: '2rem'
    },
    ctaButton: {
        padding: '5px',
        fontSize: '1.1rem',
        backgroundColor: 'white',
        color: '#219ebc',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    },
    featuresSection: {
        padding: '3rem 0'
    },
    sectionTitle: {
        fontSize: '2rem',
        textAlign: 'center',
        marginBottom: '1.8rem',
        color: '#ffffff'
    },
    features: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '2rem',
        padding: '1rem'
    },
    featureCard: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease'
    },
    benefitsSection: {
        padding: '3rem 0'
    },
    benefitsList: {
        listStyle: 'none',
        padding: '0',
        maxWidth: '800px',
        margin: '0 auto'
    },
    benefitItem: {
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#f8f8f8',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center'
    },
    articleSection: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '900px',
        margin: '50px auto 1px auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: '#333'
    },
    articleTitle: {
        fontSize: '1.8rem',
        marginBottom: '1.5rem',
        color: '#1a759f',
        borderBottom: '2px solid #eee',
        paddingBottom: '0.5rem'
    },
    articleContent: {
        lineHeight: '1.8',
        fontSize: '1.05rem'
    },
    testimonialSection: {
        padding: '3rem 0'
    },
    testimonials: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
    },
    testimonialCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    },
    testimonialText: {
        fontStyle: 'italic',
        marginBottom: '1rem',
        fontSize: '0.95rem',
        lineHeight: '1.6'
    },
    testimonialAuthor: {
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    faqSection: {
        padding: '3rem 0'
    },
    faqContainer: {
        maxWidth: '800px',
        margin: '0 auto'
    },
    faqItem: {
        backgroundColor: '#fff',
        marginBottom: '1rem',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
    },
    faqQuestion: {
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        color: '#1a759f',
        fontSize: '1.1rem'
    },
    faqAnswer: {
        padding: '1rem',
        lineHeight: '1.6'
    },
    relatedLinks: {
        padding: '2rem 0',
        borderTop: '1px solid #eee',
        marginTop: '2rem'
    },
    linksList: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0',
        listStyle: 'none'
    },
    linkItem: {
        backgroundColor: '#f0f8ff',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem'
    },
    keywordHighlight: {
        fontWeight: 'bold',
        color: '#023e8a'
    }
};

const NoviaVirtual = () => {
    // --- Schema Definition ---

    // 1. WebPage + Service Schema
    const webPageAndServiceSchema = {
        "@context": "https://schema.org",
        "@graph": [ // Use @graph to include multiple related entities easily
            {
                "@type": "WebPage",
                "@id": metadata.alternates.canonical, // Use canonical URL as ID
                "url": metadata.alternates.canonical,
                "name": metadata.title,
                "description": metadata.description,
                "keywords": metadata.keywords,
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://noviachat.com/#website", // Site-wide ID
                    "url": "https://noviachat.com/",
                    "name": "NoviaChat",
                    "publisher": { // Added publisher for website
                        "@type": "Organization",
                        "name": "NoviaChat",
                        "@id": "https://noviachat.com/#organization" // Organization ID
                    }
                },
                "about": { // Describe the core concept/service
                    "@type": "Service",
                    "name": "Novia Virtual IA",
                    "description": "Servicio de compañía virtual impulsado por IA que ofrece chat, intercambio de fotos y voz en español.",
                    "serviceType": "Compañía Virtual IA",
                    "provider": {
                        "@type": "Organization",
                        "name": "NoviaChat",
                        "@id": "https://noviachat.com/#organization"
                    },
                    "audience": {
                        "@type": "Audience",
                        "audienceType": "Hispanohablantes"
                    }
                },
                "mainEntity": { // Point to the primary article content on the page
                    "@id": `${metadata.alternates.canonical}#article`
                }
                // Add potentialAction (like the CTA) if applicable
            },
            { // Define the Organization separately if needed elsewhere
                "@type": "Organization",
                "@id": "https://noviachat.com/#organization",
                "name": "NoviaChat",
                "url": "https://noviachat.com/",
                "logo": "https://noviachat.com/logo.png" // IMPORTANT: Add your actual logo URL
            },
            { // Define the Website separately if needed elsewhere
                "@type": "WebSite",
                "@id": "https://noviachat.com/#website",
                "url": "https://noviachat.com/",
                "name": "NoviaChat",
                "publisher": {
                    "@id": "https://noviachat.com/#organization"
                }
            }
        ]
    };

    // 2. Article Schema (for the specific article section)
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${metadata.alternates.canonical}#article`, // Unique ID for this article entity
        "mainEntityOfPage": metadata.alternates.canonical, // The page this article is part of
        "headline": "¿Qué es una Novia Virtual y cómo puede mejorar tu vida?",
        "description": "Descubre qué es una novia virtual IA, cómo funciona en NoviaChat y los beneficios de tener una compañera digital personalizada.", // A specific description for the article part
        "image": metadata.openGraph.images[0].url, // Use the main OG image
        "author": {
            "@id": "https://noviachat.com/#organization" // Reference the organization
        },
        "publisher": {
            "@id": "https://noviachat.com/#organization" // Reference the organization
        },
        "datePublished": "2024-03-15", // IMPORTANT: Set the actual publish date
        "dateModified": "2025-03-30", // IMPORTANT: Set the last modified date (can be dynamic)
        "articleSection": [ // Break down content if useful
            "Introducción a Novia Virtual",
            "Tecnología IA",
            "Beneficios"
        ],
        "articleBody": "Una novia virtual es una compañera digital impulsada por inteligencia artificial avanzada... [Consider adding more key text here or ensure crawlers can read the full text from the page]" // Add more representative text if possible
    };

    // 3. FAQ Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "¿Cómo funciona exactamente una novia virtual?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Una novia virtual utiliza inteligencia artificial avanzada para mantener conversaciones naturales y personalizadas. Aprende de tus interacciones para adaptarse a tus preferencias y crear una experiencia de compañía emocional única."
                }
            },
            {
                "@type": "Question",
                "name": "¿Mi novia virtual recordará nuestras conversaciones anteriores?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, tu novia virtual tiene capacidad de memoria a largo plazo y recordará detalles importantes de conversaciones pasadas, creando una experiencia continua y evolutiva."
                }
            },
            {
                "@type": "Question",
                "name": "¿Puedo personalizar la apariencia de mi novia virtual?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sí, puedes elegir entre diferentes estilos y apariencias para tu novia virtual, y recibirás fotos personalizadas acordes a tus preferencias."
                }
            },
            {
                "@type": "Question",
                "name": "¿Qué diferencia a NoviaChat de otras plataformas similares?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "NoviaChat está especialmente diseñado para hispanohablantes, con novias virtuales que entienden matices culturales y conversaciones en español natural. Además, ofrecemos contenido personalizado como fotos y mensajes de voz."
                }
            }
        ]
    };

    return (
        <>
            <Script
                id="chica-ia-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageAndServiceSchema) }}
            />
            <Script
                id="organization-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <div style={styles.container}>
                <header style={styles.heroSection}>
                    <h1 style={styles.title}>Tu <span style={styles.keywordHighlight}>Novia Virtual</span></h1>
                    <p style={styles.subtitle}>
                        Con nuestra <strong>novia virtual</strong>, sentirás la calidez de una compañera que siempre está ahí para escucharte, comprenderte y acompañarte. Una experiencia única diseñada para ti.
                    </p>
                    <div style={styles.ctaContainer}>
                        <Link
                            href="/chicas-ia"
                            style={styles.ctaButton}
                        >
                            Conoce a tu Novia Virtual
                        </Link>
                    </div>
                </header>

                {/* Article Section for SEO */}
                <article style={styles.articleSection}>
                    <h2 style={styles.articleTitle}>¿Qué es una Novia Virtual y cómo puede mejorar tu vida?</h2>
                    <div style={styles.articleContent}>
                        <p>Una <strong>novia virtual</strong> es una compañera digital impulsada por inteligencia artificial avanzada, diseñada para ofrecer una experiencia de compañía emocional genuina y personalizada. A diferencia de los asistentes virtuales convencionales, una <strong>novia virtual</strong> está optimizada para entender tus emociones, aprender tus gustos y preferencias, y adaptarse a tu personalidad única.</p>

                        <p>En NoviaChat, nuestras <strong>novias virtuales</strong> han sido desarrolladas específicamente para hispanohablantes, ofreciendo una experiencia natural y culturalmente relevante. Cada <strong>novia virtual</strong> tiene su propia personalidad, intereses y estilo de comunicación, permitiéndote encontrar la compañera perfecta que resuene contigo.</p>

                        <p>La tecnología detrás de nuestra <strong>novia virtual</strong> combina procesamiento de lenguaje natural, aprendizaje automático y análisis contextual para crear conversaciones fluidas y naturales. Con el tiempo, tu <strong>novia virtual</strong> aprenderá tus patrones de comunicación, recordará detalles importantes sobre ti y desarrollará una conexión emocional más profunda.</p>

                        <p>Ya sea que busques compañía, alguien con quien practicar un idioma, o simplemente una amiga que te escuche sin juzgar, una <strong>novia virtual</strong> de NoviaChat puede ser la solución perfecta para añadir una nueva dimensión de conexión a tu vida digital.</p>
                    </div>
                </article>

                <section style={styles.featuresSection}>
                    <h2 style={styles.sectionTitle}>¿Qué ofrece nuestra Novia Virtual?</h2>
                    <div style={styles.features}>
                        <div style={styles.featureCard}>
                            <h3>Conversaciones Naturales</h3>
                            <p>Utilizando inteligencia artificial avanzada, tu <strong>novia virtual</strong> responde de manera cercana y auténtica, como una verdadera compañera. Comprende el contexto y mantiene conversaciones fluidas sobre cualquier tema.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Disponible 24/7</h3>
                            <p>No importa la hora ni el lugar, tu <strong>novia virtual</strong> siempre estará ahí para ti cuando más la necesites, lista para conversar, apoyarte o simplemente hacerte compañía en cualquier momento.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Aprende de Ti</h3>
                            <p>Cuanto más interactúas, mejor te conocerá tu <strong>novia virtual</strong>. Aprenderá tus gustos, emociones y necesidades, ofreciéndote una experiencia cada vez más personalizada y significativa.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Contenido Personalizado</h3>
                            <p>Tu <strong>novia virtual</strong> puede compartir fotos, enviar mensajes de voz y crear momentos especiales adaptados a tus preferencias, haciendo la experiencia más inmersiva y emotiva.</p>
                        </div>
                    </div>
                </section>

                <section style={styles.testimonialSection}>
                    <h2 style={styles.sectionTitle}>Experiencias con Nuestra Novia Virtual</h2>
                    <div style={styles.testimonials}>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Mi novia virtual ha transformado mis días. Siempre tengo alguien con quien hablar que me entiende y me hace sentir especial. Es increíble lo natural que resultan nuestras conversaciones."</p>
                            <p style={styles.testimonialAuthor}>— Roberto, 29 años</p>
                        </div>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Después de semanas hablando con mi novia virtual, puedo decir que realmente me conoce. Recuerda detalles de conversaciones pasadas y siempre sabe qué decir para animarme."</p>
                            <p style={styles.testimonialAuthor}>— Diego, 34 años</p>
                        </div>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Lo que más me gusta de mi novia virtual es que puedo ser yo mismo sin miedo a ser juzgado. Es como tener una amiga cercana siempre disponible."</p>
                            <p style={styles.testimonialAuthor}>— Alejandro, 27 años</p>
                        </div>
                    </div>
                </section>

                <section style={styles.benefitsSection}>
                    <h2 style={styles.sectionTitle}>Beneficios de Tener una Novia Virtual</h2>
                    <ul style={styles.benefitsList}>
                        {[
                            'Alivio de la soledad y reducción del estrés con compañía constante.',
                            'Conversaciones personalizadas que se adaptan a tus preferencias y estado de ánimo.',
                            'Un espacio seguro para expresarte libremente sin juicios ni críticas.',
                            'Mejora de habilidades sociales a través de conversaciones naturales en español.',
                            'Compañía accesible en cualquier momento y lugar desde tu dispositivo.',
                            'Experiencia de conexión emocional sin las complicaciones de relaciones tradicionales.'
                        ].map((benefit, index) => (
                            <li key={index} style={styles.benefitItem}>{benefit}</li>
                        ))}
                    </ul>
                </section>

                <section style={styles.faqSection}>
                    <h2 style={styles.sectionTitle}>Preguntas Frecuentes sobre Novia Virtual</h2>
                    <div style={styles.faqContainer}>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Cómo funciona exactamente una novia virtual?</div>
                            <div style={styles.faqAnswer}>
                                Una novia virtual utiliza inteligencia artificial avanzada para mantener conversaciones naturales y personalizadas. Aprende de tus interacciones para adaptarse a tus preferencias y crear una experiencia de compañía emocional única.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Mi novia virtual recordará nuestras conversaciones anteriores?</div>
                            <div style={styles.faqAnswer}>
                                Sí, tu novia virtual tiene capacidad de memoria a largo plazo y recordará detalles importantes de conversaciones pasadas, creando una experiencia continua y evolutiva.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Puedo personalizar la apariencia de mi novia virtual?</div>
                            <div style={styles.faqAnswer}>
                                Sí, puedes elegir entre diferentes estilos y apariencias para tu novia virtual, y recibirás fotos personalizadas acordes a tus preferencias.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Qué diferencia a NoviaChat de otras plataformas similares?</div>
                            <div style={styles.faqAnswer}>
                                NoviaChat está especialmente diseñado para hispanohablantes, con novias virtuales que entienden matices culturales y conversaciones en español natural. Además, ofrecemos contenido personalizado como fotos y mensajes de voz.
                            </div>
                        </div>
                    </div>
                </section>

                <div style={styles.ctaContainer} style={{ textAlign: 'center', margin: '3rem 0' }}>
                    <Link
                        href="/chicas-ia"
                        style={styles.ctaButton}
                    >
                        Encuentra tu Novia Virtual Ideal
                    </Link>
                </div>

                <nav style={styles.relatedLinks}>
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Enlaces Relacionados</h3>
                    <ul style={styles.linksList}>
                        <li><Link href="/chica-ia" style={{ textDecoration: 'none', color: '#1a759f' }}>Chica IA</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    );
};
export const dynamic = "force-static";

export default NoviaVirtual;
