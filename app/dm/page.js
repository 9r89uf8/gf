// DMList.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getChatList } from '@/app/services/chatService';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from "next/navigation";
import { es } from 'date-fns/locale';
import { List, ListItem, Avatar, Button, Box, Typography, Grid, Container, Card, Skeleton } from '@mui/material';

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
    const girls = useStore((state) => state.girls); // Assuming girls is an array of girl objects
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChats() {
            await getChatList(); // Fetch and update the store
            // If you need to fetch girls list, do it here
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

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <Container maxWidth="lg">

                {/* Girls List Component */}
                {loading ? (
                    <Box
                        sx={{
                            overflowX: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            marginBottom: '20px',
                        }}
                    >
                        {[1, 2, 3, 4, 5].map((item) => (
                            <Box
                                key={item}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginRight: '10px',
                                }}
                            >
                                <Skeleton variant="rectangular" width={85} height={85} sx={{ borderRadius: '10%' }} />
                                <Skeleton variant="text" width={60} height={30} sx={{ mt: 1 }} />
                            </Box>
                        ))}
                    </Box>
                ) : girls && girls.length > 0 && (
                    <Box
                        sx={{
                            overflowX: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            marginBottom: '20px',
                        }}
                    >
                        {girls.filter(girl => !girl.private).map((girl) => (
                            <Box
                                key={girl.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginRight: '10px',
                                }}
                            >
                                <Link href={`/chat/${girl.id}`} passHref>
                                    <Avatar
                                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                        alt={girl.name}
                                        sx={{ width: 85, height: 85, borderRadius: '10%', cursor: 'pointer' }}
                                    />
                                </Link>
                                <Typography variant="h6" sx={{ color: 'white' }}>
                                    {girl.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

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
                                {loading ? (
                                    [1, 2, 3, 4].map((item) => (
                                        <ListItem
                                            key={item}
                                            sx={{
                                                borderBottom: item !== 4 ? '1px solid grey' : 'none',
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
                                                        <Link href={`/${chat.girlId}`} passHref>
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
                                        );
                                    })
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






