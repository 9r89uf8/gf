// ChatInputComponent.js
import React, { useState } from 'react';
import {
    Paper,
    IconButton,
    InputBase,
    styled,
    Typography,
    Box
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideocamIcon from '@mui/icons-material/Videocam';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';
import AudioRecorder from "@/app/components/chat/conversation/AudioRecorder";

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


const validateFile = (file) => {
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validVideoTypes = ['video/mp4', 'video/quicktime'];
    const maxVideoSize = 10 * 1024 * 1024; // 10MB in bytes

    if (validImageTypes.includes(file.type)) {
        return { valid: true, type: 'image' };
    } else if (validVideoTypes.includes(file.type)) {
        if (file.size > maxVideoSize) {
            return { valid: false, error: 'El vídeo debe tener menos de 10 MB.' };
        }
        return { valid: true, type: 'video' };
    }
    return { valid: false, error: 'Tipo de archivo no válido. Por favor sube una imagen o un vídeo.' };
};

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
                                handleMediaUpload,
                                isSending,
                                prompt,
                                setPrompt,
                                isPromptEntered,
                                girl,
                                mediaType,
                                mediaSelected
                            }) => {

    const [isRecording, setIsRecording] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validation = validateFile(file);
            if (validation.valid) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    handleMediaUpload({
                        file,
                        preview: reader.result,
                        type: validation.type
                    });
                };
                reader.readAsDataURL(file);
            } else {
                alert(validation.error);
                event.target.value = '';
            }
        }
    };

    const handleAudioRecorded = (audioBlob) => {
        const file = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' });
        handleMediaUpload({
            file,
            preview: URL.createObjectURL(audioBlob),
            type: 'audio'
        });
        setPrompt(''); // Clear any existing text
    };

    // Determine if the send button should be enabled
    const canSend = (
        canSendMessage &&
        !isRecording &&
        (
            isPromptEntered || // Has text
            (mediaType === 'audio') || // Has audio recording
            mediaSelected // Has other media with required text
                // (mediaSelected&&isPromptEntered) original
        )
    );

    // Determine if the text input should be shown
    const showTextInput = !isRecording && mediaType !== 'audio';

    return (
        <ChatInputStyled component="form" onSubmit={handleSubmit} elevation={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                    onClick={() => {
                        if (user && canSendMessage) {
                            fileInputRef.current.click();
                        }
                    }}
                    aria-label="Upload Media"
                    disabled={!user || !canSendMessage || isRecording}
                >
                    <ImageIcon fontSize="large" />
                </IconButton>

                {!mediaSelected && (
                    <AudioRecorder
                        onAudioRecorded={handleAudioRecorded}
                        isRecording={isRecording}
                        setIsRecording={setIsRecording}
                        canSendMessage={canSendMessage}
                    />
                )}
            </Box>

            {showTextInput && (
                <InputBase
                    sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
                    placeholder={
                        isSending
                            ? 'enviando mensaje...'
                            : isRecording
                                ? 'grabando un audio...'
                                : canSendMessage
                                    ? 'Escribe un mensaje...'
                                    : 'Escribe un mensaje...'
                    }
                    multiline
                    maxRows={6}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    inputProps={{ 'aria-label': 'Escribe un mensaje' }}
                    disabled={isRecording||mediaSelected}
                    // disabled={isRecording} original
                />
            )}

            {!showTextInput && (
                <Box sx={{ ml: 1, flex: 1 }} /> // Spacer to maintain layout
            )}

            <input
                type="file"
                accept="image/*,video/mp4,video/quicktime"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={!canSendMessage}
            />

            {isSending ? (
                <TypingIndicatorInline girl={girl} />
            ) : (
                <motion.div whileTap={{ scale: 0.95 }}>
                    <IconButton
                        type="submit"
                        color="primary"
                        disabled={!canSend||girl.private}
                        aria-label="Send Message"
                    >
                        <SendIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                </motion.div>
            )}
        </ChatInputStyled>
    );
};

export default ChatInputComponent;

