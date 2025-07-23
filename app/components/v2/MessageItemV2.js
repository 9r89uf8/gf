// app/components/v2/MessageItemV2.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Paper, IconButton, CircularProgress, Modal } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import Link from 'next/link';
import FloatingHearts from './FloatingHearts';
import { Stream } from "@cloudflare/stream-react";

const MessageItemV2 = ({ message, user, girl, onLikeMessage }) => {
    const isUser = message.role === 'user';
    const [showHearts, setShowHearts] = useState(false);
    const [hasTriggeredHearts, setHasTriggeredHearts] = useState(false);
    const [showUserLikeHearts, setShowUserLikeHearts] = useState(false);
    const [enlargedImage, setEnlargedImage] = useState(null);
    const [isLiking, setIsLiking] = useState(false);
    
    // Trigger hearts animation when AI likes a user message
    useEffect(() => {
        if (isUser && message.liked && message.likedBy === 'ai' && !hasTriggeredHearts) {
            setShowHearts(true);
            setHasTriggeredHearts(true);
            // Reset after animation to allow retriggering if needed
            setTimeout(() => setShowHearts(false), 3000);
        }
    }, [isUser, message.liked, message.likedBy, hasTriggeredHearts]);
    
    // Handle user liking AI message
    const handleLikeClick = async () => {
        // Prevent double-clicks and only allow liking AI messages that aren't already liked
        if (isLiking || isUser || message.liked) return;
        
        setIsLiking(true);
        
        // Trigger hearts animation for AI messages
        setShowUserLikeHearts(true);
        setTimeout(() => setShowUserLikeHearts(false), 3000);
        
        try {
            // Call the original like function
            await onLikeMessage(message.id);
        } catch (error) {
            // Error is handled in the parent component, just log it here
            console.error('Like failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    // Extract video ID from Cloudflare Stream iframe URL
    const extractVideoId = (url) => {
        if (!url) return null;
        // Check if it's an iframe.videodelivery.net URL
        const match = url.match(/iframe\.videodelivery\.net\/([a-zA-Z0-9]+)/);
        if (match) {
            return match[1];
        }
        return null;
    };


    return (
        <Box 
            mb={3}
            display="flex"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
            position="relative"
            sx={{
                mr: isUser ? 2.5 : '50%',  // User messages all the way right, assistant messages take max 50% width
                ml: isUser ? '50%' : 2.5   // Assistant messages all the way left, user messages take max 50% width
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    width: '100%',
                    position: 'relative'
                }}
            >
                {/* Avatar positioned above the message */}
                {!isUser && girl && (
                    <Avatar
                        src={girl.picture ? 
                            `https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down` : 
                            girl.profileImage
                        }
                        sx={{
                            width: 28,
                            height: 28,
                            mb: 0.5,
                            cursor: 'pointer',
                            backgroundImage: 'linear-gradient(to right, #ff8fab, #fb6f92)',
                            alignSelf: 'flex-start'
                        }}
                        component={Link}
                        href={`/${girl.id}`}
                    />
                )}
                
                {isUser && user && user.profilePic && (
                    <Avatar
                        src={user.profilePic}
                        sx={{
                            width: 28,
                            height: 28,
                            mb: 0.5,
                            cursor: 'pointer',
                            alignSelf: 'flex-end'
                        }}
                        component={Link}
                        href="/premium"
                    />
                )}
                
                <Paper
                    elevation={0}
                    sx={{ 
                        px: 2,
                        py: 1,
                        bgcolor: isUser ? '#0095f6' : '#e4e6eb', 
                        color: isUser ? 'white' : 'black',
                        borderRadius: 4,
                        wordBreak: 'break-word'
                    }}
                >
                    {message.error && message.mediaType !== 'image' && message.mediaType !== 'audio' && (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                bgcolor: isUser ? 'rgba(255,255,255,0.1)' : 'rgba(255,193,7,0.1)',
                                borderRadius: 2,
                                p: 1,
                                mb: message.content ? 1 : 0
                            }}
                        >
                            {/*<ErrorOutlineIcon*/}
                            {/*    sx={{*/}
                            {/*        fontSize: 18,*/}
                            {/*        color: isUser ? 'rgba(255,255,255,0.8)' : '#ff9800',*/}
                            {/*        flexShrink: 0,*/}
                            {/*        mt: 0.2*/}
                            {/*    }}*/}
                            {/*/>*/}
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.875rem',
                                    fontStyle: 'italic',
                                    color: isUser ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.7)'
                                }}
                            >
                                {message.error}
                            </Typography>
                        </Box>
                    )}
                    {message.content && message.mediaType !== 'image' && message.mediaType !== 'audio' && message.mediaType !== 'video' && (
                        <Typography variant="h6">{message.content}</Typography>
                    )}

                    {(message.mediaUrl || message.audioData) && (
                        <Box mt={1}>
                            {message.mediaType === 'image' && message.mediaUrl && (
                                <img 
                                    src={message.mediaUrl}
                                    alt="Message" 
                                    style={{ 
                                        maxWidth: '200px', 
                                        borderRadius: '8px',
                                        display: 'block',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setEnlargedImage(message.mediaUrl)}
                                />
                            )}
                            {message.mediaType === 'video' && message.mediaUrl && (
                                (() => {
                                    const videoId = extractVideoId(message.mediaUrl);
                                    if (videoId) {
                                        // Use Stream component for Cloudflare Stream videos
                                        return (
                                            <Box sx={{
                                                width: '200px',
                                                aspectRatio: '16/9',
                                                borderRadius: '8px',
                                                backgroundColor: '#000',
                                                '& iframe': {
                                                    width: '100%',
                                                    height: '100%',
                                                    border: 'none',
                                                }
                                            }}>
                                                <Stream 
                                                    controls
                                                    src={videoId}
                                                    autoplay={false}
                                                    muted={false}
                                                    preload="metadata"
                                                />
                                            </Box>
                                        );
                                    } else {
                                        // Fallback to regular video tag for non-Cloudflare videos
                                        return (
                                            <video 
                                                controls 
                                                style={{ 
                                                    maxWidth: '200px', 
                                                    borderRadius: '8px' 
                                                }}
                                            >
                                                <source src={message.mediaUrl} type="video/mp4" />
                                                <source src={message.mediaUrl} type="video/webm" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    }
                                })()
                            )}
                            {message.mediaType === 'audio' && message.audioData && (
                                <audio 
                                        controls
                                        style={{ 
                                            width: '200px',
                                            height: '40px',
                                            display: 'block'
                                        }}
                                    >
                                        <source src={message.audioData} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                            )}
                        </Box>
                    )}

                    {/* Show text content below media for image/video messages */}
                    {message.content && (message.mediaUrl || message.audioData) && message.mediaType !== 'audio' && !isUser && (
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            {message.content}
                        </Typography>
                    )}

                    {message.displayLink && (
                        <Box mt={1}>
                            <Link href="/products" style={{ textDecoration: 'none' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Typography
                                        variant="h7"
                                        sx={{
                                            color: isUser ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.6)',
                                            mb: 0.5
                                        }}
                                    >
                                        Comprar
                                    </Typography>
                                    <Box
                                        sx={{
                                            background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 30%, #FE6B8B 60%, #FF8E53 90%)',
                                            borderRadius: '20px',
                                            padding: '6px 16px',
                                            display: 'inline-block',
                                            boxShadow: '0 3px 10px 2px rgba(255, 105, 135, .3)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 5px 15px 3px rgba(255, 105, 135, .4)',
                                                background: 'linear-gradient(45deg, #FF8E53 0%, #FE6B8B 30%, #FF6B6B 60%, #FE6B8B 90%)',
                                            }
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontSize: '0.8rem',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            ✨ Premium
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                        </Box>
                    )}

                    {/* Heart icon at bottom right for assistant messages (non-audio) */}
                    {!isUser && message.mediaType !== 'audio' && (
                        <Box display="flex" justifyContent="flex-end" mt={0.5}>
                            <IconButton 
                                size="small"
                                onClick={handleLikeClick}
                                disabled={isLiking}
                                sx={{ 
                                    p: 0.5,
                                    opacity: isLiking ? 0.5 : 1,
                                    transition: 'opacity 0.2s'
                                }}
                            >
                                {message.liked ? 
                                    <FavoriteIcon sx={{ fontSize: 16, color: '#ed4956' }} /> : 
                                    <FavoriteBorderIcon sx={{ fontSize: 16, color: isLiking ? '#ed4956' : undefined }} />
                                }
                            </IconButton>
                        </Box>
                    )}

                    {/* Checkmarks and AI like indicator for user messages */}
                    {isUser && (message.status || (message.liked && message.likedBy === 'ai')) && (
                        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={0.5} mt={0.5}>
                            {/* AI liked indicator */}
                            {message.liked && message.likedBy === 'ai' && (
                                <FavoriteIcon sx={{ fontSize: 14, color: '#ffffff' }} />
                            )}
                            
                            {/* Status checkmarks */}
                            {message.status === 'pending' && (
                                <CheckIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                            )}
                            {message.status === 'processing' && (
                                <DoneAllIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                            )}
                            {message.status === 'completed' && (
                                <DoneAllIcon sx={{ fontSize: 16, color: '#ffffff' }} />
                            )}
                            {message.status === 'failed' && (
                                <ErrorOutlineIcon sx={{ fontSize: 16, color: '#ffcccb' }} />
                            )}
                        </Box>
                    )}
                </Paper>
                
                {/* Floating hearts animation */}
                {isUser && <FloatingHearts trigger={showHearts} />}
                {!isUser && <FloatingHearts trigger={showUserLikeHearts} />}

                {/* Timestamp */}
                <Typography 
                    variant="caption" 
                    sx={{ 
                        color: 'rgba(0,0,0,0.5)',
                        fontSize: '0.7rem',
                        mt: 0.5,
                        alignSelf: isUser ? 'flex-end' : 'flex-start'
                    }}
                >
                    {message.timestamp ? 
                        (() => {
                            let date;
                            if (message.timestamp._seconds) {
                                // Firestore timestamp format
                                date = new Date(message.timestamp._seconds * 1000);
                            } else if (message.timestamp.toDate) {
                                // Firestore timestamp object
                                date = message.timestamp.toDate();
                            } else {
                                // Regular date
                                date = new Date(message.timestamp);
                            }
                            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        })()
                        : ''
                    }
                </Typography>
            </Box>
            
            {/* Image Enlargement Modal */}
            <Modal
                open={!!enlargedImage}
                onClose={() => setEnlargedImage(null)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Box
                    onClick={() => setEnlargedImage(null)}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 1
                    }}
                >
                    <img
                        src={enlargedImage}
                        alt="Enlarged message"
                        style={{
                            maxWidth: '90vw',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default MessageItemV2;