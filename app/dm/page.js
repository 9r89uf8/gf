// DMList.js
'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getChatList } from '@/app/services/chatService';
import {getGirls} from "@/app/services/girlsService";
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {useMultipleMessageResponder} from "@/app/components/hooks/UseMultipleMessageResponder";
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
    Skeleton,
    Stack,
    CardContent,
    CardActions,
    CardMedia,
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

// Styled component for girl cards
const GirlCard = styled(Card)(({ theme }) => ({
    width: 130,
    height: 230,
    margin: theme.spacing(0, 1.5),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'white',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    flex: '0 0 auto',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    },
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    margin: theme.spacing(1, 0),
}));

const StatusIndicator = styled(Box)(({ isActive }) => ({
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: isActive ? '#4CAF50' : '#FFA000',
    border: '2px solid white',
    animation: `${flash} ${isActive ? '2s' : '0s'} infinite`,
}));

const DMList = () => {
    const router = useRouter();
    const chats = useStore((state) => state.chats);
    const user = useStore((state) => state.user);
    const girls = useStore((state) => state.girls);
    const [loading, setLoading] = useState(true);

    useMultipleMessageResponder({
        userId: user?.uid,
        chats: chats || []
    });

    useEffect(() => {
        async function fetchChats() {
            await getGirls();
            if(user){
                await getChatList();
                setLoading(false);
            }
            setLoading(false);
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
                {/* Girls Grid Section */}
                {/*<Typography*/}
                {/*    variant="h5"*/}
                {/*    sx={{*/}
                {/*        mt: 4,*/}
                {/*        mb: 2,*/}
                {/*        color: 'white',*/}
                {/*        textAlign: 'center',*/}
                {/*        fontFamily: 'Anton, sans-serif',*/}
                {/*    }}*/}
                {/*>*/}
                {/*    Chicas Disponibles*/}
                {/*</Typography>*/}

                {!girls ? (
                    <Box
                        sx={{
                            overflowX: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            padding: '10px 0',
                            marginBottom: '20px',
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                            },
                        }}
                    >
                        {[...Array(5)].map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 200,
                                    height: 260,
                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 4,
                                    mx: 1.5,
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: '0 0 auto',
                                }}
                            >
                                <Skeleton variant="circular" width={100} height={100} />
                                <Skeleton variant="text" width={120} height={30} sx={{ mt: 2 }} />
                                <Skeleton variant="rectangular" width={140} height={40} sx={{ mt: 2 }} />
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
                            '&::-webkit-scrollbar': {
                                height: '8px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '4px',
                            },
                        }}
                    >
                        {girls.map((girl) => (
                            <GirlCard key={girl.id}>
                                <AvatarWrapper>
                                    <Link href={`/${girl.id}`} passHref>
                                    <Avatar
                                        src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                        alt={girl.name}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: '4px solid white',
                                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    </Link>
                                    <StatusIndicator isActive={girl.isActive} />
                                </AvatarWrapper>

                                <CardContent sx={{
                                    textAlign: 'center',
                                    p: 1,
                                    flex: '1 0 auto',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginTop: -5,
                                    marginBottom: -5
                                }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#333',
                                            mb: 0.5,
                                        }}
                                    >
                                        {girl.username}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ width: '100%', p: 2, pt: 0 }}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        disabled={girl ? girl.private : false}
                                        onClick={() => handleMessageClick(girl.id)}
                                        sx={{
                                            background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #023e8a 30%, #0096c7 90%)',
                                            },
                                            '&.Mui-disabled': {
                                                background: '#e0e0e0',
                                                color: '#9e9e9e',
                                            }
                                        }}
                                    >
                                        Mensaje
                                    </Button>
                                </CardActions>
                            </GirlCard>
                        ))}
                    </Box>
                )}

                {/* Messages Section - Keep the original styling */}
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

                                                        <Box sx={{
                                                            width: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '8px'
                                                        }}>
                                                            <Box sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '8px',
                                                                color: 'white',
                                                                fontWeight: 'bold',
                                                                fontSize: 12,
                                                            }}>
                                                                {chat.lastMessage?.mediaType === 'image' && (
                                                                    <>
                                                                        <PhotoCameraIcon fontSize="small" />
                                                                        {chat.lastMessage?.content || 'Sin mensajes'}
                                                                    </>
                                                                )}
                                                                {chat.lastMessage?.mediaType === 'audio' && (
                                                                    <>
                                                                        <AudiotrackIcon fontSize="small" />
                                                                        {chat.lastMessage?.content || 'Sin mensajes'}
                                                                    </>
                                                                )}
                                                                {chat.lastMessage?.mediaType === 'video' && (
                                                                    <>
                                                                        <VideocamIcon fontSize="small" />
                                                                        {chat.lastMessage?.content || 'Sin mensajes'}
                                                                    </>
                                                                )}
                                                                {chat.lastMessage?.mediaType === 'text' && (
                                                                    <Typography
                                                                        component="span"
                                                                        sx={{
                                                                            overflow: 'hidden',
                                                                            display: 'inline-block',
                                                                            width: '100%',
                                                                            '& span:nth-of-type(1)': { fontWeight: 'bold' },
                                                                            '& span:nth-of-type(2)': {
                                                                                opacity: 0.7,
                                                                                background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                                                                                WebkitBackgroundClip: 'text',
                                                                                WebkitTextFillColor: 'transparent',
                                                                            }
                                                                        }}
                                                                    >
                                                                        {chat.lastMessage?.message && (
                                                                            truncateWithEllipsis(chat.lastMessage?.message || 'Sin mensajes', 22)
                                                                        )}
                                                                    </Typography>
                                                                )}
                                                            </Box>

                                                            <Button
                                                                variant="contained"
                                                                fullWidth
                                                                onClick={() => handleMessageClick(chat.girlId)}
                                                                sx={{
                                                                    backgroundImage: 'linear-gradient(45deg, #FFFFFF, #E0E0E0)',
                                                                    color: 'black',
                                                                    padding: '6px 12px',
                                                                    borderRadius: '5px',
                                                                    fontWeight: 'bold',
                                                                    fontSize: 11,
                                                                    boxShadow: '0 2px 4px 1px rgba(255, 255, 255, .3)',
                                                                    '&:hover': {
                                                                        background: 'linear-gradient(45deg, #E0E0E0 30%, #FFFFFF 90%)',
                                                                    },
                                                                }}
                                                            >
                                                                {chat.lastMessage?.mediaType === 'image' && 'Ver imagen'}
                                                                {chat.lastMessage?.mediaType === 'audio' && 'Escuchar audio'}
                                                                {chat.lastMessage?.mediaType === 'video' && 'Ver video'}
                                                                {chat.lastMessage?.mediaType === 'text' && 'Ver mensaje'}
                                                                {!chat.lastMessage?.mediaType && 'Sin mensajes'}
                                                            </Button>
                                                        </Box>

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
                        </>
                    )}
                </GlassCard>
            </Container>
        </Box>
    );
};

export default DMList;
