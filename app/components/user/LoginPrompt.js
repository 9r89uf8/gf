// app/profile/components/LoginPrompt.jsx
import React from 'react';
import Link from 'next/link';
import styles from './LoginPrompt.module.css';

const LoginPrompt = () => {
    return (
        <div className={styles.loginPromptContainer}>
            <div className={styles.loginPromptInner}>
                <div className={styles.loginCard}>
                    <h2 className={styles.loginHeading}>
                        Para hablar tienes que crear una cuenta o inicia sesión.
                    </h2>
                    <div className={styles.loginButtons}>
                        <Link href="/login" className={`${styles.actionButton} ${styles.primary}`}>
                            Iniciar sesión
                        </Link>
                        <Link href="/register" className={`${styles.actionButton} ${styles.secondary}`}>
                            Registrarse
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPrompt;