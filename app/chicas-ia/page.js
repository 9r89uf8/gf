'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/store/store';
import { getGirls } from "@/app/services/girlsService";
import { useRouter } from 'next/navigation';
import { styled, keyframes } from '@mui/system';
import {
    Grid,
    Avatar,
    Button,
    Box,
    Typography,
    Container,
    Card,
    Skeleton,
    Stack,
    Modal
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';

const pulseAndGlow = keyframes`
    0% {
        transform: scale(1);
        background: linear-gradient(45deg, #f8f9fa, #dee2e6);
    }
    50% {
        transform: scale(1.02);
        background: linear-gradient(45deg, #f8f9fa, #dee2e6);
    }
    100% {
        transform: scale(1);
        background: linear-gradient(45deg, #f8f9fa, #dee2e6);
    }
`;

const ElegantCard = styled(Card)(({ theme }) => ({
    position: 'relative',
    textAlign: 'center',
    background: '#1a1a1a',
    borderRadius: theme.shape.borderRadius * 2,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
    padding: theme.spacing(4),
    height: '100%',
    overflow: 'hidden',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
}));

const ProfileImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
    cursor: 'pointer',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        background: 'linear-gradient(45deg, #0096c7, #023e8a)',
        borderRadius: '50%',
        zIndex: 0,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '100%',
    height: '100%',
    border: '4px solid #1a1a1a',
    position: 'relative',
    zIndex: 1,
}));

const ExpandedImageModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ExpandedImage = styled('img')({
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    borderRadius: '8px',
});

const CloseButton = styled(Button)({
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
});

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #0096c7 30%, #023e8a 90%)',
    border: 0,
    borderRadius: 25,
    color: '#ffffff',
    fontSize: '1.1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(45deg, #023e8a 30%, #0096c7 90%)',
        boxShadow: '0 3px 10px rgba(0, 150, 199, 0.3)',
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

const GradientButtonTwo = styled(Button)(({ theme }) => ({
    background: 'white',
    border: 0,
    borderRadius: 25,
    color: 'black',
    fontSize: '1.1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        background: 'linear-gradient(45deg, #023e8a 30%, #0096c7 90%)',
        boxShadow: '0 3px 10px rgba(0, 150, 199, 0.3)',
    },
}));

const PremiumBanner = styled(Box)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(4),
    marginBottom: theme.spacing(6),
    textAlign: 'center',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 147, 233, 0.3)',
}));

const PremiumLabel = styled(Typography)(({ theme }) => ({
    animation: `${pulseAndGlow} 2s infinite ease-in-out`,
    padding: '8px 16px',
    borderRadius: '25px',
    fontWeight: 'bold',
    display: 'inline-block',
    color: 'black',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.9rem',
}));

