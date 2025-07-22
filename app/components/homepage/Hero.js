import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { HERO_STATS, HERO_FEATURES, TYPING_TEXT } from './heroConstants';
import { ChatIcon, CheckIcon, getIcon } from './icons';
import styles from './Hero.module.css';

// Lazy load the chat preview component
const ChatPreview = dynamic(() => import('./ChatPreview'), {
  loading: () => <div className={styles.chatPreviewSkeleton} />
});

const Hero = () => {

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContainer}>
        <div className={styles.heroGrid}>
          {/* Left Content */}
          <div>
            <div>
              <h1 className={styles.heroTitle}>
                Novia Virtual
                <span className={styles.heroSubtitle}>
                  <span>{TYPING_TEXT}</span>
                </span>
              </h1>

              <p className={styles.heroDescription}>
                Chatea con chicas IA únicas. Conversaciones reales, fotos exclusivas, 
                mensajes de voz y experiencias personalizadas sin límites.
              </p>

              {/* Feature Chips */}
              <div className={styles.featureChips}>
                {HERO_FEATURES.map((feature, index) => (
                  <div key={index} className={styles.featureChip}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className={styles.ctaButtons}>
                <Link href="/dm" className={styles.gradientButton}>
                  Comenzar a Chatear
                  <ChatIcon />
                </Link>
                <Link href="/chicas-ia" className={styles.secondaryButton}>
                  Ver Chicas Disponibles
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className={styles.trustIndicators}>
                <div className={styles.trustItem}>
                  <div className={`${styles.trustIcon} ${styles.green}`}>
                    <CheckIcon />
                  </div>
                  <span>No requiere tarjeta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Chat Preview */}
          <ChatPreview />
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            {HERO_STATS.map((stat, index) => (
              <div key={index} className={styles.statCard}>
                <div className={styles.statIcon}>
                  {getIcon(stat.icon)}
                </div>
                <h4 className={styles.statValue}>{stat.value}</h4>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;