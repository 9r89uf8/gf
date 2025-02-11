// DMList.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getChatList } from '@/app/services/chatService';
import {getGirls} from "@/app/services/girlsService";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { es } from 'date-fns/locale';
import {
    List,
    ListItem,
    Avatar,
    Button,
    Box,
    Typography,
    Grid,
    Container,
    Card,
    Skeleton, Stack,
} from '@mui/material';
import { styled, keyframes } from '@mui/system';
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";

const flash = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.2; }
    100% { opacity: 1; }
`;

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: theme.shape.borderRadius * 2,
    marginTop: theme.spacing(4),
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.2)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(4),
    userSelect: 'none',
}));

const GradientIcon = styled(Box)(({ theme }) => ({
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    borderRadius: '50%',
    padding: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
}));

const InfoBox = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: theme.spacing(2),
    marginBottom: 25,
    textAlign: 'center',
    color: 'white',
}));

const DMList = () => {
    const router = useRouter();
    const chats = useStore((state) => state.chats);
    const user = useStore((state) => state.user);
    const girls = useStore((state) => state.girls);
    const [loading, setLoading] = useState(true);

    //girls.filter((girl) => !girl.private).map

    useEffect(() => {
        async function fetchChats() {
            await getGirls();
            if(user){
                await getChatList();
                setLoading(false);
            }

        }
        fetchChats();
    }, []);


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

    function truncateWithEllipsis(text, maxLength) {
        return text && text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="lg">
                {/* Girls List Component */}
                {!girls ? (
                    <Box
                        sx={{
                            overflowX: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            marginBottom: '20px',
                        }}
                    >
                        {[...Array(5)].map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginRight: '10px',
                                }}
                            >
                                <Skeleton variant="circular" width={85} height={85} />
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

                        {girls.map((girl) => (
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
                                        sx={{
                                            width: 85,
                                            height: 85,
                                            cursor: 'pointer',
                                        }}
                                    />
                                </Link>
                                <Typography variant="subtitle1" sx={{ color: 'white', mt: 1 }}>
                                    {girl.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

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
                        Tus Chats
                    </Typography>

                    {user ? (
                        <>
                            <List>
                                {loading ? (
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
                                    chats.map((chat, index) => {
                                        const date = convertFirestoreTimestampToDate(chat.lastMessage?.timestamp);
                                        const dateLastSeenGirl = convertFirestoreTimestampToDate(chat.lastSeenGirl);
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
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <Box
                                                                sx={{
                                                                    width: 10,
                                                                    height: 10,
                                                                    borderRadius: '50%',
                                                                    backgroundColor: chat.isActive ? 'green' : 'red',
                                                                    marginRight: 1,
                                                                    animation: `${flash} ${chat.isActive ? '2s' : '2s'} infinite`,
                                                                }}
                                                            />
                                                            <Typography variant="body2" style={{ color: 'gray' }}>
                                                                {chat.isActive ? 'Activa' : 'Inactiva'}
                                                            </Typography>
                                                        </Box>
                                                        {!chat.isActive && dateLastSeenGirl && (
                                                            <Typography variant="body2" style={{ marginTop: 1, color: 'gray' }}>
                                                                Activa{' '}
                                                                {formatDistanceToNow(dateLastSeenGirl, { addSuffix: true, locale: es })}
                                                            </Typography>
                                                        )}
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
                                                                '&:hover': {
                                                                    background: 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)',
                                                                },
                                                            }}
                                                        >
                                                            {truncateWithEllipsis(chat.lastMessage?.content || 'Sin mensajes', 22)}
                                                        </Button>

                                                        <Typography variant="body2" sx={{ marginTop: 1, color: 'gray' }}>
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
                                        variant="h6"
                                        sx={{ textAlign: 'center', color: 'white', mt: 3 }}
                                    >
                                        No hay chats recientes
                                    </Typography>
                                )}
                            </List>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6" sx={{ textAlign: 'center', color: 'white', mt: 3, marginBottom: 2 }}>
                                Regístrate para textear
                            </Typography>

                            <InfoBox>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    Puedes recibir:
                                </Typography>
                                <Stack direction="row" spacing={4} justifyContent="center">
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <GradientIcon>
                                            <AudiotrackIcon fontSize="large" sx={{ color: 'white' }} />
                                        </GradientIcon>
                                        <Typography variant="body1">Audios</Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <GradientIcon>
                                            <PhotoCameraIcon fontSize="large" sx={{ color: 'white' }} />
                                        </GradientIcon>
                                        <Typography variant="body1">Imágenes</Typography>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <GradientIcon>
                                            <VideocamIcon fontSize="large" sx={{ color: 'white' }} />
                                        </GradientIcon>
                                        <Typography variant="body1">Videos</Typography>
                                    </Box>
                                </Stack>
                            </InfoBox>
                        </>
                    )}
                </GlassCard>
            </Container>
        </Box>
    );
};

export default DMList;