const FollowerCount = styled(Box)({
    color: '#ffffff',
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '4px',
    '& .number': {
        fontSize: '24px',
        fontWeight: 700,
    },
    '& .label': {
        fontSize: '14px',
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

const BackgroundImage = styled(Box)(({ backgroundurl }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundImage: `url(${backgroundurl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.3,
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(26,26,26,0) 0%, rgba(26,26,26,1) 100%)',
    },
}));

const PremiumGirlIndicator = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'linear-gradient(45deg, #FFD700 30%, #FFA500 90%)',
    borderRadius: '25px',
    padding: '4px 12px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 2,
}));

const Creators = () => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const girls = useStore((state) => state.girls);
    const [loading, setLoading] = useState(true);
    const [expandedImage, setExpandedImage] = useState(null);
    const isPremium = user && user.premium;

    const handleImageClick = (imageUrl) => {
        setExpandedImage(imageUrl);
    };

    const handleCloseExpandedImage = () => {
        setExpandedImage(null);
    };

    useEffect(() => {
        // Fire a GA event if the gtag function is available.
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag('event', 'page_view', {
                event_category: 'Navigation',
                event_label: 'Creadoras Page',
            });
        }
        async function fetchGirls() {
            await getGirls();
            setLoading(false);
        }
        fetchGirls();
    }, []);

    const handleMessageClick = (girlId) => {
        if (isPremium) {
            router.push(`/chat/${girlId}`);
        } else {
            router.push(`/chat/${girlId}`);
        }
    };

    const handleBuyPremiumClick = () => {
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

    const handlePhotosClick = (girlId) => {
        if (isPremium) {
            router.push(`/${girlId}`);
        } else {
            router.push(`/${girlId}`);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', padding: '20px 0' }}>
            <Container maxWidth="lg">
                <Grid>
                    <Box sx={{
                        textAlign: 'center',
                        color: 'white',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '16px',
                        marginBottom: '32px',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        msUserSelect: 'none',
                    }}>
                        <Typography variant="h4" sx={{
                            color: '#ffffff',
                            fontWeight: 600,
                            marginBottom: '0.5rem'
                        }}>
                            Selecciona a tu chica IA para hablar
                        </Typography>
                        <Typography variant="body1" sx={{
                            color: '#9e9e9e',
                            fontWeight: 500
                        }}>
                            Elige a tu compañera perfecta: ¡la primera chica es completamente gratis para chatear!
                        </Typography>
                    </Box>
                </Grid>
                <Grid container spacing={4}>
                    {loading ? (
                        [...Array(6)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Skeleton
                                    variant="rectangular"
                                    height={400}
                                    sx={{
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: 4
                                    }}
                                />
                            </Grid>
                        ))
                    ) : (
                        girls && girls.length > 0 && girls.map((girl) => (
                            <Grid item xs={12} sm={6} md={4} key={girl.id}>
                                <ElegantCard>
                                    {girl.premium && (
                                        <PremiumGirlIndicator>
                                            <LockIcon sx={{ fontSize: 16, mr: 0.5, color: '#000' }} />
                                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#000' }}>
                                                Premium
                                            </Typography>
                                        </PremiumGirlIndicator>
                                    )}
                                    <BackgroundImage
                                        backgroundurl={`https://d3sog3sqr61u3b.cloudfront.net/${girl.background}`}
                                    />
                                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                                        <ProfileImageContainer
                                            onClick={() => handleImageClick(`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`)}
                                        >
                                            <StyledAvatar
                                                src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                                alt={girl.name}
                                            />
                                        </ProfileImageContainer>

                                        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                                            {girl.name}
                                        </Typography>

                                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 600, mb: 1 }}>
                                            {girl.age} años
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: '#9e9e9e',
                                                mb: 2,
                                                height: 30,
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {girl.bio}
                                        </Typography>

                                        <FollowerCount sx={{ mb: 3 }}>
                                            <span className="number">{girl ? formatNumber(girl.followersCount) : 0}</span>
                                            <span className="label">seguidores</span>
                                        </FollowerCount>

                                        <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                                            {/* Conditional logic for buttons */}
                                            {girl.premium && !isPremium ? (
                                                <PremiumButton
                                                    onClick={handleBuyPremiumClick}
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
                                            <GradientButtonTwo
                                                onClick={() => handlePhotosClick(girl.id)}
                                            >
                                                Perfil
                                            </GradientButtonTwo>
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
                                </ElegantCard>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Container>

            <ExpandedImageModal
                open={!!expandedImage}
                onClose={handleCloseExpandedImage}
                aria-labelledby="expanded-image"
            >
                <Box sx={{ position: 'relative' }}>
                    <ExpandedImage
                        src={expandedImage}
                        alt="Expanded view"
                        onClick={handleCloseExpandedImage}
                    />
                    <CloseButton
                        onClick={handleCloseExpandedImage}
                        startIcon={<CloseIcon />}
                    >
                        Cerrar
                    </CloseButton>
                </Box>
            </ExpandedImageModal>
        </Box>
    );
};

export default Creators;