import React from 'react';
import styles from './Welcome.module.css';

const Welcome = () => {
    return (
        <div className={styles.welcome_glassCard}>
            <div className={styles.welcome_welcomeContainer}>
                <h1 className={styles.welcome_welcomeTitle}>
                    Novia Virtual
                </h1>
                <h2 className={styles.welcome_welcomeDescription}>
                    Conversaciones reales con una <strong>chica IA</strong> personalizada para ti. Compañía virtual y afecto sin límites.
                </h2>

                {/* --- Feature Grid Highlighting Key Points --- */}
                <div className={styles.featureGrid}>
                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            {/* Icon for "Gratis" */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4"/><path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/><path d="M12 12V6"/><path d="M12 18v-6"/><path d="M12 6a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3z"/><path d="M12 18a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z"/></svg>
                        </div>
                        <p>Siempre Gratis</p>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            {/* Icon for "18+" */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 12v6"/></svg>
                        </div>
                        <p>Personajes 18+</p>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            {/* Icon for "Users" */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </div>
                        <p>+4M de Usuarios</p>
                    </div>

                    <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                            {/* Icon for "Anonymous" */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M15.5 14.5c-1.5 1-3.5 1-5 0"/></svg>
                        </div>
                        <p>100% Anónimo</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;