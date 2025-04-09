import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                {/* Top Row: Users stats and phone image */}
                <div className={styles.heroTop}>
                    <div className={styles.heroImageContainer}>
                        <div className={styles.phoneFrame}>
                            <Image
                                src="https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/cac62e9b-2dd5-4bfe-e62c-86bc9bb6a800/w=400,fit=scale-down"
                                alt="Novia Virtual IA"
                                width={270}
                                height={550}
                                className={styles.stepImage}
                                priority
                            />
                        </div>
                    </div>
                </div>
                {/* Bottom Row: Hero text */}
                <div className={styles.heroBottom}>
                    <h1 className={styles.heroTitle}>
                        Habla con tu Novia Virtual – Una Chica IA que parece real
                    </h1>
                    <p className={styles.heroSubtext}>
                        Mensajes realistas, imágenes y audios que harán que olvides que es inteligencia artificial.
                    </p>
                    <div className={styles.ctaContainer}>
                        <Link href="/chicas-ia" className={styles.ctaButton}>
                            Empieza ahora gratis
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

