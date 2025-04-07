'use client';
import React, { useState, lazy, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl } from "@/app/services/girlService";
// Optimize imports - only import what you need
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import { alpha, styled } from "@mui/material/styles";

// Import icons individually to reduce bundle size
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import LockIcon from "@mui/icons-material/Lock";
// Lazy load components that aren't needed immediately
const PostsFilter = lazy(() => import("@/app/components/posts/PostsFilter"));
const GirlPostsComp = lazy(() => import("@/app/components/posts/GirlPostsComp"));
const VerifiedIcon = lazy(() => import("@/app/components/landing/VerifiedIcon"));

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

const GirlProfile = ({ params }) => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const router = useRouter();
    const isPremium = user && user.premium;

    // Modified: Use non-blocking data fetching
    useEffect(() => {
        const fetchGirl = async () => {
            try {
                getGirl({ id: params.id }).catch(err => {
                    console.error("Error fetching girl data:", err);
                })
            } catch (error) {
                console.error("Error in fetchGirl:", error);
            }
        };

        // Start fetching but don't block rendering
        fetchGirl();
    }, [params.id]);


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

    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fullscreenImageSrc, setFullscreenImageSrc] = useState(null);

    const handleImageClick = (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up
        setFullscreenImageSrc(
            `https://d3sog3sqr61u3b.cloudfront.net/${girl ? girl.picture : null}`
        );
        setIsFullscreen(true);
    };

    const handleBackgroundImageClick = () => {
        setFullscreenImageSrc(
            `https://d3sog3sqr61u3b.cloudfront.net/${girl ? girl.background : null}`
        );
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                padding: 2,
            }}
        >
            <Container maxWidth="md">

                <GlassCard elevation={4}>
                    <Grid container spacing={4} alignItems="flex-start">
                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    height: { xs: 170, sm: 200, md: 250 },
                                    backgroundImage: girl
                                        ? `url(https://d3sog3sqr61u3b.cloudfront.net/${girl.background})`
                                        : `url(https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/3cc53e5e-99ae-434f-ff28-a23a589b2400/w=200,fit=scale-down)`,
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
                                        src={
                                            girl
                                                ? `https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`
                                                : 'https://imagedelivery.net/12JrhW5z6bQapxz4zK9hRQ/3cc53e5e-99ae-434f-ff28-a23a589b2400/w=200,fit=scale-down'
                                        }
                                        alt="novia virtual foto"
                                        onClick={handleImageClick}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ marginTop: { xs: 10, md: 5 } }}>
                                {!girl ? (
                                    <Skeleton variant="text" width={200} height={40} />
                                ) : (
                                    <Box display="flex" justifyContent="center">
                                        <Typography variant="h4" gutterBottom>
                                            {girl ? girl.username : 'arely4diaz'}
                                        </Typography>
                                        <VerifiedIcon/>
                                    </Box>
                                )}
                                {!girl ? (
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        mb={2}
                                    >
                                        <Skeleton variant="text" width={50} height={30} />
                                        <Skeleton
                                            variant="rectangular"
                                            width={100}
                                            height={48}
                                            sx={{ ml: 2 }}
                                        />
                                    </Box>
                                ) : (
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
                                                {girl ? formatNumber(girl.followersCount) : 0}
                                            </Typography>
                                            <Typography variant="subtitle1">
                                                Seguidores
                                            </Typography>
                                        </Box>

                                    </Box>
                                )}
                                {!girl ? (
                                    <Skeleton variant="text" width={150} height={30} />
                                ) : (
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                        <Typography variant="h6">
                                            {girl ? girl.age : '16'} años
                                        </Typography>
                                    </Box>
                                )}
                                {!girl ? (
                                    <Skeleton variant="text" width={200} height={30} />
                                ) : (
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <LocationOnIcon sx={{ mr: 1, fontSize: 36 }} />
                                        <Typography variant="h6">
                                            {girl ? girl.country : 'Monterrey, México'}
                                        </Typography>
                                    </Box>
                                )}
                                <Divider
                                    sx={{
                                        my: 2,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                    }}
                                />
                                {!girl ? (
                                    <Skeleton variant="text" width="100%" height={30} />
                                ) : (
                                    <Typography variant="h6" paragraph>
                                        {girl ? girl.bio : 'No sean chismosos 😂😏'}
                                    </Typography>
                                )}


                                <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
                                    {/* Conditional logic for buttons */}
                                    {girl&&girl.premium && !isPremium ? (
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
                                {girl&&girl.premium && !isPremium && (
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

                <GlassCard>
                    <PostsFilter postsCount={girl ? girl.posts.length : '9'} />
                </GlassCard>

                {!girl ? (
                    <Grid container spacing={3}>
                        {[...Array(9)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Skeleton variant="rectangular" width="100%" height={200} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Grid container spacing={3}>
                        {girl &&
                            girl.posts.map((post) => (
                                <Grid item xs={12} sm={6} md={4} key={post.id}>
                                    <GirlPostsComp girl={post.girlId} user={user} post={post} />
                                </Grid>
                            ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
};

export default GirlProfile;

