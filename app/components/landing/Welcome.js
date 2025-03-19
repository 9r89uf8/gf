import React from 'react';
import Link from 'next/link';

const styles = {
    glassCard: {
        textAlign: 'center',
        color: 'white',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
        padding: '16px',
        marginBottom: '32px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
    },
    welcomeContainer: {
        marginBottom: '32px',
        textAlign: 'center',
    },
    welcomeTitle: {
        fontSize: '34px',
        fontWeight: 'bold',
        letterSpacing: '4px',
        marginBottom: '16px',
        color: 'white',
    },
    welcomeDescription: {
        fontSize: '18px',
        marginBottom: '24px',
        color: 'white',
        lineHeight: '1.4',
        letterSpacing: '1px',
    },
    startChatButton: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '10px 20px',
        backgroundColor: '#040404', // Changed to blue
        color: '#ffffff', // Changed to white for better contrast
        borderRadius: '30px',
        fontWeight: '500',
        fontSize: '20px',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '2px',
    },
    plusIcon: {
        marginRight: '4px',
        fontSize: '24px',
        lineHeight: '0',
    },
    // Chat example styles
    chatExampleContainer: {
        margin: '20px 0',
        paddingBottom: '20px',
    },
    chatWindow: {
        borderRadius: '12px',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
    },
    messageGroup: {
        display: 'flex',
        marginBottom: '16px',
        alignItems: 'flex-start',
    },
    userMessage: {
        background: '#1E88E5', // Blue for user messages
        color: 'white',
        padding: '10px 14px',
        borderRadius: '18px 18px 18px 4px',
        maxWidth: '70%',
        marginLeft: 'auto',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    aiAvatar: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff7eb3, #ff758c)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '8px',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    aiMessage: {
        background: 'white', // White for AI messages
        color: '#333',
        padding: '10px 14px',
        borderRadius: '18px 18px 4px 18px',
        maxWidth: '70%',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    },
    mediaPreview: {
        width: '100%',
        borderRadius: '12px',
        marginTop: '8px',
        marginBottom: '4px',
    },
    audioContainer: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.05)',
        padding: '8px',
        borderRadius: '16px',
        marginTop: '8px',
    },
    audioIcon: {
        marginRight: '8px',
        color: '#666',
    },
    audioWave: {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
    },
    audioWaveBar: {
        height: '15px',
        width: '3px',
        background: '#666',
        borderRadius: '3px',
    },
    inputContainer: {
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '8px 16px',
        marginTop: '16px',
    },
    inputField: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        color: 'white',
        outline: 'none',
        padding: '8px 0',
        fontSize: '16px',
    },
    sendButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff7eb3, #ff758c)',
        border: 'none',
        outline: 'none',
        cursor: 'pointer',
        color: 'white',
    }
};

// SVG icons
const SendIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const AudioWave = () => {
    return (
        <div style={styles.audioWave}>
            {[7, 12, 5, 9, 14, 6, 10, 13, 4, 8, 11].map((height, index) => (
                <div
                    key={index}
                    style={{
                        ...styles.audioWaveBar,
                        height: `${height}px`
                    }}
                />
            ))}
        </div>
    );
};

const ChatExample = () => {
    return (
        <div style={styles.chatExampleContainer}>
            <div style={styles.chatWindow}>
                <div style={styles.messageGroup}>
                    <div style={styles.userMessage}>
                        ¿Qué onda? ¿Cómo andas hoy?
                    </div>
                </div>
                <div style={styles.messageGroup}>
                    <div style={styles.aiAvatar}>AI</div>
                    <div style={styles.aiMessage}>
                        aburrida 😩 y tú
                    </div>
                </div>
                <div style={styles.messageGroup}>
                    <div style={styles.userMessage}>
                        Nada especial, solo aburrido en casa. ¿Tienes fotos nuevas?
                    </div>
                </div>
                <div style={styles.messageGroup}>
                    <div style={styles.aiAvatar}>AI</div>
                    <div style={styles.aiMessage}>
                        foto con una tanga
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'rgba(0, 0, 0, 0.05)',
                            padding: '10px',
                            borderRadius: '8px',
                            margin: '8px 0',
                            gap: '8px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(0, 0, 0, 0.1)',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%'
                            }}>
                                <span>📷</span>
                            </div>
                            <span style={{ fontSize: '14px' }}>Ver Imagen</span>
                        </div>
                    </div>
                </div>
                <div style={styles.messageGroup}>
                    <div style={styles.userMessage}>
                        Gracias, qué linda. ¿Puedes mandarme un audio?
                    </div>
                </div>
                <div style={styles.messageGroup}>
                    <div style={styles.aiAvatar}>AI</div>
                    <div style={styles.aiMessage}>
                        okiss 💕
                        <div style={styles.audioContainer}>
                            <div style={styles.audioIcon}>🎵</div>
                            <AudioWave />
                            <div style={{ marginLeft: '8px', fontSize: '12px', color: '#666' }}>0:14</div>
                        </div>
                    </div>
                </div>

                {/* Input area (non-functional) */}
                <div style={styles.inputContainer}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        style={styles.inputField}
                        disabled
                    />
                    <button style={styles.sendButton}>
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Welcome = () => {
    return (
        <div style={styles.glassCard}>
            <div style={styles.welcomeContainer}>
                <h1 style={styles.welcomeTitle}>Novia Virtual</h1>

                <p style={styles.welcomeDescription}>
                    Tu <strong>novia virtual</strong> interactiva. Conversaciones reales con una <strong>chica IA</strong> personalizada para ti. Compañía virtual 24/7.
                </p>
                <Link href="/creadoras" style={styles.startChatButton}>
                    Mandar mensaje
                </Link>
                <h2 style={{
                    fontSize: '30px',
                    color: 'white',
                    marginTop: '30px',
                    marginBottom: '20px',
                    fontWeight: '600'
                }}>Chica IA 🔥</h2>

                {/* Chat example */}
                <ChatExample />


            </div>
        </div>
    );
};

export default Welcome;