'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from '@/app/services/girlService';
import {checkIfCookie} from "@/app/services/authService";
import {
    fetchMessages,
    sendChatPrompt,
    fetchAudios,
    likeMessage,
} from '@/app/services/chatService';
import {
    Container,
    Paper,
    InputBase,
    Button,
    styled,
    IconButton,
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import Footer from '@/app/components/buyAction/Footer';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import { useRouter } from 'next/navigation';
import GirlHeader from '@/app/components/chat/GirlHeader';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12)
}));

const ChatInput = styled(Paper)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(1),
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 'sm',
    margin: '0 auto',
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1000,
}));

const ImagePreview = styled('img')({
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    marginTop: '10px',
    borderRadius: '5px',
});

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
        checkIfCookie()
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
        router.push('/novia-virtual');
    };

    const handleLoginRedirect = () => {
        router.push('/login'); // Adjust the path to your login or register page
    };

    const handleBuy = () => {
        router.push('/premium'); // Adjust the path to your login or register page
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
            {girl && (
                <GirlHeader girl={girl} handleProfileClick={handleProfileClick} />
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
                        bottom: 110,
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



            {/* Always show ChatInput, but disable when canSendMessage is false */}
            <ChatInput component="form" onSubmit={handleSubmit} elevation={4}>
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
                    onChange={handleImageUpload}
                    disabled={!canSendMessage}
                />
                {isSending ? (
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                ) : (
                    <IconButton
                        type="submit"
                        color="primary"
                        disabled={!isPromptEntered || !canSendMessage}
                        aria-label="Send Message"
                    >
                        <SendIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                )}
            </ChatInput>

            {/* Message about upgrading when user can't send messages */}
            {user && !canSendMessage && isPromptEntered && (
                <Paper
                    elevation={4}
                    sx={{
                        position: 'fixed',
                        bottom: 80,
                        left: 0,
                        right: 0,
                        margin: '0 auto',
                        padding: 2,
                        marginBottom: 3,
                        textAlign: 'center',
                        zIndex: 1000,
                        maxWidth: '300px',
                        background: 'linear-gradient(45deg, #343a40, #212529)',
                        color: 'white',
                        borderRadius: 5,
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 1 }}>
                        Has utilizado todos tus mensajes gratuitos.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBuy}
                        sx={{ fontSize: 20, margin: '8px 0px 8px 0px' }}
                    >
                        obtener más
                    </Button>
                </Paper>
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



