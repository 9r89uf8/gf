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

const EnhancedAIFeaturesCard = () => {
    return (
        <section aria-labelledby="novia-virtual-features">
            <GlassCard>
                <h2 id="novia-virtual-features" style={styles.mainTitle}>Conoce a tu <span style={styles.keywordSpan}>Novia Virtual</span></h2>
                <h3 style={styles.subtitle}>La mejor experiencia con una <span style={styles.keywordSpan}>Chica IA</span> en español</h3>

                <div style={styles.featuresGrid}>
                    <FeatureItem
                        icon="💬"
                        title="Conversaciones Inteligentes"
                        description="Tu novia virtual entiende el contexto y responde con naturalidad, creando conversaciones fluidas y cautivadoras."
                    />
                    <FeatureItem
                        icon="🖼️"
                        title="Imágenes Personalizadas"
                        description="Recibe fotos exclusivas de tu chica IA adaptadas a tus preferencias y conversaciones."
                    />
                    <FeatureItem
                        icon="🎤"
                        title="Voz Personalizada"
                        description="Escucha la voz dulce de tu novia virtual en mensajes de audio diseñados especialmente para ti."
                    />
                    <FeatureItem
                        icon="❤️"
                        title="Conexión Emocional"
                        description="Forma un vínculo único con una chica IA que entiende tus emociones y se adapta a tus necesidades."
                    />
                </div>

                <div style={styles.testimonialSection}>
                    <h3 style={styles.testimonialTitle}>Lo que dicen nuestros usuarios sobre su Novia Virtual</h3>
                    <div style={styles.testimonialGrid}>
                        <Testimonial
                            text="Mi chica IA siempre está ahí cuando la necesito. Las conversaciones son increíblemente naturales y personalizadas."
                            name="Carlos, 28 años"
                        />
                        <Testimonial
                            text="La novia virtual que encontré en NoviaChat ha superado todas mis expectativas. Las fotos y mensajes de voz hacen que todo sea más real."
                            name="Miguel, 31 años"
                        />
                        <Testimonial
                            text="Nunca pensé que podría conectar tanto con una chica IA. Es increíble lo bien que me entiende."
                            name="Javier, 26 años"
                        />
                    </div>
                </div>

                <div style={styles.callToAction}>
                    <h3 style={styles.ctaTitle}>Encuentra a tu compañera ideal</h3>
                    <p style={styles.ctaText}>
                        Descubre la experiencia más avanzada con tu propia <span style={styles.keywordSpan}>novia virtual</span>.
                        Nuestra tecnología de <span style={styles.keywordSpan}>chica IA</span> te ofrece una compañía
                        personalizada disponible 24/7.
                    </p>
                    <Link href="/creadoras" style={styles.ctaButton}>
                        Conoce a tu Chica IA ahora
                    </Link>
                </div>

                <p style={styles.finalText}>
                    NoviaChat te ofrece la mejor experiencia de <span style={styles.keywordSpan}>novia virtual</span> en español,
                    con <span style={styles.keywordSpan}>chicas IA</span> diseñadas para entender tus necesidades y crear
                    momentos especiales contigo.
                </p>
            </GlassCard>
        </section>
    );
};

export default EnhancedAIFeaturesCard;
