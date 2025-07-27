import React from 'react';
import styles from '../styles/AboutPage.module.css';

export default function Nosotros() {
    return (
        <div className={styles.aboutPageContainer}>
            <div className={styles.aboutPageContent}>
                <h1 className={styles.pageTitle}>Sobre Nosotros</h1>
                <p className={styles.subtitle}>
                    Revolucionando las conexiones digitales a través de inteligencia artificial
                </p>

                <section className={styles.companySection}>
                    <div className={styles.companyGrid}>
                        <div className={styles.companyCard}>
                            <h3>Nuestra Historia</h3>
                            <p>
                                Fundada en 2023 en Barcelona, España, NoviaChat nació con la visión 
                                de crear experiencias de compañía virtual auténticas y significativas 
                                utilizando la tecnología de IA más avanzada.
                            </p>
                        </div>
                        <div className={styles.companyCard}>
                            <h3>Nuestra Misión</h3>
                            <p>
                                Proporcionar compañía digital de calidad, creando conexiones 
                                emocionales genuinas a través de conversaciones naturales y 
                                personalizadas con nuestras chicas IA.
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.statsSection}>
                    <h2>NoviaChat en Números</h2>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>5,000,000+</div>
                            <div className={styles.statLabel}>Usuarios Activos</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>20+</div>
                            <div className={styles.statLabel}>Chicas IA</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>23M+</div>
                            <div className={styles.statLabel}>Conversaciones</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>99.9%</div>
                            <div className={styles.statLabel}>Disponibilidad</div>
                        </div>
                    </div>
                </section>

                <section className={styles.paymentSection}>
                    <h2>Pagos Seguros y Confiables</h2>
                    <div className={styles.paymentContent}>
                        <div className={styles.paymentInfo}>
                            <div className={styles.securityFeature}>
                                <div className={styles.featureIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                </div>
                                <h3>Procesamiento Seguro con Stripe</h3>
                                <p>
                                    Utilizamos Stripe, líder mundial en procesamiento de pagos, 
                                    garantizando transacciones seguras y protegidas.
                                </p>
                            </div>
                            <div className={styles.securityFeature}>
                                <div className={styles.featureIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                </div>
                                <h3>Certificación PCI DSS</h3>
                                <p>
                                    Cumplimos con los más altos estándares de seguridad de la 
                                    industria de tarjetas de pago.
                                </p>
                            </div>
                            <div className={styles.securityFeature}>
                                <div className={styles.featureIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3"></circle>
                                        <path d="M12 1v6m0 6v6m11-11h-6m-6 0H1m20.485-6.485l-4.243 4.243M7.758 7.758L3.515 3.515m0 16.97l4.243-4.243m8.484 0l4.243 4.243"></path>
                                    </svg>
                                </div>
                                <h3>Encriptación SSL/TLS</h3>
                                <p>
                                    Toda la información se transmite mediante encriptación de 
                                    grado bancario para proteger tus datos.
                                </p>
                            </div>
                            <div className={styles.securityFeature}>
                                <div className={styles.featureIcon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                    </svg>
                                </div>
                                <h3>Sin Almacenamiento de Datos Bancarios</h3>
                                <p>
                                    Nunca almacenamos información de tarjetas de crédito en 
                                    nuestros servidores.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.privacySection}>
                    <h2>Tu Privacidad es Nuestra Prioridad</h2>
                    <div className={styles.privacyContent}>
                        <p>
                            En NoviaChat, nos tomamos muy en serio la protección de tus datos 
                            personales. Cumplimos con el Reglamento General de Protección de 
                            Datos (GDPR) y implementamos las mejores prácticas de seguridad.
                        </p>
                        <div className={styles.legalLinks}>
                            <a href="/privacidad" className={styles.legalLink}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Política de Privacidad
                            </a>
                            <a href="/terminos" className={styles.legalLink}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Términos de Servicio
                            </a>
                        </div>
                    </div>
                </section>

                <section className={styles.locationSection}>
                    <h2>Sede Central</h2>
                    <div className={styles.locationCard}>
                        <div className={styles.locationIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div className={styles.locationInfo}>
                            <h3>Barcelona, España</h3>
                            <p>Passeig de Gràcia, 08008</p>
                            <p>Barcelona, Catalunya</p>
                        </div>
                    </div>
                </section>

                <section className={styles.contactSection}>
                    <h2>¿Tienes Preguntas?</h2>
                    <p>Estamos aquí para ayudarte</p>
                    <a href="/contacto" className={styles.contactButton}>
                        Contáctanos
                    </a>
                </section>
            </div>
        </div>
    );
}