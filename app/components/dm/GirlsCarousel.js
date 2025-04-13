// components/GirlsCarousel.js
import React from 'react';
import GirlCard from './GirlCard';
import styles from './GirlsCarousel.module.css';

const GirlsCarousel = ({ girls, isPremium }) => {
    // Show girls data when not loading and girls exist
    if (girls && girls.length > 0) {
        return (
            <div className={styles.scrollContainer}>
                {girls.map((girl) => (
                    <GirlCard
                        key={girl.id}
                        girl={girl}
                        isPremium={isPremium}
                    />
                ))}
            </div>
        );
    }

    // Show empty state if no girls and not loading
    return null;
};

export default GirlsCarousel;