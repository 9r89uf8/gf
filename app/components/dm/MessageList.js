// components/MessageList.js
'use client'
import React,{useEffect} from 'react';
import { getChatList } from '@/app/services/chatService';
import { useStore } from '@/app/store/store';
import { List, ListItem, Grid, Skeleton, Typography } from '@mui/material';
import MessageItem from './MessageItem';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';
import { useRouter } from 'next/navigation';
import { convertFirestoreTimestampToDate, truncateWithEllipsis } from '@/app/components/dm/messageUtils';

const MessageList = ({ initialUser }) => {
    const router = useRouter();
    const chats = useStore((state) => state.chatsV2);
    const user = useStore((state) => state.user);
    const setUser = useStore((state) => state.setUser);

    // Set user in store if provided as prop
    useEffect(() => {
        if (initialUser && !user) {
            setUser(initialUser);
        }
    }, [initialUser, user, setUser]);

    useEffect(() => {
        async function fetchChats() {
            const currentUser = user || initialUser;
            if (currentUser) {
                await getChatList();
            }
        }
        fetchChats();
    }, [user, initialUser]);

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };
    return (
        <ModernCard variant="elevated" animate={true} sx={{ mt: 4 }}>
            <CardContentWrapper>
                <Typography
                    variant="h5"
                    sx={{
                        mb: 3,
                        color: 'rgba(15, 23, 42, 0.95)',
                        textAlign: 'center',
                        fontWeight: 700,
                    }}
                >
                    Tus Mensajes
                </Typography>

            {(user || initialUser) ? (
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
                                    <Grid item size={4}>
                                        <Skeleton variant="rectangular" width={70} height={70} sx={{ borderRadius: '10%', bgcolor: 'rgba(0, 0, 0, 0.11)' }} />
                                    </Grid>

                                    <Grid item size={8}>
                                        <Skeleton variant="text" width="80%" height={30} sx={{ marginBottom: 1, bgcolor: 'rgba(0, 0, 0, 0.11)' }} />
                                        <Skeleton variant="rectangular" width="100%" height={36} sx={{ bgcolor: 'rgba(0, 0, 0, 0.11)' }} />
                                        <Skeleton variant="text" width="60%" height={20} sx={{ marginTop: 1, bgcolor: 'rgba(0, 0, 0, 0.11)' }} />
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
                            sx={{ textAlign: 'center', color: 'rgba(71, 85, 105, 0.8)', mt: 3 }}
                        >
                            No hay chats recientes
                        </Typography>
                    )}
                </List>
            ) : (
                <Typography variant="h6" sx={{ textAlign: 'center', color: 'rgba(71, 85, 105, 0.8)', mt: 3, marginBottom: 2 }}>
                    Regístrate para textear
                </Typography>
            )}
            </CardContentWrapper>
        </ModernCard>
    );
};

export default MessageList;