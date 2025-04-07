'use client';

import React, { useState } from 'react';
import { useStore } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Modal from '@mui/material/Modal';
import { alpha, styled } from "@mui/material/styles";
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from "@mui/icons-material/Lock";
import VerifiedIcon from "@/app/components/landing/VerifiedIcon";

const GlassCard = styled(Card)(({ theme }) => ({
    textAlign: 'center',
    color: 'white',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 15,
    border: `1px solid ${alpha('#ffffff', 0.2)}`,
    boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.20)',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop: 10,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${alpha('#ffffff', 0.5)}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s',
    cursor: 'pointer',
    '&:hover': {
        transform: 'scale(1.35)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'white',
    fontSize: 24,
    height: 48,
    padding: '0 30px',
    margin: '10px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    border: 0,
    borderRadius: 25,
    color: '#000000',
    fontSize: '1.1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(45deg, #FFA500 30%, #FFD700 90%)',
        boxShadow: '0 3px 10px rgba(255, 165, 0, 0.3)',
    },
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

export default function ProfileClient({ girl }) {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const isPremium = user && user.premium;
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImageSrc, setFullscreenImageSrc] = useState(null);

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };

    const handlePremium = () => {
        router.push('/premium');
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    };

    const handleImageClick = (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        setFullscreenImageSrc(
            `https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`
        );
        setIsFullscreen(true);
    };

    const handleBackgroundImageClick = () => {
        setFullscreenImageSrc(
            `https://d3sog3sqr61u3b.cloudfront.net/${girl.background}`
        );
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <>
            <GlassCard elevation={4}>
                <Grid container spacing={4} alignItems="flex-start">
                    <Grid item xs={12} md={4}>
                        {/* Background Image Box */}
                        <Box
                            sx={{
                                height: { xs: 170, sm: 200, md: 250 },
                                backgroundImage: `url(https://d3sog3sqr61u3b.cloudfront.net/${girl.background})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                position: 'relative',
                                cursor: 'pointer', // Make it look clickable
                            }}
                            onClick={handleBackgroundImageClick}
                        >
                            {/* Avatar Positioned Over the Background */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: -75,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                <StyledAvatar
                                    src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                    alt="novia virtual foto"
                                    onClick={handleImageClick}
                                />
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ marginTop: { xs: 10, md: 5 } }}>
                            <Box display="flex" justifyContent="center">
                                <Typography variant="h4" gutterBottom>
                                    {girl.username}
                                </Typography>
                                <VerifiedIcon/>
                            </Box>

                            <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mb={2}
                            >
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    mr={2}
                                >
                                    <Typography variant="h5">
                                        {formatNumber(girl.followersCount)}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        Seguidores
                                    </Typography>
                                </Box>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                <Typography variant="h6">
                                    {girl.age} años
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mb={2}>
                                <LocationOnIcon sx={{ mr: 1, fontSize: 36 }} />
                                <Typography variant="h6">
                                    {girl.country}
                                </Typography>
                            </Box>

                            <Divider
                                sx={{
                                    my: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                }}
                            />

                            <Typography variant="h6" paragraph>
                                {girl.bio}
                            </Typography>

                            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                                {/* Conditional logic for buttons */}
                                {girl.premium && !isPremium ? (
                                    <PremiumButton
                                        onClick={handlePremium}
                                        startIcon={<LockIcon />}
                                    >
                                        Premium
                                    </PremiumButton>
                                ) : (
                                    <GradientButton
                                        onClick={() => handleMessageClick(girl.id)}
                                    >
                                        Mensaje
                                    </GradientButton>
                                )}
                            </Stack>

                            {/* Premium notification for non-premium users */}
                            {girl.premium && !isPremium && (
                                <Typography variant="body2" sx={{
                                    color: '#FFA500',
                                    fontStyle: 'italic',
                                    mt: -2,
                                    mb: 2
                                }}>
                                    Necesitas una cuenta premium para hablar con esta chica
                                </Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </GlassCard>

            {/* Modal for Fullscreen Image */}
            <Modal
                open={isFullscreen}
                onClose={handleCloseFullscreen}
                aria-labelledby="fullscreen-image-modal"
                aria-describedby="modal-to-display-fullscreen-image"
                disableScrollLock
            >
                <Box sx={modalStyle}>
                    <img
                        src={fullscreenImageSrc}
                        alt="Fullscreen Image"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '0',
                            cursor: 'pointer',
                        }}
                        onClick={handleCloseFullscreen}
                    />
                </Box>
            </Modal>
        </>
    );
}