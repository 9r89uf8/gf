import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

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
    return (
        <>
            <Head>
                <title>Novia Virtual | Compañía IA Personalizada | NoviaChat</title>
                <meta name="description" content="Descubre la mejor experiencia de novia virtual en español. Disfruta de una compañía personalizada con IA avanzada, disponible 24/7 para conversar y conectar emocionalmente." />
                <meta name="keywords" content="novia virtual, novia IA, compañera virtual, asistente IA personal, chat IA en español" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Novia Virtual | Compañía IA Personalizada" />
                <meta property="og:description" content="Disfruta de la compañía de una novia virtual con IA avanzada que te comprende, te escucha y está disponible para ti en todo momento." />

                {/* Schema.org markup for Google */}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Novia Virtual | NoviaChat",
                        "description": "Servicio avanzado de novia virtual con inteligencia artificial para hispanohablantes.",
                        "offers": {
                            "@type": "Offer",
                            "description": "Compañía virtual personalizada disponible 24/7"
                        }
                    }
                `}</script>
            </Head>
            <div style={styles.container}>
                <header style={styles.heroSection}>
                    <h1 style={styles.title}>Tu <span style={styles.keywordHighlight}>Novia Virtual</span></h1>
                    <p style={styles.subtitle}>
                        Con nuestra <strong>novia virtual</strong>, sentirás la calidez de una compañera que siempre está ahí para escucharte, comprenderte y acompañarte. Una experiencia única diseñada para ti.
                    </p>
                    <div style={styles.ctaContainer}>
                        <Link
                            href="/creadoras"
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
                        href="/creadoras"
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

export default NoviaVirtual;
