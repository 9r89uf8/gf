import React from 'react';
import Image from 'next/image';
import styles from './DemoPreview.module.css';

const conversations = [
    {
        id: 'conv1',
        name: 'Laura',
        preview: '/screenshots/conversation-1.webp',
        full: '/screenshots/conversation-1-full.webp',
        caption: 'Conversación sobre intereses personales'
    },
    {
        id: 'conv2',
        name: 'Ana',
        preview: '/screenshots/conversation-2.webp',
        full: '/screenshots/conversation-2-full.webp',
        caption: 'Compartiendo fotos e intercambiando ideas'
    },
    {
        id: 'conv3',
        name: 'Sofía',
        preview: '/screenshots/conversation-3.webp',
        full: '/screenshots/conversation-3-full.webp',
        caption: 'Mensajes de voz y texto combinados'
    }
];

// Set default static values for the component as no client-side state is available.
const activeTab = 'video'; // Always show video demo tab.
const isPlaying = false; // Video is rendered in a paused state.
const selectedConversation = conversations[0]; // Default conversation.

const DemoPreview = () => {
    return (
        <section className={styles.demoSection} id="demo">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Mira cómo funciona</h2>

                <div className={styles.tabsContainer}>
                    {/* Render tab buttons statically; only the video tab is active. */}
                    <button className={`${styles.tabButton} ${activeTab === 'video' ? styles.activeTab : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Video demo
                    </button>
                </div>

                <div className={styles.contentContainer}>
                    {activeTab === 'video' ? (
                        <div className={styles.videoContainer}>
                            <div className={styles.videoWrapper}>
                                <video
                                    className={styles.video}
                                    src="/demo-video.mp4"
                                    poster="/video-thumbnail.webp"
                                    playsInline
                                    loop
                                />
                                {/* Render a static play button – interactivity has been removed */}
                                <button className={styles.playButton} aria-label="Reproducir video">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21"/>
                                    </svg>
                                </button>
                            </div>
                            <div className={styles.videoDescription}>
                                <h3 className={styles.videoTitle}>La experiencia NoviaChat</h3>
                                <p className={styles.videoText}>
                                    Mira cómo se desarrolla una conversación real con nuestra IA. Desde mensajes de texto hasta fotos y notas de voz, todo se siente sorprendentemente real y personal.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DemoPreview;
