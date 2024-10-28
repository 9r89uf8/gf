// Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from '@/app/services/girlService';
import { checkIfCookie } from '@/app/services/authService';
import {
    fetchMessages,
    saveUserMessage,
    sendChatPrompt,
    responseFromLLM,
    fetchAudios,
    likeMessage,
} from '@/app/services/chatService';
import {Box, CircularProgress, Container, styled} from '@mui/material';
import { useRouter } from 'next/navigation';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import GirlHeader from '@/app/components/chat/GirlHeader';
import {useRealtimeConversation} from "@/app/components/hooks/UseRealtimeChats";
import {useRealtimeGirlStatus} from "@/app/components/hooks/UseRealtimeGirlStatus";

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
    const conversationHistory = useStore((state) => state.conversationHistory);
    const [isSending, setIsSending] = useState(false);
    const loadingGirl = useStore((state) => state.loadingGirl);
    const setLoadingGirl = useStore((state) => state.setLoadingGirl);

    useEffect(() => {
        const initializeData = async () => {
            setLoadingGirl(true);
            await checkIfCookie(); // Ensure the user data is available
            await getGirl({ id: params.id }); // Ensure the girl data is available
        };

        initializeData();
    }, [params.id]);

    // Add real-time chat subscription
    useRealtimeConversation({
        userId: user?.uid,
        girlId: params.id
    });

    useRealtimeGirlStatus({
        userId: user?.uid,
        girlId: params.id
    });


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
        formData.append('girlId', girl.id);

        if (image) {
            formData.append('image', image);
            formData.append('userMessage', prompt.trim());
        } else {
            formData.append('userMessage', prompt.trim());
        }

        await saveUserMessage(formData);
        setPrompt('');
        setImage(null);
        setImagePreview(null);
        setIsSending(false);

        if(!girl.girlIsTyping&&girl.isActive){
            await responseFromLLM(formData)
        }

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

    return (
        <StyledContainer maxWidth="sm">
            {girl && <GirlHeader girl={girl} loadingGirl={loadingGirl}/>}

            {girl&&
                <ConversationHistory
                    conversationHistory={conversationHistory}
                    user={user}
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





