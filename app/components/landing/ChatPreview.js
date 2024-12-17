import React from 'react';

const styles = {
    chatContainer: {
        maxWidth: '600px',
        maxHeight: '700px',
        overflowY: 'auto',
        padding: '16px',
        margin: '0 auto',
    },
    messageRow: (isUser) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
    }),
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginLeft: '8px',
        marginRight: '8px',
    },
    messageBubble: (isUser) => ({
        maxWidth: '70%',
        padding: '12px',
        borderRadius: '8px',
        background: isUser
            ? '#ffffff'
            : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        color: isUser ? '#000' : '#fff',
        position: 'relative',
        wordWrap: 'break-word',
        marginTop: '8px', // Spacing between avatar and bubble
    }),
    messageText: {
        margin: 0, // remove default <p> margin
        fontSize: '16px',
        lineHeight: '1.4',
    },
    imageMessage: {
        maxWidth: '40%',
        borderRadius: '8px',
        marginTop: '8px', // Spacing between avatar and image
    },
    audioMessage: (isUser) => ({
        display: 'flex',
        alignItems: 'center',
        background: isUser
            ? '#dcf8c6'
            : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
        padding: '8px',
        borderRadius: '8px',
        maxWidth: '70%',
        color: isUser ? '#000' : '#fff',
        marginTop: '8px', // Spacing between avatar and audio
    }),
    audioButton: {
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginRight: '8px',
    },
    audioText: {
        margin: 0,
        fontSize: '14px',
    },
};

const ChatPreview = () => {
    return (
        <div style={styles.chatContainer}>

            {/* User Message */}
            <div style={styles.messageRow(true)}>
                <img src="/vercel.svg" alt="User" style={styles.avatar} />
                <div style={styles.messageBubble(true)}>
                    <p style={styles.messageText}>Hola preciosa</p>
                </div>
            </div>

            {/* AI Girlfriend Text Message */}
            <div style={styles.messageRow(false)}>
                <img src="/profileTwo.jpg" alt="AI Girlfriend" style={styles.avatar} />
                <div style={styles.messageBubble(false)}>
                    <p style={styles.messageText}>¡Ey! ¿Cómo estuvo tu día? 😊</p>
                </div>
            </div>

            {/* AI Girlfriend Image Message */}
            <div style={styles.messageRow(false)}>
                <img src="/profileTwo.jpg" alt="AI Girlfriend" style={styles.avatar} />
                <img
                    src="/profile.jpg"
                    alt="AI sent an image"
                    style={styles.imageMessage}
                />
            </div>

            {/* AI Girlfriend Audio Message */}
            <div style={styles.messageRow(false)}>
                <img src="/profileTwo.jpg" alt="AI Girlfriend" style={styles.avatar} />
                <div style={styles.audioMessage(false)}>
                    <button style={styles.audioButton}>[Play]</button>
                    <p style={styles.audioText}>0:10</p>
                </div>
            </div>

            {/* User Message */}
            <div style={styles.messageRow(true)}>
                <img src="/vercel.svg" alt="User" style={styles.avatar} />
                <div style={styles.messageBubble(true)}>
                    <p style={styles.messageText}>
                        ¡Fue genial, gracias por preguntar!
                    </p>
                </div>
            </div>

        </div>
    );
};

export default ChatPreview;




