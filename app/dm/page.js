//DM.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getChatList } from '@/app/services/chatService';
import { getGirls } from "@/app/services/girlsService";
import { useMultipleMessageResponder } from "@/app/components/hooks/UseMultipleMessageResponder";
import { useRouter } from 'next/navigation';
import { Box, Container } from '@mui/material';
import GirlsCarousel from "@/app/components/dm/GirlsCarousel";
import MessageList from '@/app/components/dm/MessageList';
import { convertFirestoreTimestampToDate, truncateWithEllipsis } from '@/app/components/dm/messageUtils';

const DMList = () => {
    const router = useRouter();
    const chats = useStore((state) => state.chats);
    const user = useStore((state) => state.user);
    const girls = useStore((state) => state.girls);
    const [loading, setLoading] = useState(true);
    const isPremium = user && user.premium;

    useMultipleMessageResponder({
        userId: user?.uid,
        chats: chats || []
    });

    useEffect(() => {
        async function fetchChats() {
            await getGirls();
            if (user) {
                await getChatList();
                setLoading(false);
            }
            setLoading(false);
        }
        fetchChats();
    }, []);

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };

    const handlePremium = () => {
        router.push('/premium');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="lg">
                <GirlsCarousel
                    girls={girls}
                    loading={loading}
                    isPremium={isPremium}
                    onMessageClick={handleMessageClick}
                    onPremiumClick={handlePremium}
                />

                <MessageList
                    loading={loading}
                    user={user}
                    chats={chats}
                    convertTimestamp={convertFirestoreTimestampToDate}
                    truncateWithEllipsis={truncateWithEllipsis}
                    onMessageClick={handleMessageClick}
                />
            </Container>
        </Box>
    );
};

export default DMList;
