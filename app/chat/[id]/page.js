// Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from '@/app/services/girlService';
import { checkIfCookie } from '@/app/services/authService';
import {
    fetchMessages,
    sendChatPrompt,
    fetchAudios,
    likeMessage,
} from '@/app/services/chatService';
import {Box, CircularProgress, Container, styled} from '@mui/material';
import { useRouter } from 'next/navigation';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import GirlHeader from '@/app/components/chat/GirlHeader';

// Import the new components
import ChatInputComponent from '@/app/components/chat/ChatInputComponent';
import ImagePreviewComponent from '@/app/components/chat/ImagePreviewComponent';
import LoginReminder from '@/app/components/chat/LoginReminder';
import UpgradeReminder from '@/app/components/chat/UpgradeReminder';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12),
}));

const Chat = ({params}) => {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const audios = useStore((state) => state.audios);
    const shouldGetAudios = useStore((state) => state.audioBoolean);
    const jornada = useStore((state) => state.jornada);
    const conversationHistory = useStore((state) => state.conversationHistory);
    const [isSending, setIsSending] = useState(false);
    const loadingGirl = useStore((state) => state.loadingGirl);
    const setLoadingGirl = useStore((state) => state.setLoadingGirl);
    const chats = useStore((state) => state.chats);
    const [chat, setChat] = useState(null);

    useEffect(() => {
        const initializeData = async () => {
            setLoadingGirl(true);
            await checkIfCookie(); // Ensure the user data is available
            await getGirl({ id: params.id }); // Ensure the girl data is available
        };

        initializeData();
    }, [params.id]);

    // Update chat when chats or girl changes
    useEffect(() => {
        if (chats && girl) {
            const foundChat = chats.find((chat) => chat.girlId === girl.id);
            setChat(foundChat);
        }
    }, [chats, girl]);

    useEffect(() => {
        if (user && girl) {
            fetchMessages({ userId: user.uid, girlId: girl.id });
            fetchAudios({ girlId: girl.id });
        }
    }, [user, girl]);


    useEffect(() => {
        if (conversationHistory?.length > 0 && user) {
            const assistantMessage = conversationHistory[conversationHistory.length - 1];
            if (assistantMessage.role === 'assistant'&&shouldGetAudios) {
                fetchAudios({girlId: params.id });
            }
        }
    }, [conversationHistory]);


    const handleLoginRedirect = () => {
        router.push('/login'); // Adjust the path to your login or register page
    };

    const handleBuy = () => {
        router.push('/premium'); // Adjust the path to your premium page
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
        formData.append('girlId', girl.id);
        formData.append('audio', true);

        if (image) {
            formData.append('image', image);
            formData.append('userMessage', prompt.trim());
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

    const handleLike = async ({id}) => {
        await likeMessage({ messageUid: id, girlId: girl.id});

    };

    const isPromptEntered = prompt.trim().length > 0;
    const canSendMessage = (user && user.freeMessages > 0) || !user;

    // if (gettingGirl) {
    //     return (
    //         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //             <CircularProgress />
    //         </Box>
    //     );
    // }

    return (
        <StyledContainer maxWidth="sm">
            {girl && <GirlHeader girl={girl} chat={chat} loadingGirl={loadingGirl}/>}

            {girl&&
                <ConversationHistory
                    conversationHistory={conversationHistory}
                    user={user}
                    audios={audios}
                    handleLike={handleLike}
                    girl={girl}
                    loading={loadingGirl}
                />
            }


            {/* Reminder to log in or register */}
            {isPromptEntered && !user && (
                <LoginReminder />
            )}

            {/* Always show ChatInputComponent */}
            <ChatInputComponent
                handleSubmit={handleSubmit}
                user={user}
                canSendMessage={canSendMessage}
                fileInputRef={fileInputRef}
                handleImageUpload={handleImageUpload}
                isSending={isSending}
                prompt={prompt}
                setPrompt={setPrompt}
                isPromptEntered={isPromptEntered}
                girl={girl} // Pass the girl prop
            />

            {/* Message about upgrading when user can't send messages */}
            {user && !canSendMessage && isPromptEntered && (
                <UpgradeReminder handleBuy={handleBuy} />
            )}

            {/* Image Preview */}
            {imagePreview && (
                <ImagePreviewComponent
                    imagePreview={imagePreview}
                    handleClearImage={handleClearImage}
                />
            )}
        </StyledContainer>
    );
};

export default Chat;





