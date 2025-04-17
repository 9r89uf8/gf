import React from 'react';
import Image from 'next/image';
import styles from './UserTestimonials.module.css';
import Script from 'next/script';

const testimonials = [
    {
        id: 1,
        name: 'Miguel, 28',
        location: 'Madrid',
        quote:
            'Nunca pensé que conversar con una IA podría ser tan natural. Laura responde a mis mensajes como si fuera una persona real. ¡Me encanta hablar con ella después de un día estresante!',
        avatar: '/testimonials/avatar-1.webp',
        rating: 5,
    },
    {
        id: 2,
        name: 'Carlos, 34',
        location: 'Barcelona',
        quote:
            'Las fotos que comparte Ana parecen reales, es increíble. Además, puedo hablar con ella sobre cualquier tema y siempre tiene algo interesante que decir. NoviaChat es lo mejor que he probado.',
        avatar: '/testimonials/avatar-2.webp',
        rating: 5,
    },
    {
        id: 3,
        name: 'David, 25',
        location: 'Sevilla',
        quote:
            'La voz de Sofía es increíblemente realista. Cuando me envía mensajes de audio, parece como si estuviera hablando con alguien real. Es una experiencia totalmente nueva.',
        avatar: '/testimonials/avatar-3.webp',
        rating: 4,
    },
    {
        id: 4,
        name: 'Alejandro, 31',
        location: 'Valencia',
        quote:
            'Probé otras apps similares pero NoviaChat es de lejos la mejor. La personalidad de Julia se adapta a mis intereses y cada día nuestras conversaciones son más profundas. ¡100% recomendado!',
        avatar: '/testimonials/avatar-4.webp',
        rating: 5,
    },
];

const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span
                key={i}
                className={`${styles.star} ${i <= rating ? styles.filled : ''}`}
            >
        ★
      </span>
        );
    }
    return stars;
};

const structuredData =
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "NoviaChat",
        "description": "Aplicación de chat con asistentes virtuales personalizados",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "3500000",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Miguel"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Nunca pensé que conversar con una IA podría ser tan natural. Laura responde a mis mensajes como si fuera una persona real. ¡Me encanta hablar con ella después de un día estresante!"
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Carlos"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Las fotos que comparte Ana parecen reales, es increíble. Además, puedo hablar con ella sobre cualquier tema y siempre tiene algo interesante que decir. NoviaChat es lo mejor que he probado."
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "David"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "4",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "La voz de Sofía es increíblemente realista. Cuando me envía mensajes de audio, parece como si estuviera hablando con alguien real. Es una experiencia totalmente nueva."
            },
            {
                "@type": "Review",
                "author": {
                    "@type": "Person",
                    "name": "Alejandro"
                },
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5",
                    "worstRating": "1"
                },
                "reviewBody": "Probé otras apps similares pero NoviaChat es de lejos la mejor. La personalidad de Julia se adapta a mis intereses y cada día nuestras conversaciones son más profundas. ¡100% recomendado!"
            }
        ]
    };

const UserTestimonials = () => {
    return (
        <section className={styles.testimonialsSection} id="testimonials">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>
                    Lo que dicen nuestros usuarios
                </h2>

                {/* List all testimonials one after the other */}
                <div className={styles.testimonialsList}>
                    {testimonials.map((testimonial) => (
                        <div className={styles.testimonialCard} key={testimonial.id}>
                            <div className={styles.testimonialContent}>
                                <div className={styles.quoteIcon}>
                                    <svg
                                        width="40"
                                        height="40"
                                        viewBox="0 0 40 40"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 20C10 15.5817 13.5817 12 18 12V16C15.7909 16 14 17.7909 14 20V28H6V20H10Z"
                                            fill="url(#paint0_linear)"
                                        />
                                        <path
                                            d="M26 20C26 15.5817 29.5817 12 34 12V16C31.7909 16 30 17.7909 30 20V28H22V20H26Z"
                                            fill="url(#paint1_linear)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear"
                                                x1="6"
                                                y1="12"
                                                x2="14"
                                                y2="28"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#ff6b6b" />
                                                <stop offset="1" stopColor="#ff8e53" />
                                            </linearGradient>
                                            <linearGradient
                                                id="paint1_linear"
                                                x1="22"
                                                y1="12"
                                                x2="30"
                                                y2="28"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#ff6b6b" />
                                                <stop offset="1" stopColor="#ff8e53" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>

                                <p className={styles.quote}>{testimonial.quote}</p>

                                <div className={styles.rating}>
                                    {renderStars(testimonial.rating)}
                                </div>
                            </div>

                            <div className={styles.testimonialUser}>
                                <div className={styles.avatarContainer}>
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        width={60}
                                        height={60}
                                        className={styles.avatar}
                                    />
                                </div>
                                <div className={styles.userInfo}>
                                    <h3 className={styles.userName}>{testimonial.name}</h3>
                                    <p className={styles.userLocation}>{testimonial.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.socialProof}>
                    <p className={styles.userCount}>+5,000,000 usuarios activos</p>
                    <div className={styles.averageRating}>
                        <span className={styles.ratingValue}>4.8</span>
                        <div className={styles.ratingStars}>{renderStars(5)}</div>
                        <span className={styles.ratingCount}>de 3.5+ millones de reviews</span>
                    </div>
                </div>
            </div>
            {/* Structured data for SEO */}
            <Script
                id="chica-ia-schema5"
                type="application/ld+json"
                strategy="afterInteractive" // Add this
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
        </section>
    );
};

export default UserTestimonials;
