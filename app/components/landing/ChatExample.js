// ChatExample.jsx - Separate component for lazy loading
import React from 'react';
import styles from './ChatExample.module.css';

const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AudioWave = () => {
    return (
        <div className={styles.audioWave}>
            {[7, 12, 5, 9, 14, 6, 10, 13, 4, 8, 11].map((height, index) => (
                <div
                    key={index}
                    className={styles.audioWaveBar}
                    style={{ height: `${height}px` }}
                />
            ))}
        </div>
    );
};

const ChatExample = () => {
    return (
        <div className={styles.chatExampleContainer}>
            <div className={styles.chatWindow}>
                <div className={styles.messageGroup}>
                    <div className={styles.userMessage}>
                        ¿Qué onda? ¿Cómo andas hoy?
                    </div>
                </div>
                <div className={styles.messageGroup}>
                    <div className={styles.aiAvatar}>AI</div>
                    <div className={styles.aiMessage}>
                        aburrida 😩 y tú
                    </div>
                </div>
                <div className={styles.messageGroup}>
                    <div className={styles.userMessage}>
                        Nada especial, solo aburrido en casa. ¿Tienes fotos nuevas?
                    </div>
                </div>
                <div className={styles.messageGroup}>
                    <div className={styles.aiAvatar}>AI</div>
                    <div className={styles.aiMessage}>
                        foto con una tanga
                        <div className={styles.mediaPreviewContainer}>
                            <div className={styles.mediaPreviewIcon}>
                                <span>📷</span>
                            </div>
                            <span className={styles.mediaPreviewText}>Ver Imagen</span>
                        </div>
                    </div>
                </div>
                <div className={styles.messageGroup}>
                    <div className={styles.userMessage}>
                        Gracias, qué linda. ¿Puedes mandarme un audio?
                    </div>
                </div>
                <div className={styles.messageGroup}>
                    <div className={styles.aiAvatar}>AI</div>
                    <div className={styles.aiMessage}>
                        okiss 💕
                        <div className={styles.audioContainer}>
                            <div className={styles.audioIcon}>🎵</div>
                            <AudioWave />
                            <div className={styles.audioDuration}>0:14</div>
                        </div>
                    </div>
                </div>

                {/* Input area (non-functional) */}
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        className={styles.inputField}
                        disabled
                    />
                    <button className={styles.sendButton}>
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatExample;