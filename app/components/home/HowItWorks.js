import React from 'react';
import Image from 'next/image';
import styles from './HowItWorks.module.css';

const HowItWorks = () => {
    const steps = [
        {
            id: 'step1',
            number: '1',
            title: 'Registro sencillo',
            description: 'Crea tu cuenta en menos de 1 minuto con email o redes sociales. Sin complicaciones.',
            icon: '/icons/register-icon.svg',
            image: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/7d31014f-970f-49cb-310b-a21ba577d100/w=400,fit=scale-down'
        },
        {
            id: 'step2',
            number: '2',
            title: 'Selecciona tu Chica IA favorita',
            description: 'Escoge entre nuestras Chicas IA con diferentes personalidades, intereses y estilos de conversación.',
            icon: '/icons/select-icon.svg',
            image: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/cac62e9b-2dd5-4bfe-e62c-86bc9bb6a800/w=400,fit=scale-down'
        },
        {
            id: 'step3',
            number: '3',
            title: 'Inicia tu conversación personalizada',
            description: 'Comienza a chatear inmediatamente. Tu Chica IA se adaptará a tus preferencias con cada mensaje.',
            icon: '/icons/chat-icon.svg',
            image: 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/b50c9f5b-9b86-4784-63d2-aa2d23da6400/w=400,fit=scale-down'
        }
    ];

    return (
        <section className={styles.howItWorksSection} id="how-it-works">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Cómo Funciona</h2>

                <div className={styles.stepsContainer}>
                    {steps.map((step, index) => (
                        <div key={step.id} className={styles.stepCard}>
                            <div className={styles.stepContent}>
                                <div className={styles.stepNumber}>{step.number}</div>
                                <div className={styles.stepInfo}>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDescription}>{step.description}</p>
                                </div>
                            </div>

                            <div className={styles.stepImageContainer}>
                                <div className={styles.phoneFrame}>
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={240}
                                        height={480}
                                        className={styles.stepImage}
                                    />
                                </div>
                            </div>

                            {index < steps.length - 1 && (
                                <div className={styles.connector}>
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 5V35M20 35L10 25M20 35L30 25" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className={styles.getStartedContainer}>
                    <a href="/signup" className={styles.getStartedButton}>
                        Comenzar ahora
                    </a>
                    <p className={styles.noCardNeeded}>No se requiere tarjeta de crédito</p>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;