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
    paddingBottom: theme.spacing(12), // Increased padding to accommodate larger ChatInput
}));

const Header = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    margin: `${theme.spacing(2)} auto`,
    marginBottom: 90,
    color: theme.palette.common.white,
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    maxWidth: 300, // Set a maximum width
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
    padding: theme.spacing(2), // Increased padding for a larger input area
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

    const handleLoginRedirect = () => {
        router.push('/login'); // Adjust the path to your login or register page
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!prompt.trim() && !image) return;

        if (!user) {
            // User is not logged in; prevent submission
            return;
        }

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
                <Header elevation={6}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                            sx={{ width: 100, height: 100, margin: '0 auto' }}
                        />
                        <ActiveIndicator />
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                        {girl.username}{' '}
                        <CheckCircleIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleProfileClick}
                    >
                        View Profile
                    </Button>
                </Header>
            )}

            <ConversationHistory
                conversationHistory={conversationHistory}
                user={user}
                audios={audios}
                handleLike={handleLike}
            />

            {/* Reminder to log in or register */}
            {isPromptEntered && !user && (
                <Paper
                    elevation={4}
                    sx={{
                        position: 'fixed',
                        bottom: 110, // Adjusted to appear above ChatInput
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        padding: 2,
                        textAlign: 'center',
                        zIndex: 1000,
                        maxWidth: '300px',
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        You need to log in or register to chat with {girl?.username}.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginRedirect}
                    >
                        Log In or Register
                    </Button>
                </Paper>
            )}

            {canSendMessage ? (
                <ChatInput component="form" onSubmit={handleSubmit} elevation={4}>
                    <IconButton
                        onClick={() => fileInputRef.current.click()}
                        aria-label="Upload Image"
                        disabled={!user}
                    >
                        <ImageIcon fontSize='large'/>
                    </IconButton>
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }} // Increased font size for a bigger input
                        placeholder={isSending ? 'Enviando...' : 'Escribe un mensaje...'}
                        multiline
                        maxRows={6} // Increased maximum rows
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
                            disabled={!isPromptEntered || (!user && isPromptEntered)}
                            aria-label="Send Message"
                        >
                            <SendIcon sx={{ fontSize: 32 }}/>
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


