'use client'
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Modal,
} from '@mui/material';
import { ModernCard } from '@/app/components/ui/ModernCard';
import { Stream } from "@cloudflare/stream-react";
import { styled } from "@mui/material/styles";
import Link from 'next/link';
import { useRouter } from "next/navigation";

// Styled Components

// Using ModernCard instead of custom PostCard for consistency

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
}));

const MediaWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    maxHeight: '600px', // Max height to prevent overly tall posts
    overflow: 'hidden',
    backgroundColor: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const PostImage = styled('img')({
    width: '100%',
    height: 'auto',
    maxHeight: '600px',
    objectFit: 'contain',
    display: 'block',
    transition: 'transform 0.3s',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.02)',
    },
});


const Description = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0, 2, 2),
}));

const TextPostContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: theme.shape.borderRadius,
}));

// Modal Style
const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    p: 0, // Remove padding
};

// Main Component
function GirlPostComp({ girl, user, post, index }) {
    const router = useRouter();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    // No longer need video metadata handler since we're using a fixed duration

    return (
        <>
            <ModernCard variant="elevated" animate={false} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Header>
                    <Link href={`/${post.girlId}`} passHref style={{ textDecoration: 'none' }}>
                        <Avatar
                            src={post.girlPictureUrl}
                            alt={post.girlUsername}
                            sx={{ 
                                width: 50, 
                                height: 50, 
                                cursor: 'pointer',
                                border: '2px solid rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'scale(1.1)',
                                }
                            }}
                        />
                    </Link>
                    <Box sx={{ marginLeft: 2, flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                            {post.girlUsername}
                        </Typography>
                        {post.mediaType === 'text' && post.createdAt && (
                            <Typography variant="caption" sx={{ color: 'rgba(100, 116, 139, 0.8)' }}>
                                {new Date(post.createdAt).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        )}
                    </Box>
                </Header>

                {/* Media */}
                {post.mediaType === 'text' ? (
                    <TextPostContent>
                        <Typography 
                            variant="h5" 
                            align="center" 
                            sx={{ 
                                color: 'rgba(15, 23, 42, 0.95)',
                                fontWeight: 500,
                                lineHeight: 1.6,
                                px: 2
                            }}
                        >
                            {post.text}
                        </Typography>
                    </TextPostContent>
                ) : (
                    <MediaWrapper>
                        {post.mediaType === 'image' ? (
                            <>
                                <PostImage
                                    src={post.mediaUrl}
                                    alt={`Post ${index}`}
                                    onClick={handleImageClick}
                                    style={{ cursor: 'pointer' }}
                                />
                            </>
                        ) : post.mediaType === 'video' ? (
                            <Box sx={{ 
                                width: '100%',
                                maxHeight: '600px',
                                aspectRatio: '9/16',
                                '& iframe': {
                                    width: '100%',
                                    height: '100%',
                                    border: 'none',
                                }
                            }}>
                                <Stream 
                                    controls
                                    src={post.uploadId}
                                    autoplay={false}
                                    muted={false}
                                    preload="metadata"
                                />
                            </Box>
                        ) : null}
                    </MediaWrapper>
                )}


                {/* Description */}
                {post.mediaType !== 'text' && (
                    <Description>
                        <Typography variant="body1" sx={{ color: 'rgba(71, 85, 105, 0.9)', lineHeight: 1.6 }}>
                            <Box component="span" sx={{ fontWeight: 600, color: 'rgba(15, 23, 42, 0.95)' }}>
                                {post.girlUsername}
                            </Box>{' '}
                            {post.text}
                        </Typography>
                        {post.createdAt && (
                            <Typography variant="caption" sx={{ color: 'rgba(100, 116, 139, 0.8)', mt: 1, display: 'block' }}>
                                {new Date(post.createdAt).toLocaleDateString('es-ES', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Typography>
                        )}
                    </Description>
                )}
            </ModernCard>

            {/* Fullscreen Modal */}
            {post.mediaType === 'image' && post.uploadId && (
                <Modal
                    open={isFullscreen}
                    onClose={handleCloseFullscreen}
                    aria-labelledby="fullscreen-image-modal"
                    aria-describedby="modal-to-display-fullscreen-image"
                    disableScrollLock
                >
                    <Box sx={modalStyle}>
                        <img
                            src={post.mediaUrl}
                            alt={`Post ${index} Fullscreen`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain', // Maintain aspect ratio
                                borderRadius: '0', // Remove border radius for a cleaner look
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseFullscreen}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default GirlPostComp;