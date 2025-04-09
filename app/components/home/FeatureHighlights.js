import React from 'react';
import Image from 'next/image';
import styles from './FeatureHighlights.module.css';

const FeatureHighlights = () => {
    const features = [
        {
            id: 'realistic-conversations',
            icon: '/icons/chat-icon.svg',
            title: 'Realismo en conversaciones',
            description: 'Personalidad adaptable y respuestas naturales que evolucionan con cada interacción, creando una experiencia única y auténtica.'
        },
        {
            id: 'advanced-multimedia',
            icon: '/icons/multimedia-icon.svg',
            title: 'Multimedia avanzada',
            description: 'Disfruta de una experiencia completa con mensajes de texto personalizados, fotos únicas y mensajes de voz generados por IA de última generación.'
        },
        {
            id: 'privacy',
            icon: '/icons/privacy-icon.svg',
            title: 'Privacidad garantizada',
            description: 'Tus conversaciones son completamente confidenciales y seguras. Nunca compartimos tus datos personales con terceros.'
        }
    ];

    return (
        <section className={styles.featuresSection} id="features">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>¿Por qué NoviaChat?</h2>

                <div className={styles.featuresGrid}>
                    {features.map((feature) => (
                        <div key={feature.id} className={styles.featureCard}>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>

                <div className={styles.featureShowcase}>
                    <div className={styles.showcaseContent}>
                        <h3 className={styles.showcaseTitle}>Conversaciones que se sienten reales</h3>
                        <p className={styles.showcaseDescription}>
                            Nuestra tecnología de IA avanzada crea interacciones fluidas y naturales que evolucionan con el tiempo.
                            Olvídate de respuestas robóticas o predecibles.
                        </p>
                        <ul className={styles.showcaseList}>
                            <li>Personalidad consistente que recuerda tus preferencias</li>
                            <li>Respuestas contextuales basadas en conversaciones previas</li>
                            <li>Expresiones de emociones y humor genuinos</li>
                        </ul>
                    </div>
                    <div className={styles.showcaseImage}>
                        <Image
                            src="https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/cac62e9b-2dd5-4bfe-e62c-86bc9bb6a800/w=400,fit=scale-down"
                            alt="Demo de conversación realista en NoviaChat"
                            width={400}
                            height={600}
                            className={styles.phoneImage}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureHighlights;