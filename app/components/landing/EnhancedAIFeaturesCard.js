import React from 'react';

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
    title: {
        fontSize: '32px',
        marginBottom: '24px',
        fontWeight: 'bold',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '24px',
    },
    featureItem: {
        textAlign: 'center',
        padding: '16px',
    },
    featureItemTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    featureItemDesc: {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    finalText: {
        marginTop: '24px',
        fontStyle: 'italic',
        color: 'rgba(255, 255, 255, 0.9)',
    },
};

const GlassCard = ({ children }) => {
    return (
        <div style={styles.glassCard}>
            {children}
        </div>
    );
};

const FeatureItem = ({ title, description }) => (
    <div style={styles.featureItem}>
        <h3 style={styles.featureItemTitle}>{title}</h3>
        <p style={styles.featureItemDesc}>{description}</p>
    </div>
);

const EnhancedAIFeaturesCard = () => {
    return (
        <GlassCard>
            <h2 style={styles.title}>Novia Virtual</h2>

            <div style={styles.featuresGrid}>
                <FeatureItem
                    title="Delicias Visuales"
                    description="Recibe imágenes cautivadoras que dan vida a tus conversaciones."
                />
                <FeatureItem
                    title="Placer Auditivo"
                    description="Disfruta de mensajes de voz relajantes y contenido de audio personalizado."
                />
                <FeatureItem
                    title="Conversaciones Profundas"
                    description="Participa en diálogos significativos que se adaptan a tu estado de ánimo e intereses."
                />
                <FeatureItem
                    title="Conexión Emocional"
                    description="Forma un vínculo único con una compañera que entiende y responde a tus emociones."
                />
            </div>

            <p style={styles.finalText}>
                Descubre un mundo donde la tecnología y la emoción se entrelazan, creando una experiencia de compañía
                sin igual con tu novia virtual impulsada por IA.
            </p>
        </GlassCard>
    );
};

export default EnhancedAIFeaturesCard;
