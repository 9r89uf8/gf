'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import {getGirl} from "@/app/services/girlService";
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import { fetchMessages, sendChatPrompt, fetchAudios, likeMessage } from '@/app/services/chatService';
import { Container, Paper, Typography, InputBase, Button, styled, alpha, FormControlLabel, Switch, IconButton, Avatar, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Footer from "@/app/components/buyAction/Footer";
import {useRouter} from "next/navigation";


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
    color: '#ffffff',
    background: 'linear-gradient(45deg, #343a40, #001219)',
    backdropFilter: 'blur(10px)',
    borderRadius: 10,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
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
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    useEffect(() => {
        getGirl()
    }, []);

    const handleProfileClick = () => {
        router.push('/01uIfxE3VRIbrIygbr2Q');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('jornada', jornada);
        formData.append('audio', isAudioEnabled);

        if (image) {
            formData.append('image', image);
        } else {
            formData.append('userMessage', prompt);
        }

        await sendChatPrompt(formData);
        setPrompt('');
        setImage(null);
        setImagePreview(null);
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

    const handleLike = async (messageId) => {
        const formData = { messageUid: messageId };
        await likeMessage(formData);
    };

    useEffect(() => {
        if (user) {
            fetchMessages({ userId: user.uid });
            fetchAudios();
        }
    }, [user]);

    useEffect(() => {
        if (conversationHistory && conversationHistory.length > 0 && user) {
            const assistantMessage = conversationHistory[conversationHistory.length - 1];
            if (assistantMessage.role === 'assistant') {
                fetchAudios();
            }
        }
    }, [conversationHistory]);

    const isPromptEntered = prompt.trim().length > 0 || image !== null;


    return (
        <Container maxWidth="sm">
            <ConversationHistory
                conversationHistory={conversationHistory}
                user={user}
                audios={audios}
                handleLike={handleLike}
            />
            {conversationHistory && conversationHistory.length <= 0 && (
                <Item elevation={6}>
                    {girl&&
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Avatar src={'https://d3sog3sqr61u3b.cloudfront.net/'+girl.picture} sx={{ width: 56, height: 56 }} onClick={() => handleProfileClick()} />
                            </div>
                            <Typography variant="h5" gutterBottom style={{ marginBottom: 3, marginTop: 7 }} onClick={() => handleProfileClick()}>
                                {girl.username} <CheckCircleIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
                            </Typography>
                        </>
                    }

                </Item>
            )}

            {(user && user.freeMessages > 0) || !user ? (
                <Paper
                    elevation={4}
                    component="form"
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        borderRadius: 5,
                        position: 'fixed',
                        bottom: 1,
                        left: 0,
                        right: 0,
                        width: '100%',
                        maxWidth: 'sm',
                        backgroundColor: '#fff',
                        zIndex: 1000,
                    }}
                    onSubmit={handleSubmit}
                >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <InputBase
                            sx={{ ml: 1, flex: 1, padding: 2 }}
                            placeholder={messageSent ? 'Escribiendo...' : 'Escribe algo...'}
                            multiline
                            required={!image}
                            minRows={1}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            maxRows={4}
                            inputProps={{ 'aria-label': 'chat input' }}
                            disabled={image !== null}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                        />
                        <IconButton onClick={() => fileInputRef.current.click()}>
                            <ImageIcon />
                        </IconButton>
                        {isPromptEntered && (
                            <Button
                                type="submit"
                                disabled={!isPromptEntered || messageSent || !user}
                                style={{ marginLeft: 8 }}
                            >
                                Enviar
                            </Button>
                        )}
                    </div>
                    {imagePreview && (
                        <ImagePreview src={imagePreview} alt="Selected Image" />
                    )}
                </Paper>
            ) : (
                <Footer />
            )}




        </Container>
    );
};

export default Chat;
