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
import { Container, styled } from '@mui/material';
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
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        checkIfCookie();
        getGirl();
    }, []);

    useEffect(() => {
        if (user&&!conversationHistory) {
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

    const handleLike = async ({id, image}) => {
        if(!image){
            await likeMessage({ messageUid: id });
        }
    };

    const isPromptEntered = prompt.trim().length > 0 || image !== null;
    const canSendMessage = (user && user.freeMessages > 0) || !user;

    return (
        <StyledContainer maxWidth="sm">
            {girl && <GirlHeader girl={girl} handleProfileClick={handleProfileClick} />}

            <ConversationHistory
                conversationHistory={conversationHistory}
                user={user}
                audios={audios}
                handleLike={handleLike}
                girl={girl}
            />

            {/* Reminder to log in or register */}
            {isPromptEntered && !user && (
                <LoginReminder girl={girl} handleLoginRedirect={handleLoginRedirect} />
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





