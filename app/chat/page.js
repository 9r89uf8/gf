'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from '@/app/services/girlService';
import {
    fetchMessages,
    sendChatPrompt,
    fetchAudios,
    likeMessage,
} from '@/app/services/chatService';
import {
    Container,
    Paper,
    Typography,
    InputBase,
    Button,
    styled,
    alpha,
    IconButton,
    Avatar,
    Box,
    CircularProgress,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import Footer from '@/app/components/buyAction/Footer';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import { useRouter } from 'next/navigation';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(10),
}));

const Header = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: `${theme.spacing(2)} auto`,
    marginBottom: theme.spacing(4),
    color: theme.palette.common.white,
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    cursor: 'pointer',
    maxWidth: 400, // Set a maximum width
}));

const ImagePreview = styled('img')({
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    marginTop: '10px',
    borderRadius: '5px',
});

const ChatInput = styled(Paper)(({ theme }) => ({
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

const ActiveIndicator = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: '15px',
    height: '15px',
    backgroundColor: '#007BFF', // Blue color for the active indicator
    borderRadius: '50%',
    border: `2px solid ${theme.palette.background.paper}`,
    animation: 'pulse 2s infinite',
    '@keyframes pulse': {
        '0%': { transform: 'scale(1)', opacity: 1 },
        '50%': { transform: 'scale(1.5)', opacity: 0.7 },
        '100%': { transform: 'scale(1)', opacity: 1 },
    },
}));

const Chat = () => {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const audios = useStore((state) => state.audios);
    const jornada = useStore((state) => state.jornada);
    const conversationHistory = useStore((state) => state.conversationHistory);
    const messageSent = useStore((state) => state.messageSent);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        getGirl();
    }, []);

    useEffect(() => {
        if (user) {
            fetchMessages({ userId: user.uid });
            fetchAudios();
        }
    }, [user]);

    useEffect(() => {
        if (conversationHistory?.length > 0 && user) {
            const assistantMessage = conversationHistory[conversationHistory.length - 1];
            if (assistantMessage.role === 'assistant') {
                fetchAudios();
            }
        }
    }, [conversationHistory]);

    const handleProfileClick = () => {
        router.push('/01uIfxE3VRIbrIygbr2Q');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!prompt.trim() && !image) return;

        setIsSending(true);

        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('jornada', jornada);
        formData.append('audio', true);

        if (image) {
            formData.append('image', image);
        } else {
            formData.append('userMessage', prompt.trim());
        }

        await sendChatPrompt(formData);
        setPrompt('');
        setImage(null);
        setImagePreview(null);
        setIsSending(false);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClearImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleLike = async (messageId) => {
        await likeMessage({ messageUid: messageId });
    };

    const isPromptEntered = prompt.trim().length > 0 || image !== null;
    const canSendMessage = (user && user.freeMessages > 0) || !user;

    return (
        <StyledContainer maxWidth="sm">
            {conversationHistory?.length === 0 && girl && (
                <Header elevation={6} onClick={handleProfileClick}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                            sx={{ width: 86, height: 86, margin: '0 auto' }}
                        />
                        <ActiveIndicator />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                        {girl.username}{' '}
                        <CheckCircleIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
                    </Typography>
                </Header>
            )}

            <ConversationHistory
                conversationHistory={conversationHistory}
                user={user}
                audios={audios}
                handleLike={handleLike}
            />

            {canSendMessage ? (
                <ChatInput component="form" onSubmit={handleSubmit} elevation={4}>
                    <IconButton
                        onClick={() => fileInputRef.current.click()}
                        aria-label="Upload Image"
                    >
                        <ImageIcon />
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder={isSending ? 'Enviando...' : 'Escribe un mensaje...'}
                        multiline
                        minRows={1}
                        maxRows={4}
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
                        onChange={handleImageUpload}
                    />
                    {isSending ? (
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                    ) : (
                        <IconButton
                            type="submit"
                            color="primary"
                            disabled={!isPromptEntered || !user}
                            aria-label="Send Message"
                        >
                            <SendIcon />
                        </IconButton>
                    )}
                </ChatInput>
            ) : (
                <Footer />
            )}

            {imagePreview && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 70,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        padding: 2,
                        borderRadius: 1,
                    }}
                >
                    <ImagePreview src={imagePreview} alt="Selected" />
                    <Button
                        onClick={handleClearImage}
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ mt: 1 }}
                    >
                        Clear Image
                    </Button>
                </Box>
            )}
        </StyledContainer>
    );
};

export default Chat;

