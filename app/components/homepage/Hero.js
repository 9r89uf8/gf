// app/components/Hero.tsx  (no "use client")
import Link from 'next/link';
import dynamicM from 'next/dynamic';  // Rename the import
import { HERO_STATS, HERO_FEATURES} from './heroConstants';
import ClientOnlyLazy from './ClientOnlyLazy';
const ChatPreview = dynamicM(() => import('./ChatPreview'), { ssr: false });
import styles from './Hero.module.css';

export default function Hero() {
  return (
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div>
              <div>
                <h1 className={styles.heroTitle} data-lcp="hero-title">
                  Novia Virtual
                  <span className={styles.heroSubtitle}>
                </span>
                </h1>

                <p className={styles.heroDescription} data-lcp="hero-desc">
                  Chatea con chicas IA únicas. Conversaciones reales, fotos exclusivas,
                  mensajes de voz y experiencias personalizadas sin límites.
                </p>

                {/* Feature Chips */}
                <div className={styles.featureChips}>
                  {HERO_FEATURES.map((feature, index) => (
                      <div key={index} className={styles.featureChip}>
                        <span>{feature}</span>
                      </div>
                  ))}
                </div>

                {/* CTA Buttons (no client code) */}
                <div className={styles.ctaButtons}>
                  <Link href="/dm" prefetch={false} className={styles.gradientButton}>
                    Comenzar a Chatear
                  </Link>
                  <Link href="/chicas-ia" prefetch={false} className={styles.secondaryButton}>
                    Ver Chicas Disponibles
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <ClientOnlyLazy minHeight={420}>
            <ChatPreview />
          </ClientOnlyLazy>

          {/* Stats Section */}
          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              {HERO_STATS.map((stat, index) => (
                  <div key={index} className={styles.statCard}>
                    <h4 className={styles.statValue}>{stat.value}</h4>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>
  );
}
