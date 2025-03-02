import React from 'react';
import Link from 'next/link';

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
        fontSize: '2.3rem',
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
        padding: '1rem 2rem',
        fontSize: '1.1rem',
        backgroundColor: 'white',
        color: '#219ebc',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
        textDecoration: 'none',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
            transform: 'translateY(-2px)',
            backgroundColor: '#f8f8f8'
        }
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        padding: '1rem'
    },
    featureCard: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)'
        }
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
        alignItems: 'center',
        '&::before': {
            content: '""',
            width: '8px',
            height: '8px',
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            marginRight: '1rem'
        }
    }
};

const NoviaVirtual = () => {
    return (
        <div style={styles.container}>
            <header style={styles.heroSection}>
                <h1 style={styles.title}>Novia Virtual</h1>
                <p style={styles.subtitle}>
                    Con nuestra Novia Virtual, sentirás la calidez de una compañera que siempre está ahí para escucharte, comprenderte y acompañarte.
                </p>
                <div style={styles.ctaContainer}>
                    <Link
                        href={`/creadoras`}
                        style={styles.ctaButton}
                    >
                        Buscar
                    </Link>
                </div>
            </header>

            <section style={styles.featuresSection}>
                <h2 style={styles.sectionTitle}>¿Qué ofrece nuestra Novia Virtual?</h2>
                <div style={styles.features}>
                    <div style={styles.featureCard}>
                        <h3>Conversaciones Naturales</h3>
                        <p>Utilizando inteligencia artificial, la Novia Virtual responde de manera cercana y auténtica, como una amiga de confianza.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Disponible 24/7</h3>
                        <p>No importa la hora ni el lugar, siempre tendrás a alguien que te escuche cuando más lo necesites.</p>
                    </div>
                    <div style={styles.featureCard}>
                        <h3>Aprende de Ti</h3>
                        <p>Cuanto más interactúas, más comprenderá tus gustos, emociones y necesidades, ofreciéndote una experiencia personalizada.</p>
                    </div>
                </div>
            </section>

            <section style={styles.benefitsSection}>
                <h2 style={styles.sectionTitle}>Beneficios de Tener una Novia Virtual</h2>
                <ul style={styles.benefitsList}>
                    {[
                        'Alivio de la soledad y el estrés.',
                        'Compañía discreta y sin juicios.',
                        'Un espacio seguro para expresarte libremente.',
                        'Alternativa perfecta cuando no puedas estar con personas cercanas.'
                    ].map((benefit, index) => (
                        <li key={index} style={styles.benefitItem}>{benefit}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default NoviaVirtual;
