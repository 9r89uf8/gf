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
    Skeleton,
    Stack,
    Modal
} from '@mui/material';
import { ModernCard, CardContentWrapper } from '@/app/components/ui/ModernCard';

import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';

// Using ModernCard instead of custom ElegantCard for consistency

const ProfileImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    width: '120px',
    height: '120px',
    margin: '0 auto',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-8),
    cursor: 'pointer',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: -3,
        left: -3,
        right: -3,
        bottom: -3,
        background: 'linear-gradient(135deg, #1a1a1a, #000000)',
        borderRadius: '50%',
        zIndex: 0,
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: '100%',
    height: '100%',
    border: '4px solid rgba(255, 255, 255, 0.9)',
    position: 'relative',
    zIndex: 1,
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
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
    background: 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)',
    border: 0,
    borderRadius: 25,
    color: '#ffffff',
    fontSize: '1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    boxShadow: '0 4px 15px 0 rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.3)',
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
    background: 'transparent',
    border: '2px solid rgba(0, 0, 0, 0.2)',
    borderRadius: 25,
    color: 'rgba(15, 23, 42, 0.95)',
    fontSize: '1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
        border: '2px solid rgba(0, 0, 0, 0.4)',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
}));

const FollowerCount = styled(Box)(({ theme }) => ({
    color: 'rgba(15, 23, 42, 0.95)',
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
        color: 'rgba(71, 85, 105, 0.8)',
    },
}));

const BackgroundImage = styled(Box)(({ backgroundurl }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundImage: `url(${backgroundurl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
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

const ComingSoonButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    border: 0,
    borderRadius: 25,
    color: '#ffffff',
    fontSize: '1rem',
    height: 48,
    padding: '0 32px',
    textTransform: 'none',
    fontWeight: 600,
    cursor: 'not-allowed',
    opacity: 0.8,
    '&:hover': {
        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    },
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
            <Grid container spacing={4} justifyContent="center">
                {loading ? (
                    [...Array(6)].map((_, index) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Skeleton
                                variant="rectangular"
                                height={400}
                                sx={{
                                    bgcolor: 'rgba(0, 0, 0, 0.11)',
                                    borderRadius: '20px'
                                }}
                            />
                        </Grid>
                    ))
                ) : (
                    girls && girls.length > 0 && girls.map((girl) => (
                        <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={girl.id}>
                            <ModernCard 
                                variant="elevated" 
                                animate={true}
                                sx={{ 
                                    height: '100%',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {girl.premium && !girl.private && (
                                    <PremiumGirlIndicator>
                                        <LockIcon sx={{ fontSize: 16, mr: 0.5, color: '#000' }} />
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#000' }}>
                                            Premium
                                        </Typography>
                                    </PremiumGirlIndicator>
                                )}
                                {girl.private && (
                                    <Box sx={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                        borderRadius: '25px',
                                        padding: '4px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        zIndex: 2,
                                    }}>
                                        <Typography variant="caption" sx={{ fontWeight: 600, color: '#fff' }}>
                                            Próximamente
                                        </Typography>
                                    </Box>
                                )}
                                <BackgroundImage
                                    backgroundurl={`${girl.backgroundUrl}`}
                                />
                                <CardContentWrapper>
                                    <Box sx={{ position: 'relative', zIndex: 1, mt: '25%' }}>
                                    <ProfileImageContainer
                                        onClick={() => handleImageClick(`${girl.pictureUrl}`)}
                                    >
                                        <StyledAvatar
                                            src={`${girl.pictureUrl}`}
                                            alt={girl.name}
                                        />
                                    </ProfileImageContainer>

                                    <Typography variant="h5" sx={{ color: 'rgba(15, 23, 42, 0.95)', fontWeight: 600, mb: 1 }}>
                                        {girl.name}
                                    </Typography>

                                    <Typography variant="h6" sx={{ color: 'rgba(51, 65, 85, 0.9)', fontWeight: 500, mb: 1 }}>
                                        {girl.age} años
                                    </Typography>

                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'rgba(71, 85, 105, 0.8)',
                                            mb: 2,
                                            height: 60,
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
                                        {girl.private ? (
                                            <ComingSoonButton disabled>
                                                Próximamente
                                            </ComingSoonButton>
                                        ) : girl.premium && !isPremium ? (
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

                                    {/* Notifications */}
                                    {girl.private ? (
                                        <Typography variant="body2" sx={{
                                            color: '#64748b',
                                            fontStyle: 'italic',
                                            mt: -2,
                                            mb: 2,
                                            fontWeight: 500
                                        }}>
                                            Esta chica estará disponible pronto
                                        </Typography>
                                    ) : (
                                        girl.premium && !isPremium && (
                                            <Typography variant="body2" sx={{
                                                color: '#f59e0b',
                                                fontStyle: 'italic',
                                                mt: -2,
                                                mb: 2,
                                                fontWeight: 500
                                            }}>
                                                Necesitas una cuenta premium para hablar con esta chica
                                            </Typography>
                                        )
                                    )}
                                    </Box>
                                </CardContentWrapper>
                            </ModernCard>
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