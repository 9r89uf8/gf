// DMList.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getChatList } from '@/app/services/chatService';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";
import { es } from 'date-fns/locale';
import {List, ListItem, Avatar, Button, Box, Typography, Grid, Container, Card} from '@mui/material';

const GlassCard = ({ children }) => (
    <Card
        sx={{
            textAlign: 'center',
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 5,
            marginTop: 4,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
            padding: 1,
            marginBottom: 4,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            msUserSelect: 'none',
        }}
    >
        {children}
    </Card>
);

const DMList = () => {
    const router = useRouter();
    const chats = useStore((state) => state.chats);
    const user = useStore((state) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChats() {
            await getChatList(); // Fetch and update the store
            setLoading(false);
        }
        fetchChats();
    }, []);

    // Helper function to convert Firestore timestamp
    function convertFirestoreTimestampToDate(timestamp) {
        if (!timestamp) return null;

        if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
            return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1e6);
        }

        if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
            return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
        }

        return new Date(timestamp);
    }

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };

    // Helper function to truncate text and add ellipsis
    function truncateWithEllipsis(text, maxLength) {
        return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    if (loading) {
        return (
            <Box sx={{ textAlign: 'center', color: 'white', mt: 3 }}>
                <Typography variant="subtitle1">Cargando chats...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Container maxWidth="lg">
                <GlassCard>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Anton, sans-serif',
                }}
            >
                Tus Chats
            </Typography>

            {user ? (
                <>
                    <List>
                        {chats && chats.length > 0 ? (
                            chats.map((chat, index) => {
                                const date = convertFirestoreTimestampToDate(chat.lastMessage?.timestamp);
                                return (
                                <ListItem
                                    key={index}
                                    sx={{
                                        borderBottom: index !== chats.length - 1 ? '1px solid grey' : 'none',
                                        mb: 2,
                                        alignItems: 'flex-start',
                                        paddingBottom: '25px',
                                    }}
                                >
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={4}>
                                            <Link href={`/girl/${chat.girlId}`} passHref>
                                                <Avatar
                                                    src={`https://d3sog3sqr61u3b.cloudfront.net/${chat.picture}`}
                                                    alt={`Foto de ${chat.girlName}`}
                                                    sx={{ width: 70, height: 70, borderRadius: '10%' }}
                                                />
                                            </Link>
                                        </Grid>

                                        <Grid item xs={8}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ fontFamily: 'Pacifico, cursive', marginBottom: 1 }}
                                            >
                                                {chat.girlName}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => handleMessageClick(chat.girlId)}
                                                sx={{
                                                    alignSelf: 'center',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)',
                                                    },
                                                    backgroundImage: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                                                    color: 'black',
                                                    padding: '10px 20px',
                                                    borderRadius: '5px',
                                                    fontWeight: 'bold',
                                                    fontSize: 12,
                                                    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .3)',
                                                    textOverflow: 'ellipsis',
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {truncateWithEllipsis(chat.lastMessage?.content || 'Sin mensajes', 22)}
                                            </Button>

                                            <Typography variant="body2" style={{ marginTop: 6, color: 'gray' }}>
                                                {date
                                                    ? formatDistanceToNow(date, {
                                                        addSuffix: true,
                                                        locale: es,
                                                    })
                                                    : 'Tiempo desconocido'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            )})
                        ) : (
                            <Typography
                                variant="subtitle1"
                                sx={{ textAlign: 'center', color: 'white', mt: 3 }}
                            >
                                No hay chats recientes
                            </Typography>
                        )}
                    </List>
                </>
            ) : (
                <Typography variant="subtitle1" sx={{ textAlign: 'center', color: 'white', mt: 3 }}>
                    Regístrate para ver los chats
                </Typography>
            )}
                </GlassCard>
            </Container>
        </Box>
    );
};

export default DMList;




