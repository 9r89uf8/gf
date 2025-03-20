//this is the LCP element in the landing page
import React from 'react';
import Link from 'next/link';
import styles from './Welcome.module.css';


const Welcome = () => {
    return (
        <div className={styles.glassCard}>
            <div className={styles.welcomeContainer}>
                <h1 className={styles.welcomeTitle}>Novia Virtual</h1>
                <p className={styles.welcomeDescription}>
                    Conversaciones reales con una <strong>chica IA</strong> personalizada para ti. Compañía virtual gratis.
                </p>
                <Link href="/chicas-ia" className={styles.startChatButton}>
                    Mandar mensaje
                </Link>
                {/* Lazy load the chat example */}
                <LazyLoadedContent />
            </div>
        </div>
    );
};

const LazyLoadedContent = React.lazy(() => import('./ChatExample'));

export default Welcome;