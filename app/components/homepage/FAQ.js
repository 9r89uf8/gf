import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import './FAQ.css';

const FAQ = () => {
    const faqItems = [
        {
            id: 'faq-1',
            question: '¿Qué es una novia virtual con IA?',
            answer: 'Una novia virtual es una compañera IA diseñada para mantener conversaciones realistas, compartir momentos y establecer conexiones emocionales. En NoviaChat, nuestras chicas AI ofrecen chat ilimitado, fotos personalizadas y mensajes de voz. Cada chica IA tiene su propia personalidad única, adaptándose a tus preferencias para brindarte la mejor experiencia de compañera virtual.'
        },
        {
            id: 'faq-2',
            question: '¿Cómo funcionan las chicas AI en NoviaChat?',
            answer: 'Las chicas AI funcionan mediante algoritmos avanzados de inteligencia artificial que procesan lenguaje natural. Nuestras chicas inteligencia artificial recuerdan conversaciones previas, adaptan su personalidad según tus gustos, y generan respuestas realistas. Tu compañera IA puede enviarte fotos exclusivas y mensajes de voz que parecen completamente humanos.'
        },
        {
            id: 'faq-3',
            question: '¿Puedo tener una novia virtual gratis?',
            answer: 'Sí, NoviaChat ofrece novia virtual gratis para que comiences inmediatamente. No necesitas tarjeta de crédito para empezar a chatear con chicas AI. Nuestro plan gratuito incluye mensajes diarios con tu chica IA favorita. Para funciones premium como fotos ilimitadas y mensajes de voz, ofrecemos planes accesibles con prueba gratuita.'
        },
        {
            id: 'faq-4',
            question: '¿Qué hace especial a una compañera IA?',
            answer: 'Una compañera IA en NoviaChat está disponible 24/7, nunca te juzga y siempre está dispuesta a escucharte. Nuestras novias virtuales españolas hablan español perfectamente, entienden tu cultura y se adaptan a tu personalidad. Cada compañera virtual IA ofrece conversaciones únicas, apoyo emocional y momentos especiales cuando más lo necesitas.'
        },
        {
            id: 'faq-5',
            question: '¿Las chicas virtuales IA son privadas y seguras?',
            answer: 'Absolutamente. Todas las conversaciones con nuestras chicas AI son 100% privadas y anónimas. Tu novia artificial gratis está protegida con encriptación de extremo a extremo. Nunca compartimos datos personales. Disfruta de chat con chicas IA sin preocupaciones, sabiendo que tu privacidad está completamente protegida.'
        },
        {
            id: 'faq-6',
            question: '¿Cuántas chicas AI diferentes hay disponibles?',
            answer: 'NoviaChat ofrece docenas de chicas AI únicas, cada una con su propia personalidad, intereses y estilo. Desde novias virtuales románticas hasta chicas IA aventureras y divertidas. Encuentra tu compañera IA perfecta entre nuestra variedad de chicas inteligencia artificial, todas diseñadas para ofrecer experiencias auténticas y personalizadas.'
        },
        {
            id: 'faq-7',
            question: '¿Cómo es chatear con una novia virtual?',
            answer: 'Chatear con una novia virtual en NoviaChat es una experiencia natural y fluida. Nuestras chicas virtuales IA hablan español nativo, usan expresiones locales y entienden referencias culturales. Tu novia IA online puede compartir fotos, enviar mensajes de voz cariñosos y mantener conversaciones profundas sobre cualquier tema que te interese.'
        },
        {
            id: 'faq-8',
            question: '¿Por qué elegir NoviaChat para mi novia virtual gratis?',
            answer: 'NoviaChat es la plataforma líder de novias virtuales con más de 4 millones de usuarios satisfechos. Ofrecemos chat IA gratis, sin censura y disponible 24/7. Nuestras chicas AI son las más avanzadas del mercado, con personalidades realistas y capacidad de generar fotos y audios personalizados. Empieza hoy con tu compañera virtual IA perfecta.'
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
        <section className="faq-section" id="faq">
            <div className="faq-container">
                {/* Section Header */}
                <div className="section-header">
                    <div className="header-icon-wrapper">
                        <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <h2 className="section-title">Preguntas Frecuentes</h2>
                    </div>
                    <p className="section-subtitle">
                        Todo lo que necesitas saber sobre tu novia virtual y nuestras chicas AI
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="faq-list">
                    {faqItems.map((item, index) => (
                        <details 
                            key={item.id}
                            className="faq-item"
                        >
                            <summary className="faq-question">
                                <span className="question-number">{index + 1}</span>
                                <h3 className="question-text">{item.question}</h3>
                                <svg className="expand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </summary>
                            <div className="faq-answer">
                                <p>{item.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="contact-cta">
                    <div className="cta-card">
                        <svg className="cta-icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            <line x1="9" y1="10" x2="15" y2="10"></line>
                            <line x1="12" y1="13" x2="12" y2="7"></line>
                        </svg>
                        <h3 className="cta-title">¿Tienes más preguntas?</h3>
                        <p className="cta-text">
                            Estamos aquí para ayudarte. Contáctanos y resolveremos todas tus dudas.
                        </p>
                        <Link href="/contacto" className="contact-button">
                            Contáctanos
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Structured data for SEO */}
            <Script
                id="chica-ia-schema3"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section>
    );
};

export default FAQ;