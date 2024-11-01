// Chat.js
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '@/app/store/store';
import {getMessagesTest} from "@/app/services/chatService";
import { checkIfCookie } from '@/app/services/authService';
import {
    likeMessage,
} from '@/app/services/chatService';
import {Box, CircularProgress, Container, styled} from '@mui/material';
import { useRouter } from 'next/navigation';
import ConversationHistory from '@/app/components/chat/ConversationHistory';
import GirlHeader from '@/app/components/chat/GirlHeader';

import MediaPreviewComponent from "@/app/components/chat/MediaPreviewComponent";

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    paddingBottom: theme.spacing(12),
}));

const ChatTest = () => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const conversationHistory = useStore((state) => state.conversationHistory);
    const loadingGirl = useStore((state) => state.loadingGirl);

    useEffect(() => {
        const initializeData = async () => {
            await getMessagesTest({ id: 'BgHd9LWDnFFhS6BoaqwL' }); // Ensure the girl data is available
        };

        initializeData();
    }, []);


    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);



    const handleClearMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
    };



    const handleLike = async ({id}) => {
        await likeMessage({ messageUid: id, girlId: girl.id});

    };


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

export default ChatTest;