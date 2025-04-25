// app/components/home/GirlPreviewContainer.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Creators.module.css';

const CheckMark = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="3"
         strokeLinecap="round" strokeLinejoin="round"
         className={styles.checkmark}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const GirlPreview = ({ girl }) => {
    const formatFollowers = (followers) => {
        if (followers >= 1000) return (followers / 1000).toFixed(1) + 'k';
        return followers.toString();
    };

    return (
        <div className={styles.selectedGirlPreview}>
            <div className={styles.previewCard}>
                <div className={styles.previewTop}>
                    <div className={styles.previewImage}>
                        <Link href={`/${girl.id}`}>
                            <Image
                                src={girl.picture}
                                alt={girl.username}
                                width={100}
                                height={100}
                                className={styles.avatar}
                            />
                        </Link>
                        {girl.verified && (
                            <span className={styles.verifiedBadge}>
                                <CheckMark />
                            </span>
                        )}
                    </div>
                    <div className={styles.previewInfo}>
                        <h2>{girl.name}</h2>
                        <p>{girl.bio}</p>
                        <p>{formatFollowers(girl.followers)} seguidores</p>
                        <p>{girl.age} años</p>
                    </div>
                </div>
                <div className={styles.previewButtons}>
                    <Link
                        href={!girl.texting ? "/dm" : `/chat/${girl.id}`}
                        className={styles.blackButton}
                    >
                        Mensaje
                    </Link>
                    <Link
                        href={`/${girl.id}`}
                        className={styles.profileLink}
                    >
                        Ver Perfil
                    </Link>
                </div>
            </div>
        </div>
    );
};

// In GirlPreviewContainer.js
const GirlPreviewContainer = ({ girls }) => {
    // Assume first girl is default
    const defaultGirl = girls[0]?.username;

    return (
        <div id="preview-container" style={{ display: 'block' }}>
            {girls.map(girl => (
                <div
                    key={girl.id}
                    id={`preview-${girl.username}`}
                    className="girl-preview"
                    style={{ display: girl.username === defaultGirl ? 'block' : 'none' }}
                >
                    <GirlPreview girl={girl} />
                </div>
            ))}
        </div>
    );
};

export default GirlPreviewContainer;
