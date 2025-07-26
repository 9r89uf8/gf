// components/MessageItem.js
import React from 'react';
import { ListItem, Avatar, Typography, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VideocamIcon from "@mui/icons-material/Videocam";

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 80,
    height: 80,
    border: '3px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const MessageButton = styled(Button)(({ theme }) => ({
    borderRadius: 12,
    padding: '8px 20px',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'none',
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    color: 'white',
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
    },
}));

const MessageItem = ({ chat, index, totalChats, onMessageClick, convertTimestamp, truncateWithEllipsis }) => {
    const date = convertTimestamp(chat.lastMessage?.timestamp);
    const [imageError, setImageError] = React.useState(false);
    
    // Default fallback image - using a data URI for a simple gray placeholder
    const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23e0e0e0"/%3E%3Ctext x="40" y="40" text-anchor="middle" dy=".3em" fill="%23999" font-family="Arial" font-size="12"%3E%3F%3C/text%3E%3C/svg%3E';
    
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <ListItem
            sx={{
                borderBottom: index !== totalChats - 1 ? '1px solid rgba(0, 0, 0, 0.1)' : 'none',
                mb: 2,
                alignItems: 'flex-start',
                paddingBottom: '20px',
                paddingTop: '20px',
                px: 2,
                display: 'flex',
                gap: 3,
            }}
        >
            {/* Avatar Column */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minWidth: 'fit-content'
            }}>
                <Link href={`/${chat.girlId}`} passHref style={{ textDecoration: 'none' }}>
                    <StyledAvatar
                        src={imageError || !chat.picture ? fallbackImage : chat.picture}
                        alt={`Foto de ${chat.girlName}`}
                        onError={handleImageError}
                    />
                </Link>
                <Typography
                    variant="body2"
                    sx={{ 
                        mt: 1,
                        fontWeight: 600,
                        color: 'rgba(15, 23, 42, 0.95)',
                        textAlign: 'center',
                        maxWidth: 100,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {chat.girlName}
                </Typography>
            </Box>

            {/* Message Content Column */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Message Content */}

                <Box sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: 2,
                    p: 2,
                    mb: 2,
                    flex: 1,
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: 'rgba(51, 65, 85, 0.95)',
                        mb: 1,
                    }}>
                        {chat.lastMessage?.mediaType === 'image' && (
                            <>
                                <PhotoCameraIcon fontSize="small" sx={{ color: '#1a1a1a' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Foto enviada
                                </Typography>
                            </>
                        )}
                        {chat.lastMessage?.mediaType === 'audio' && (
                            <>
                                <AudiotrackIcon fontSize="small" sx={{ color: '#1a1a1a' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Audio enviado
                                </Typography>
                            </>
                        )}
                        {chat.lastMessage?.mediaType === 'video' && (
                            <>
                                <VideocamIcon fontSize="small" sx={{ color: '#1a1a1a' }} />
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    Video enviado
                                </Typography>
                            </>
                        )}
                        {(!chat.lastMessage?.mediaType || chat.lastMessage?.mediaType === 'text') && (
                            <Typography
                                variant="body2"
                                sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: 1.5,
                                    color: 'rgba(15, 23, 42, 0.8)',
                                    maxHeight: '3em', // 2 lines * 1.5 line height
                                }}
                            >
                                {chat.lastMessage?.content ? 
                                    (chat.lastMessage.content.length > 60 ? 
                                        chat.lastMessage.content.substring(0, 60) + '...' : 
                                        chat.lastMessage.content
                                    ) : 
                                    'Sin mensajes'
                                }
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Action Button */}
                <MessageButton
                    onClick={() => onMessageClick(chat.girlId)}
                    fullWidth
                >
                    {chat.lastMessage?.mediaType === 'image' && 'Ver imagen'}
                    {chat.lastMessage?.mediaType === 'audio' && 'Escuchar audio'}
                    {chat.lastMessage?.mediaType === 'video' && 'Ver video'}
                    {(chat.lastMessage?.mediaType === 'text' || (chat.lastMessage?.content && !chat.lastMessage?.mediaType)) && 'Ver mensaje'}
                    {!chat.lastMessage && 'Iniciar conversación'}
                </MessageButton>
                
                {/* Timestamp */}
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'rgba(71, 85, 105, 0.6)', 
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        mt: 1
                    }}
                >
                    {date
                        ? formatDistanceToNow(date, {
                            addSuffix: true,
                            locale: es,
                        })
                        : 'Tiempo desconocido'}
                </Typography>
            </Box>
        </ListItem>
    );
};

export default MessageItem;