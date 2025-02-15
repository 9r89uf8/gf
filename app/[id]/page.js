'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl } from "@/app/services/girlService";
import PostsFilter from "@/app/components/posts/PostsFilter";
import { followGirl } from "@/app/services/girlService";

import GirlPostsComp from "@/app/components/posts/GirlPostsComp";
import {
    Container,
    Box,
    Typography,
    Button,
    Card,
    Avatar,
    Grid,
    Divider,
    Skeleton,
    Modal,
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import VerifiedIcon from "@/app/components/landing/VerifiedIcon";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SentimentVerySatisfiedRoundedIcon from '@mui/icons-material/SentimentVerySatisfiedRounded';

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

const UnfollowButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B9B 30%, #FFA873 90%)',
    },
}));

const FollowButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    '&:hover': {
        background: 'linear-gradient(45deg, #41A6F3 30%, #41DBF3 90%)',
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

const GradientButtonTwo = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #ffb703 30%, #fb8500 90%)',
    border: 0,
    borderRadius: 25,
    boxShadow: '0 3px 5px 2px rgba(255, 255, 255, .2)',
    color: 'white',
    fontSize: 22,
    height: 48,
    padding: '0 10px',
    margin: '10px 0',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(45deg, #FE8B8B 30%, #FFAE53 90%)',
    },
}));

const GradientButtonBuy = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #343a40 30%, #000814 90%)',
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
    const [loading, setLoading] = React.useState(true);
    const [isFollowing, setIsFollowing] = React.useState(false);
    const [isFollowLoading, setIsFollowLoading] = React.useState(false);

    useEffect(() => {
        const fetchGirl = async () => {
            await getGirl({ id: params.id });
            setLoading(false);
        };
        fetchGirl();
    }, [params.id]);

    useEffect(() => {
        if (user && girl && girl.followers) {
            setIsFollowing(girl.followers.includes(user.uid));
        }
    }, [user, girl]);

    const handleMessageClick = (girlId) => {
        router.push(`/chat/${girlId}`);
    };

    const handlePremium = () => {
        router.push('/premium');
    };

    const handleFollowClick = async () => {
        if (user) {
            setIsFollowLoading(true);
            await followGirl({ girlId: girl.id });
            setIsFollowLoading(false);
        }
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
                            {/* Background Image Box */}
                            {loading ? (
                                <Skeleton variant="rectangular" width="100%" height={200} />
                            ) : (
                                <Box
                                    sx={{
                                        height: { xs: 170, sm: 200, md: 250 },
                                        backgroundImage: girl
                                            ? `url(https://d3sog3sqr61u3b.cloudfront.net/${girl.background})`
                                            : `url(/defaultBackground.jpg)`,
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
                                                    : '/profileTwo.jpg'
                                            }
                                            alt="novia virtual foto"
                                            onClick={handleImageClick}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ marginTop: { xs: 10, md: 5 } }}>
                                {loading ? (
                                    <Skeleton variant="text" width={200} height={40} />
                                ) : (
                                    <Box display="flex" justifyContent="center">
                                        <Typography variant="h4" gutterBottom>
                                            {girl ? girl.username : 'arely4diaz'}
                                        </Typography>
                                        <VerifiedIcon/>
                                    </Box>
                                )}
                                {loading ? (
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
                                        {isFollowing ? (
                                            <UnfollowButton
                                                onClick={handleFollowClick}
                                                disabled={!user || isFollowLoading}
                                            >
                                                No Seguir
                                            </UnfollowButton>
                                        ) : (
                                            <FollowButton
                                                onClick={handleFollowClick}
                                                disabled={!user || isFollowLoading}
                                            >
                                                Seguir
                                            </FollowButton>
                                        )}
                                    </Box>
                                )}
                                {loading ? (
                                    <Skeleton variant="text" width={150} height={30} />
                                ) : (
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                        <Typography variant="h6">
                                            {girl ? girl.age : '16'} años
                                        </Typography>
                                    </Box>
                                )}
                                {loading ? (
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
                                {loading ? (
                                    <Skeleton variant="text" width="100%" height={30} />
                                ) : (
                                    <Typography variant="h6" paragraph>
                                        {girl ? girl.bio : 'No sean chismosos 😂😏'}
                                    </Typography>
                                )}
                                {loading ? (
                                    <Skeleton variant="rectangular" width={200} height={48} />
                                ) : girl && !girl.private ? (
                                    <GradientButton
                                        disabled={girl ? girl.private : false}
                                        onClick={() => handleMessageClick(girl.id)}
                                    >
                                        Mensaje
                                    </GradientButton>
                                ) : (
                                    <GradientButtonTwo>Cuenta Privada</GradientButtonTwo>
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
                    {loading ? (
                        <Skeleton variant="text" width={150} height={30} />
                    ) : (
                        <PostsFilter postsCount={girl ? girl.posts.length : '9'} />
                    )}
                </GlassCard>

                {loading ? (
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

