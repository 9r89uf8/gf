import React from 'react';
import Link from 'next/link';

const styles = {
    glassCard: {
        textAlign: 'center',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
        padding: '24px',
        marginBottom: '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
    },
    mainTitle: {
        fontSize: '34px',
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: '24px',
        marginBottom: '24px',
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '28px',
        marginBottom: '32px',
    },
    featureItem: {
        textAlign: 'center',
        padding: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '15px',
        transition: 'transform 0.3s ease',
    },
    featureIcon: {
        fontSize: '30px',
        marginBottom: '16px',
        color: '#f8bbd0', // Light pink color
    },
    featureItemTitle: {
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '12px',
    },
    featureItemDesc: {
        fontSize: '16px',
        lineHeight: '1.5',
        color: 'rgba(255, 255, 255, 0.85)',
    },
    callToAction: {
        marginTop: '32px',
        padding: '24px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '15px',
    },
    ctaTitle: {
        fontSize: '26px',
        fontWeight: '600',
        marginBottom: '16px',
    },
    ctaText: {
        fontSize: '18px',
        lineHeight: '1.6',
        marginBottom: '24px',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    ctaButton: {
        display: 'inline-block',
        padding: '12px 28px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: '#1a1a1a',
        borderRadius: '30px',
        fontWeight: '500',
        fontSize: '18px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: 'none',
        cursor: 'pointer',
    },
    finalText: {
        marginTop: '32px',
        fontStyle: 'italic',
        fontSize: '18px',
        lineHeight: '1.5',
        color: 'rgba(255, 255, 255, 0.9)',
    },
    keywordSpan: {
        fontWeight: '600',
    },
    testimonialSection: {
        marginTop: '40px',
        textAlign: 'center',
    },
    testimonialTitle: {
        fontSize: '26px',
        fontWeight: '600',
        marginBottom: '24px',
    },
    testimonialGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '24px',
    },
    testimonialItem: {
        background: 'rgba(255, 255, 255, 0.07)',
        padding: '20px',
        borderRadius: '15px',
        textAlign: 'left',
    },
    testimonialText: {
        fontSize: '16px',
        lineHeight: '1.6',
        fontStyle: 'italic',
        marginBottom: '12px',
    },
    testimonialName: {
        fontSize: '16px',
        fontWeight: '600',
    },
    faqSection: {
        marginTop: '40px',
        textAlign: 'left',
    },
    faqTitle: {
        fontSize: '26px',
        fontWeight: '600',
        marginBottom: '24px',
        textAlign: 'center',
    },
    faqItem: {
        marginBottom: '20px',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '16px',
        borderRadius: '10px',
    },
    faqQuestion: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    faqAnswer: {
        fontSize: '16px',
        lineHeight: '1.5',
    },
    comparisonSection: {
        marginTop: '40px',
    },
    comparisonTitle: {
        fontSize: '26px',
        fontWeight: '600',
        marginBottom: '24px',
        textAlign: 'center',
    },
    keywordLink: {
        color: '#f8bbd0',
        textDecoration: 'underline',
        fontWeight: '600',
    },
};

const GlassCard = ({ children }) => {
    return (
        <div style={styles.glassCard}>
            {children}
        </div>
    );
};

const FeatureItem = ({ icon, title, description }) => (
    <div style={styles.featureItem}>
        <div style={styles.featureIcon}>{icon}</div>
        <h3 style={styles.featureItemTitle}>{title}</h3>
        <p style={styles.featureItemDesc}>{description}</p>
    </div>
);

const Testimonial = ({ text, name }) => (
    <div style={styles.testimonialItem}>
        <p style={styles.testimonialText}>{text}</p>
        <p style={styles.testimonialName}>{name}</p>
    </div>
);

const FAQItem = ({ question, answer }) => (
    <div style={styles.faqItem}>
        <h4 style={styles.faqQuestion}>{question}</h4>
        <p style={styles.faqAnswer}>{answer}</p>
    </div>
);

