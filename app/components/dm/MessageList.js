// components/MessageList.js
'use client'
import React,{useEffect} from 'react';
import { getChatList } from '@/app/services/chatService';
import { useStore } from '@/app/store/store';
import { List, ListItem, Grid, Skeleton, Typography } from '@mui/material';
import MessageItem from './MessageItem';
import { GlassCard } from './DMListStyled';
import { useRouter } from 'next/navigation';
import { useMultipleMessageResponder } from "@/app/components/hooks/UseMultipleMessageResponder";
import { convertFirestoreTimestampToDate, truncateWithEllipsis } from '@/app/components/dm/messageUtils';

const MessageList = () => {
    const router = useRouter();
    const chats = useStore((state) => state.chats);
    const user = useStore((state) => state.user);

    useMultipleMessageResponder({
        userId: user?.uid,
        chats: chats || []
    });

    useEffect(() => {
        async function fetchChats() {
            if (user) {
                await getChatList();
            }
        }
        fetchChats();
    }, []);

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };
    return (
        <GlassCard>
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Anton, sans-serif',
                }}
            >
                Tus Mensajes
            </Typography>

            {user ? (
                <List>
                    {!chats ? (
                        [...Array(4)].map((_, index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    borderBottom: index !== 3 ? '1px solid grey' : 'none',
                                    mb: 2,
                                    alignItems: 'flex-start',
                                    paddingBottom: '25px',
                                }}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={4}>
                                        <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: '10%' }} />
                                    </Grid>

                                    <Grid item xs={8}>
                                        <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: 1 }} />
                                        <Skeleton variant="rectangular" width="100%" height={36} />
                                        <Skeleton variant="text" width="60%" height={20} sx={{ marginTop: 1 }} />
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ))
                    ) : chats && chats.length > 0 ? (
                        chats.map((chat, index) => (
                            <MessageItem
                                key={chat.girlId || index}
                                chat={chat}
                                index={index}
                                totalChats={chats.length}
                                onMessageClick={handleMessageClick}
                                convertTimestamp={convertFirestoreTimestampToDate}
                                truncateWithEllipsis={truncateWithEllipsis}
                            />
                        ))
                    ) : (
                        <Typography
                            variant="h6"
                            sx={{ textAlign: 'center', color: 'white', mt: 3 }}
                        >
                            No hay chats recientes
                        </Typography>
                    )}
                </List>
            ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', mt: 3, marginBottom: 2 }}>
                    Regístrate para textear
                </Typography>
            )}
        </GlassCard>
    );
};

export default MessageList;