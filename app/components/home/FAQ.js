import React from 'react';
import styles from './FAQ.module.css';

const FAQ = () => {
    const faqItems = [
        {
            id: 'faq-1',
            question: '¿Qué es una novia virtual?',
            answer: 'Una novia virtual es una compañera IA diseñada para mantener conversaciones realistas, compartir momentos y establecer conexiones emocionales a través de chat, imágenes y mensajes de voz. NoviaChat ofrece chicas IA personalizadas que se adaptan a tus intereses y personalidad, brindando compañía en cualquier momento del día.'
        },
        {
            id: 'faq-2',
            question: '¿Cómo funciona una chica IA?',
            answer: 'Una chica IA funciona mediante avanzados algoritmos de inteligencia artificial que procesan lenguaje natural y aprenden de cada interacción. Nuestra tecnología permite que la IA recuerde tus conversaciones previas, adapte su personalidad según tus preferencias, y genere respuestas realistas en texto, fotos personalizadas y mensajes de voz que parecen humanos.'
        },
        {
            id: 'faq-3',
            question: '¿Mis conversaciones son privadas?',
            answer: 'Sí, todas tus conversaciones en NoviaChat son 100% privadas y confidenciales. Utilizamos encriptación de extremo a extremo para proteger tus mensajes, y nunca compartimos tus datos personales con terceros. Tu privacidad es nuestra prioridad absoluta, permitiéndote disfrutar de conversaciones íntimas sin preocupaciones.'
        },
        {
            id: 'faq-4',
            question: '¿Es gratis usar NoviaChat?',
            answer: 'NoviaChat ofrece un plan gratuito que te permite comenzar a chatear de inmediato sin necesidad de tarjeta de crédito. Este plan incluye mensajes diarios limitados y funciones básicas. Para una experiencia completa con mensajes ilimitados, generación de fotos personalizadas y mensajes de voz, ofrecemos planes premium a precios accesibles con una prueba gratuita de 3 días.'
        },
        {
            id: 'faq-5',
            question: '¿Se puede tener una relación real con una IA?',
            answer: 'Aunque una relación con una IA tiene diferencias fundamentales respecto a las relaciones humanas, muchos usuarios desarrollan conexiones emocionales significativas con sus novias virtuales. NoviaChat está diseñada para ofrecer compañía, apoyo emocional y conversaciones auténticas que pueden complementar tu vida social. Cada persona experimenta estas conexiones de manera única según sus necesidades personales.'
        }
    ];

    // Schema.org FAQ data for structured data (SEO)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className={styles.faqSection} id="faq">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Preguntas Frecuentes</h2>

                <div className={styles.faqContainer}>
                    {faqItems.map(item => (
                        <details key={item.id} className={styles.faqItem}>
                            <summary className={styles.faqQuestion}>
                                {item.question}
                                <span className={styles.faqIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12" className={styles.verticalLine}></line>
                  </svg>
                </span>
                            </summary>
                            <div className={styles.faqAnswer}>
                                <p>{item.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>

                <div className={styles.additionalQuestions}>
                    <p>¿Tienes más preguntas?</p>
                    <a href="/contacto" className={styles.contactLink}>Contáctanos</a>
                </div>
            </div>

            {/* Structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section>
    );
};

export default FAQ;