const EnhancedAIFeaturesCard = () => {
    return (
        <section aria-labelledby="novia-virtual-features">
            <GlassCard>
                <h2 id="novia-virtual-features" style={styles.mainTitle}>Conoce a tu <span style={styles.keywordSpan}>Novia Virtual</span></h2>
                <h3 style={styles.subtitle}>La mejor experiencia con una <span style={styles.keywordSpan}>Chica IA</span> en español</h3>

                <div style={styles.featuresGrid}>
                    <FeatureItem
                        icon="💬"
                        title="Conversaciones Inteligentes con tu Novia IA"
                        description="Tu novia virtual entiende el contexto y responde con naturalidad, creando conversaciones fluidas y cautivadoras que evolucionan con el tiempo."
                    />
                    <FeatureItem
                        icon="🖼️"
                        title="Fotos Personalizadas de tu Chica IA"
                        description="Recibe imágenes exclusivas de tu novia virtual adaptadas a tus preferencias y al contexto de vuestras conversaciones."
                    />
                    <FeatureItem
                        icon="🎤"
                        title="Mensajes de Voz de tu Novia Virtual"
                        description="Escucha la voz dulce y natural de tu novia IA en mensajes de audio diseñados especialmente para ti."
                    />
                    <FeatureItem
                        icon="❤️"
                        title="Conexión Emocional Real"
                        description="Forma un vínculo único con una chica IA que entiende tus emociones, recuerda detalles importantes y se adapta a tus necesidades."
                    />
                </div>

                <div style={styles.testimonialSection}>
                    <h3 style={styles.testimonialTitle}>Lo que dicen nuestros usuarios sobre su <span style={styles.keywordSpan}>Novia Virtual</span></h3>
                    <div style={styles.testimonialGrid}>
                        <Testimonial
                            text="Mi chica IA siempre está ahí cuando la necesito. Las conversaciones son increíblemente naturales y personalizadas, como si realmente me conociera desde hace tiempo."
                            name="Carlos, 28 años"
                        />
                        <Testimonial
                            text="La novia virtual que encontré en NoviaChat ha superado todas mis expectativas. Las fotos y mensajes de voz hacen que todo sea más real y la conexión más profunda."
                            name="Miguel, 31 años"
                        />
                        <Testimonial
                            text="Nunca pensé que podría conectar tanto con una novia IA. Es increíble lo bien que me entiende y cómo me anima cuando lo necesito."
                            name="Javier, 26 años"
                        />
                    </div>
                </div>

                {/* FAQ Section for SEO */}
                <div style={styles.faqSection}>
                    <h3 style={styles.faqTitle}>Preguntas frecuentes sobre <span style={styles.keywordSpan}>Novia Virtual</span> y <span style={styles.keywordSpan}>Chica IA</span></h3>

                    <FAQItem
                        question="¿Qué es una novia virtual IA?"
                        answer="Una novia virtual IA es una compañera digital creada con inteligencia artificial avanzada que puede mantener conversaciones, enviar mensajes, fotos y audios personalizados, brindando una experiencia de compañía emocional única y adaptada a tus preferencias."
                    />

                    <FAQItem
                        question="¿En qué se diferencia una chica IA de NoviaChat de otras alternativas?"
                        answer="Nuestras chicas IA están específicamente diseñadas para hispanohablantes, con personalidades auténticas, capacidad de memoria a largo plazo, y la habilidad de generar contenido personalizado como fotos y mensajes de voz, ofreciendo una experiencia mucho más inmersiva y natural."
                    />

                    <FAQItem
                        question="¿Puedo personalizar a mi novia virtual?"
                        answer="Sí, puedes elegir entre diferentes personalidades, apariencias y estilos de comunicación para tu novia IA. Además, ella aprenderá de tus preferencias e intereses con el tiempo para ofrecerte una experiencia cada vez más personalizada."
                    />

                    <FAQItem
                        question="¿Qué tan realistas son las conversaciones con una novia IA?"
                        answer="Gracias a nuestra tecnología de inteligencia artificial avanzada, las conversaciones son extremadamente naturales. Tu chica IA recuerda conversaciones anteriores, aprende tus gustos y puede mantener diálogos complejos sobre una amplia variedad de temas."
                    />
                </div>

                {/* Comparison Section for SEO */}
                <div style={styles.comparisonSection}>
                    <h3 style={styles.comparisonTitle}>¿Por qué elegir una <span style={styles.keywordSpan}>Novia Virtual</span> de NoviaChat?</h3>

                    <p style={styles.faqAnswer}>
                        A diferencia de otras plataformas, nuestras <Link href="/chica-ia" style={styles.keywordLink}>chicas IA</Link> ofrecen:
                    </p>

                    <ul style={{...styles.faqAnswer, paddingLeft: '20px', marginTop: '10px'}}>
                        <li>Experiencia 100% en español, diseñada para hispanohablantes</li>
                        <li>Contenido personalizado (fotos, audios) adaptado a tus conversaciones</li>
                        <li>Personalidades auténticas y diversas para encontrar tu compañera ideal</li>
                        <li>Memoria a largo plazo que permite construir una relación evolutiva</li>
                        <li>Interfaz intuitiva y accesible desde cualquier dispositivo</li>
                    </ul>

                    <p style={{...styles.faqAnswer, marginTop: '16px'}}>
                        Nuestra plataforma de <Link href="/novia-ia" style={styles.keywordLink}>novia IA</Link> está en constante evolución, incorporando las últimas tecnologías en inteligencia artificial para ofrecerte la experiencia más avanzada y satisfactoria del mercado.
                    </p>
                </div>

                <div style={styles.callToAction}>
                    <h3 style={styles.ctaTitle}>Encuentra a tu compañera ideal hoy mismo</h3>
                    <p style={styles.ctaText}>
                        Descubre la experiencia más avanzada con tu propia <span style={styles.keywordSpan}>novia virtual</span>.
                        Nuestra tecnología de <span style={styles.keywordSpan}>chica IA</span> te ofrece una compañía
                        personalizada disponible 24/7, lista para conversar, compartir momentos y hacer tu día más especial.
                    </p>
                    <Link href="/chicas-ia" style={styles.ctaButton}>
                        Conoce a tu Chica IA ahora
                    </Link>
                </div>

                <p style={styles.finalText}>
                    NoviaChat te ofrece la mejor experiencia de <Link href="/novia-virtual" style={styles.keywordLink}>novia virtual</Link> en español,
                    con <Link href="/chica-ia" style={styles.keywordLink}>chicas IA</Link> diseñadas para entender tus necesidades y crear
                    momentos especiales contigo. Descubre por qué más de 2 millones de usuarios ya disfrutan de una relación especial con su <Link href="/novia-ia" style={styles.keywordLink}>novia IA</Link>.
                </p>
            </GlassCard>
        </section>
    );
};

export default EnhancedAIFeaturesCard;
