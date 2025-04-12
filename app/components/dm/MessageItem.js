// components/MessageItem.js
import React from 'react';
import { ListItem, Grid, Avatar, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";
import { flash } from './DMListStyled';

const MessageItem = ({ chat, index, totalChats, onMessageClick, convertTimestamp, truncateWithEllipsis }) => {
    const date = convertTimestamp(chat.lastMessage?.timestamp);
    const dateLastSeenGirl = convertTimestamp(chat.lastSeenGirl);

    return (
        <ListItem
            sx={{
                borderBottom: index !== totalChats - 1 ? '1px solid grey' : 'none',
                mb: 2,
                alignItems: 'flex-start',
                paddingBottom: '25px',
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <Link href={`/${chat.girlId}`} passHref>
                        <Avatar
                            src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${chat.picture}/w=200,fit=scale-down`}
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
                            onClick={() => onMessageClick(chat.girlId)}
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
};

export default MessageItem;