// ChatInputComponent.js
import React, { useState } from 'react';
import {
    Paper,
    IconButton,
    InputBase,
    styled,
    Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';

const ChatInputStyled = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(1),
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 'sm',
    margin: '0 auto',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1000,
}));

// Typing Indicator styled components
const TypingIndicatorContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
}));

const TypingDot = styled(motion.span)(({ theme }) => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    margin: '0 2px',
}));

// Typing Indicator Component
const TypingIndicatorInline = ({ girl }) => {
    const colors = ['#FF4081', '#7C4DFF', '#448AFF']; // Vibrant colors
    return (
        <TypingIndicatorContainer>
            {colors.map((color, index) => (
                <TypingDot
                    key={index}
                    style={{ backgroundColor: color }}
                    animate={{
                        y: [0, -5, 0],
                        opacity: [0.7, 1, 0.7],
                        backgroundColor: [color, '#FFFFFF', color],
                    }}
                    transition={{
                        y: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 0.6,
                            delay: index * 0.2,
                        },
                        opacity: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 0.6,
                            delay: index * 0.2,
                        },
                        backgroundColor: {
                            repeat: Infinity,
                            repeatType: 'loop',
                            duration: 1.2,
                            delay: index * 0.2,
                        },
                    }}
                />
            ))}
        </TypingIndicatorContainer>
    );
};

const ChatInputComponent = ({
                                handleSubmit,
                                user,
                                canSendMessage,
                                fileInputRef,
                                handleImageUpload,
                                isSending,
                                prompt,
                                setPrompt,
                                isPromptEntered,
                                girl,
                            }) => {
    const [imageSelected, setImageSelected] = useState(false);

    return (
    <ChatInputStyled component="form" onSubmit={handleSubmit} elevation={4}>
        <IconButton
            onClick={() => {
                if (user && canSendMessage) {
                    fileInputRef.current.click();
                }
            }}
            aria-label="Upload Image"
            disabled={!user || !canSendMessage}
        >
            <ImageIcon fontSize="large" />
        </IconButton>
        <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
            placeholder={
                isSending
                    ? 'Enviando...'
                    : canSendMessage
                        ? 'Escribe un mensaje...'
                        : 'No more free messages'
            }
            multiline
            maxRows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            inputProps={{ 'aria-label': 'Escribe un mensaje' }}
            disabled={isSending}
        />
        <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={(e) => {
                handleImageUpload(e);
                setImageSelected(e.target.files.length > 0);
            }}
            disabled={!canSendMessage}
        />
        {isSending ? (
            // Display Typing Indicator when sending
            <TypingIndicatorInline girl={girl} />
        ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
                <IconButton
                    type="submit"
                    color="primary"
                    disabled={!isPromptEntered || !canSendMessage||(imageSelected&&!isPromptEntered)}
                    aria-label="Send Message"
                >
                    <SendIcon sx={{ fontSize: 32 }} />
                </IconButton>
            </motion.div>
        )}
    </ChatInputStyled>
    )
};

export default ChatInputComponent;

