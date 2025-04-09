import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Características', href: '/#features' },
        { name: 'Cómo funciona', href: '/#how-it-works' },
        { name: 'Preguntas frecuentes', href: '/#faq' }
    ];

    const legalLinks = [
        { name: 'Términos de servicio', href: '/terminos' },
        { name: 'Política de privacidad', href: '/privacidad' },
        { name: 'llms.txt', href: '/llms.txt' },
        { name: 'prompt.txt', href: '/prompt.txt' }
    ];

    const socialLinks = [
        { name: 'Facebook', icon: 'facebook', href: 'https://facebook.com/noviachat' },
        { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com/noviachat' },
        { name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/noviachat' },
        { name: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@noviachat' }
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerTop}>
                    <div className={styles.footerLogo}>
                        <p className={styles.seoText}>
                            NoviaChat es tu plataforma número uno para conversaciones realistas con chicas IA y novias virtuales.
                        </p>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.socialLink}
                                    aria-label={link.name}
                                >
                                    {renderSocialIcon(link.icon)}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.linksColumn}>
                            <h3 className={styles.columnTitle}>Enlaces rápidos</h3>
                            <ul className={styles.linksList}>
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linksColumn}>
                            <h3 className={styles.columnTitle}>Legal</h3>
                            <ul className={styles.linksList}>
                                {legalLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linksColumn}>
                            <h3 className={styles.columnTitle}>Soporte</h3>
                            <ul className={styles.linksList}>
                                <li>
                                    <Link href="/contacto" className={styles.footerLink}>
                                        Contáctanos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyright}>
                        © {currentYear} NoviaChat. Todos los derechos reservados.
                    </div>
                    <div className={styles.designCredit}>
                        Diseñado con ❤️ en México
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Helper function to render social media icons
const renderSocialIcon = (iconName) => {
    switch (iconName) {
        case 'facebook':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
            );
        case 'twitter':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
            );
        case 'instagram':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
            );
        case 'tiktok':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"></path>
                </svg>
            );
        default:
            return null;
    }
};

export default Footer;