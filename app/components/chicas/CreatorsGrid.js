// components/CreatorsGrid.jsx
'use client';

import React, { useState } from 'react';
import { useStore } from '@/app/store/store';
import { useRouter } from 'next/navigation';
import { styled, keyframes } from '@mui/system';
import {
    Grid,
    Avatar,
    Button,
    Box,
    Typography,
    Card,
    Skeleton,
    Stack,
    Modal
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';

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

const CreatorsGrid = ({ initialGirls }) => {
    const router = useRouter();
    const user = useStore((state) => state.user);
    const storeGirls = useStore((state) => state.girls);
    const [loading, setLoading] = useState(false);
    const [expandedImage, setExpandedImage] = useState(null);
    const isPremium = user && user.premium;

    // Use girls from store if available, otherwise use the initial girls passed from server
    const girls = storeGirls && storeGirls.length > 0 ? storeGirls : initialGirls;

    const handleImageClick = (imageUrl) => {
        setExpandedImage(imageUrl);
    };

    const handleCloseExpandedImage = () => {
        setExpandedImage(null);
    };

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

    // Track page view once component mounts (moved from useEffect)
    React.useEffect(() => {
        if (typeof window !== "undefined" && window.gtag) {
            window.gtag('event', 'page_view', {
                event_category: 'Navigation',
                event_label: 'Creadoras Page',
            });
        }
    }, []);

    return (
        <>
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
                                    backgroundurl={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.background}/w=200,fit=scale-down`}
                                />
                                <Box sx={{ position: 'relative', zIndex: 1 }}>
                                    <ProfileImageContainer
                                        onClick={() => handleImageClick(`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`)}
                                    >
                                        <StyledAvatar
                                            src={`https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/${girl.picture}/w=200,fit=scale-down`}
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
        </>
    );
};

export default CreatorsGrid;