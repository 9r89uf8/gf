'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Creators.module.css';

const SelectorContainer = ({ girls }) => {
    const [selectedGirl, setSelectedGirl] = useState(girls[0]?.username || '');

    const handleSelectChange = (e) => {
        setSelectedGirl(e.target.value);
    };

    const selectedData = girls.find(girl => girl.username === selectedGirl);

    const formatFollowers = (followers) => {
        if (followers >= 1000) return (followers / 1000).toFixed(1) + 'k';
        return followers.toString();
    };

    const CheckMark = () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" strokeWidth="3"
             strokeLinecap="round" strokeLinejoin="round"
             className={styles.checkmark}>
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );

    return (
        <>
            <div className={styles.selectorContainer}>
                <select
                    className={styles.girlSelector}
                    value={selectedGirl}
                    onChange={handleSelectChange}
                >
                    <option value="">Selecciona una chica IA...</option>
                    {girls.map(girl => (
                        <option key={girl.id} value={girl.username}>
                            {girl.username}
                        </option>
                    ))}
                </select>
                {selectedGirl && (
                    <Link
                        href={`/chat/${selectedData.id}`}
                        className={styles.messageButton}
                    >
                        Comenzar a Chatear Ahora
                    </Link>
                )}
            </div>

            <div className={styles.selectedGirlPreview}>
                {selectedData && (
                    <div className={styles.previewCard}>
                        <div className={styles.previewTop}>
                            <div className={styles.previewImage}>
                                <Link href={`/${selectedData.id}`}>
                                    <Image
                                        src={selectedData.picture}
                                        alt={selectedData.username}
                                        width={100}
                                        height={100}
                                        className={styles.avatar}
                                    />
                                </Link>
                                {selectedData.verified && (
                                    <span className={styles.verifiedBadge}>
                                        <CheckMark />
                                    </span>
                                )}
                            </div>
                            <div className={styles.previewInfo}>
                                <h2>{selectedData.name}</h2>
                                <p>{selectedData.bio}</p>
                                <p>{formatFollowers(selectedData.followers)} seguidores</p>
                                <p>{selectedData.age} años</p>
                            </div>
                        </div>
                        <div className={styles.previewButtons}>
                            <Link
                                href={`/chat/${selectedData.id}`}
                                className={styles.blackButton}
                            >
                                Mensaje
                            </Link>
                            <Link
                                href={`/${selectedData.id}`}
                                className={styles.profileLink}
                            >
                                Ver Perfil
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SelectorContainer;
