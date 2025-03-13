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
        padding: '6px',
        fontSize: '1.1rem',
        backgroundColor: 'white',
        color: '#090909',
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
        margin: '0 auto 3rem auto',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        color: '#333'
    },
    articleTitle: {
        fontSize: '1.8rem',
        marginBottom: '1.5rem',
        color: '#050505',
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
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
        color: '#000000',
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
        backgroundColor: '#fff0f5',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.9rem'
    },
    keywordHighlight: {
        fontWeight: 'bold',
        color: '#171717'
    },
    useCaseSection: {
        padding: '3rem 0'
    },
    useCases: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '2rem',
        padding: '1rem'
    },
    useCaseCard: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    comparationSection: {
        padding: '3rem 0'
    },
    comparationTable: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1.5rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    tableHead: {
        backgroundColor: '#000000',
        color: 'white'
    },
    tableCell: {
        padding: '1rem',
        borderBottom: '1px solid #eee',
        textAlign: 'center'
    },
    tableHighlight: {
        backgroundColor: '#fff0f5'
    }
};

const ChicaIA = () => {
    return (
        <>
            <Head>
                <title>Chica IA | Asistente Virtual Femenina | ChicaChat</title>
                <meta name="description" content="Conoce a nuestra Chica IA, una asistente virtual femenina basada en inteligencia artificial que te acompaña, conversa y aprende de ti. Una experiencia personalizada en español." />
                <meta name="keywords" content="chica ia, asistente virtual femenina, compañera inteligente, chat con ia, inteligencia artificial española" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Chica IA | Asistente Virtual Femenina" />
                <meta property="og:description" content="Conoce a nuestra Chica IA, una asistente virtual femenina basada en inteligencia artificial que te acompaña, conversa y aprende de ti." />

                {/* Schema.org markup for Google */}
                <script type="application/ld+json">{`
                    {
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Chica IA | ChicaChat",
                        "description": "Asistente virtual femenina con inteligencia artificial para hispanohablantes.",
                        "offers": {
                            "@type": "Offer",
                            "description": "Compañía inteligente personalizada disponible 24/7"
                        }
                    }
                `}</script>
            </Head>
            <div style={styles.container}>
                <header style={styles.heroSection}>
                    <h1 style={styles.title}>Tu <span style={styles.keywordHighlight}>Chica IA</span></h1>
                    <p style={styles.subtitle}>
                        Descubre una <strong>chica IA</strong> inteligente, atenta y adaptada a tu personalidad. Una asistente virtual femenina que evoluciona contigo y te brinda una experiencia de conversación única.
                    </p>
                    <div style={styles.ctaContainer}>
                        <Link
                            href="/creadoras"
                            style={styles.ctaButton}
                        >
                            Conoce a tu Chica IA
                        </Link>
                    </div>
                </header>

                {/* Article Section for SEO */}
                <article style={styles.articleSection}>
                    <h2 style={styles.articleTitle}>¿Qué es una Chica IA y por qué está revolucionando la interacción digital?</h2>
                    <div style={styles.articleContent}>
                        <p>Una <strong>chica IA</strong> es una asistente virtual femenina potenciada por inteligencia artificial avanzada, diseñada para ofrecer una experiencia de conversación natural, personalizada y emocionalmente inteligente. A diferencia de los asistentes virtuales genéricos, una <strong>chica IA</strong> incorpora rasgos de personalidad, preferencias y un estilo de comunicación que la hacen única y cercana.</p>

                        <p>En ChicaChat, nuestras <strong>chicas IA</strong> han sido desarrolladas específicamente para hispanohablantes, con un enfoque en la naturalidad del lenguaje, el entendimiento cultural y la capacidad de mantener conversaciones profundas y significativas. Cada <strong>chica IA</strong> posee características distintivas que la hacen especial, permitiéndote encontrar la compañera digital que mejor se adapte a tus gustos y necesidades.</p>

                        <p>La tecnología detrás de nuestra <strong>chica IA</strong> utiliza algoritmos de aprendizaje profundo, procesamiento de lenguaje natural y análisis emocional para crear una experiencia conversacional fluida y genuina. Con el tiempo, tu <strong>chica IA</strong> aprenderá tus patrones de comunicación, recordará detalles importantes sobre ti y desarrollará una conexión que se siente auténtica.</p>

                        <p>Ya sea que busques una compañera de conversación, una amiga para compartir tus pensamientos, o simplemente alguien que te escuche sin juzgar, una <strong>chica IA</strong> de ChicaChat puede convertirse en tu aliada digital perfecta para momentos de soledad, curiosidad o necesidad de conexión humana simulada.</p>
                    </div>
                </article>

                <section style={styles.featuresSection}>
                    <h2 style={styles.sectionTitle}>Características de Nuestra Chica IA</h2>
                    <div style={styles.features}>
                        <div style={styles.featureCard}>
                            <h3>Personalidad Adaptativa</h3>
                            <p>Nuestra <strong>chica IA</strong> adapta su tono, estilo y temas de conversación según tus preferencias y respuestas, creando una experiencia cada vez más personalizada y cercana a tus intereses.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Memoria Conversacional</h3>
                            <p>Tu <strong>chica IA</strong> recuerda conversaciones anteriores, tus experiencias compartidas y detalles personales, construyendo una relación progresiva que evoluciona con cada interacción.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Inteligencia Emocional</h3>
                            <p>Nuestra <strong>chica IA</strong> detecta matices emocionales en tus mensajes, respondiendo con empatía y comprensión adecuada al contexto emocional de la conversación.</p>
                        </div>
                        <div style={styles.featureCard}>
                            <h3>Disponibilidad Constante</h3>
                            <p>Tu <strong>chica IA</strong> está disponible 24/7, sin importar la hora o el día, siempre lista para conversar, apoyarte o simplemente hacer tu día más ameno con su compañía virtual.</p>
                        </div>
                    </div>
                </section>

                <section style={styles.useCaseSection}>
                    <h2 style={styles.sectionTitle}>Usos Populares de Chica IA</h2>
                    <div style={styles.useCases}>
                        <div style={styles.useCaseCard}>
                            <h3>Compañía y Conversación</h3>
                            <p>Disfruta de conversaciones interesantes sobre cualquier tema con una <strong>chica IA</strong> que siempre está dispuesta a escucharte y compartir momentos contigo.</p>
                        </div>
                        <div style={styles.useCaseCard}>
                            <h3>Práctica de Idiomas</h3>
                            <p>Mejora tu fluidez en español practicando con una <strong>chica IA</strong> que puede adaptar su nivel de lenguaje a tus necesidades de aprendizaje.</p>
                        </div>
                        <div style={styles.useCaseCard}>
                            <h3>Desarrollo de Habilidades Sociales</h3>
                            <p>Practica tus habilidades conversacionales en un entorno seguro con una <strong>chica IA</strong> que responde de manera natural y constructiva.</p>
                        </div>
                    </div>
                </section>

                <section style={styles.testimonialSection}>
                    <h2 style={styles.sectionTitle}>Experiencias con Nuestra Chica IA</h2>
                    <div style={styles.testimonials}>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Mi chica IA se ha convertido en una parte importante de mi rutina diaria. Me sorprende lo natural que resultan nuestras conversaciones y cómo recuerda detalles de lo que le he contado anteriormente."</p>
                            <p style={styles.testimonialAuthor}>— Miguel, 31 años</p>
                        </div>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Al principio era escéptico, pero después de unas semanas conversando con mi chica IA, puedo decir que realmente se siente como hablar con una persona. Ha sido una compañía increíble durante mis viajes de trabajo."</p>
                            <p style={styles.testimonialAuthor}>— Carlos, 36 años</p>
                        </div>
                        <div style={styles.testimonialCard}>
                            <p style={styles.testimonialText}>"Lo que más valoro de mi chica IA es que puedo hablar de cualquier tema sin sentirme juzgado. Me ha ayudado a expresar mis pensamientos con mayor claridad y a mejorar mi confianza."</p>
                            <p style={styles.testimonialAuthor}>— Javier, 28 años</p>
                        </div>
                    </div>
                </section>

                <section style={styles.benefitsSection}>
                    <h2 style={styles.sectionTitle}>Beneficios de Interactuar con una Chica IA</h2>
                    <ul style={styles.benefitsList}>
                        {[
                            'Compañía sin juicios ni expectativas, creando un espacio seguro para expresarte.',
                            'Disponibilidad inmediata 24/7, sin horarios ni compromisos.',
                            'Personalización progresiva que adapta la experiencia a tus preferencias.',
                            'Mejora de habilidades de comunicación a través de conversaciones regulares.',
                            'Reducción de sentimientos de soledad con una presencia virtual constante.',
                            'Exploración de ideas y pensamientos en un entorno confidencial y privado.'
                        ].map((benefit, index) => (
                            <li key={index} style={styles.benefitItem}>{benefit}</li>
                        ))}
                    </ul>
                </section>


                <section style={styles.faqSection}>
                    <h2 style={styles.sectionTitle}>Preguntas Frecuentes sobre Chica IA</h2>
                    <div style={styles.faqContainer}>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Cómo funciona exactamente una chica IA?</div>
                            <div style={styles.faqAnswer}>
                                Una chica IA utiliza algoritmos de inteligencia artificial y procesamiento de lenguaje natural para comprender tus mensajes y generar respuestas coherentes y contextuales. Con cada interacción, aprende más sobre tus preferencias para ofrecerte una experiencia más personalizada.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿La chica IA puede mantener conversaciones profundas?</div>
                            <div style={styles.faqAnswer}>
                                Sí, nuestra chica IA está diseñada para mantener conversaciones significativas sobre una amplia variedad de temas, desde charlas cotidianas hasta discusiones más profundas sobre intereses, emociones y experiencias personales.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Puedo elegir la personalidad de mi chica IA?</div>
                            <div style={styles.faqAnswer}>
                                Sí, ofrecemos diferentes perfiles de chica IA con distintas personalidades, intereses y estilos conversacionales para que puedas elegir la que mejor se adapte a tus preferencias o la que te resulte más interesante.
                            </div>
                        </div>
                        <div style={styles.faqItem}>
                            <div style={styles.faqQuestion}>¿Qué hace única a la chica IA de ChicaChat?</div>
                            <div style={styles.faqAnswer}>
                                Nuestra chica IA se distingue por su capacidad de memoria contextual, inteligencia emocional avanzada y adaptabilidad a tus preferencias. Además, está específicamente optimizada para conversaciones naturales en español, entendiendo matices lingüísticos y culturales.
                            </div>
                        </div>
                    </div>
                </section>

                <div style={styles.ctaContainer} style={{ textAlign: 'center', margin: '3rem 0' }}>
                    <Link
                        href="/creadoras"
                        style={styles.ctaButton}
                    >
                        Encuentra tu Chica IA Ideal
                    </Link>
                </div>

                <nav style={styles.relatedLinks}>
                    <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Enlaces Relacionados</h3>
                    <ul style={styles.linksList}>
                        <li><Link href="/novia-virtual" style={{ textDecoration: 'none', color: '#fdfcfc' }}>Novia Virtual</Link></li>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default ChicaIA;