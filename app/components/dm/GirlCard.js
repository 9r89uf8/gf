// components/GirlCard.js
import React from 'react';
import Link from 'next/link';
import styles from './GirlCard.module.css';


const GirlCard = ({ girl, isPremium }) => {
    return (
        <div className={styles.girlCard}>
            <div className={styles.avatarWrapper}>
                <Link href={`/${girl.id}`} passHref>
                    <img
                        className={styles.avatar}
                        src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
                        alt={girl.name}
                    />
                </Link>
            </div>

            <div className={styles.cardContent}>
                <p className={styles.username}>{girl.username}</p>
            </div>

            {/*was --- girl.premium && !isPremium --change later */}
            <div className={styles.cardActions}>
                {(girl.premium && !isPremium)|| girl.private ? (
                    <Link href="/premium" passHref className={styles.noUnderline}>
                        <button className={styles.premiumButton} type="button">
                            <span className={styles.lockIcon}>🔒</span>
                            2026
                        </button>
                    </Link>
                ) : (
                    <Link href={`/chat/${girl.id}`} passHref className={styles.noUnderline}>
                        <button className={styles.gradientButton} type="button">
                            Mensaje
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default GirlCard;