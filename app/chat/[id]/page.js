// React component page Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import { getGirl } from '@/app/services/girlService';
import { checkIfCookie } from '@/app/services/authService';
import {getGirlTweet} from "@/app/services/girlService";
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
import {useMessageResponder} from "@/app/components/hooks/UseMessageResponder";

// Import the new components
import ChatInputComponent from '@/app/components/chat/ChatInputComponent';
import MediaPreviewComponent from "@/app/components/chat/MediaPreviewComponent";
import LoginReminder from '@/app/components/chat/LoginReminder';
import UpgradeReminder from '@/app/components/chat/UpgradeReminder';
import PrivateGirlReminder from '@/app/components/chat/PrivateGirlReminder';

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12),
}));

const Chat = ({params}) => {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const fileInputRef = useRef(null);
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const conversationHistory = useStore((state) => state.conversationHistory);
    const [isSending, setIsSending] = useState(false);
    const loadingGirl = useStore((state) => state.loadingGirl);
    const setLoadingGirl = useStore((state) => state.setLoadingGirl);
    const conversationLimits = useStore((state) => state.conversationLimits);

    useEffect(() => {
        const initializeData = async () => {
            setLoadingGirl(true);
            await checkIfCookie(); // Ensure the user data is available
            await getGirl({ id: params.id }); // Ensure the girl data is available
            await getGirlTweet({ id: params.id })
        };

        initializeData();
    }, [params.id]);

    // Add real-time chat subscription
    useRealtimeConversation({
        userId: user?.uid,
        girlId: params.id
    });

    useMessageResponder({
        userId: user?.uid,
        girlId: params.id
    });



    const handleBuy = () => {
        router.push('/premium'); // Adjust the path to your premium page
    };
    const [mediaSelected, setMediaSelected] = useState(false);
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);

    const handleMediaUpload = ({ file, preview, type }) => {
        setMedia(file);
        setMediaPreview(preview);
        setMediaSelected(true)
        setMediaType(type);
    };

    const handleClearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
        setMediaSelected(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if we have either text or media to send
        if (!prompt.trim() && !media) return;


        // Return early if user is not logged in or if the girl is private
        if (!user || (girl && girl.private)) return;

        setIsSending(true);

        const formData = new FormData();
        formData.append('userId', user.uid);
        formData.append('girlId', girl.id);

        if (media) {
            formData.append('media', media);
            formData.append('mediaType', mediaType);
        } else {
            formData.append('userMessage', prompt.trim());
        }

        //save the user message to firebase
        await saveUserMessage(formData);
        setPrompt('');
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
        setIsSending(false);
        setMediaSelected(false);

        //then we give the latest message from the user to the LLM
        //delete useMessageResponder before using the code below
        // if (!girl.girlIsTyping && girl.isActive) {
        //     await responseFromLLM(formData);
        // }
    };


    const handleLike = async ({id}) => {
        await likeMessage({ messageUid: id, girlId: girl.id});

    };

    const isPromptEntered = prompt.trim().length > 0;
    const canSendMessage = (user && !conversationLimits) || (user && conversationLimits && conversationLimits.freeMessages > 0)

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

            {/* Show private girl reminder when appropriate */}
            {isPromptEntered && user && girl && girl.private && (
                <PrivateGirlReminder />
            )}


            {/* Always show ChatInputComponent */}
            <ChatInputComponent
                handleSubmit={handleSubmit}
                user={user}
                canSendMessage={canSendMessage}
                fileInputRef={fileInputRef}
                handleMediaUpload={handleMediaUpload}
                isSending={isSending}
                prompt={prompt}
                setPrompt={setPrompt}
                isPromptEntered={isPromptEntered}
                girl={girl}
                mediaType={mediaType}
                mediaSelected={mediaSelected}
            />

            {/* Message about upgrading when user can't send messages */}
            {user && !canSendMessage && isPromptEntered && (
                <UpgradeReminder handleBuy={handleBuy} />
            )}

            {/* Image Preview */}
            {mediaPreview && (
                <MediaPreviewComponent
                    mediaPreview={mediaPreview}
                    mediaType={mediaType}
                    handleClearMedia={handleClearMedia}
                />
            )}
        </StyledContainer>
    );
};

export default Chat;





