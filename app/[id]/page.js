'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl } from "@/app/services/girlService";
import PostsFilter from "@/app/components/posts/PostsFilter";
import {followGirl} from "@/app/services/girlService";

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
    Chip
} from '@mui/material';
import { alpha, styled } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import VerifiedIcon from "@mui/icons-material/Verified";
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


const GirlProfile = ({ params }) => {
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const router = useRouter();
    const showPremiumButton = !user || (user && !user.premium);
    const [loading, setLoading] = React.useState(true);
    // Add state for follow status
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
        // Check if the user is following the girl
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

    // Handle follow/unfollow click
    const handleFollowClick = async () => {
        if(user){
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

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4">Loading...</Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                padding: 2,
            }}
        >
            <Container maxWidth="md">
                <GlassCard elevation={4}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" justifyContent="center">
                                <StyledAvatar
                                    src={
                                        girl
                                            ? `https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`
                                            : "/profileTwo.jpg"
                                    }
                                    alt="novia virtual foto"
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    {girl ? girl.username : "arely4diaz"}
                                    <VerifiedIcon
                                        sx={{
                                            color: "#3498db",
                                            verticalAlign: "middle",
                                            ml: 1,
                                            fontSize: 36,
                                        }}
                                    />
                                </Typography>
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
                                        <Typography variant="subtitle1">Seguidores</Typography>
                                    </Box>
                                    {isFollowing ? (
                                        <UnfollowButton
                                            onClick={handleFollowClick}
                                            disabled={!user || isFollowLoading}
                                        >
                                            Dejar de seguir
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
                                <Box display="flex" alignItems="center" mb={2}>
                                    <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h6">
                                        {girl ? girl.age : "16"} años
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <LocationOnIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h6">
                                        {girl ? girl.country : "Monterrey, México"}
                                    </Typography>
                                </Box>
                                <Divider
                                    sx={{
                                        my: 2,
                                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    }}
                                />
                                <Typography variant="h6" paragraph>
                                    {girl ? girl.bio : "No sean chismosos 😂😏"}
                                </Typography>
                                {girl && !girl.private ? (
                                    <GradientButton
                                        disabled={girl ? girl.private : false}
                                        onClick={() => handleMessageClick(girl.id)}
                                    >
                                        Enviar Mensaje
                                    </GradientButton>
                                ) : (
                                    <GradientButtonTwo>Cuenta Privada</GradientButtonTwo>
                                )}

                                {showPremiumButton && girl && !girl.private && (
                                    <GradientButtonBuy onClick={handlePremium}>
                                        Comprar Premium
                                    </GradientButtonBuy>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </GlassCard>

                <GlassCard>
                    <PostsFilter postsCount={girl ? girl.posts.length : "9"} />
                </GlassCard>

                <Grid container spacing={3}>
                    {girl &&
                        girl.posts.map((post) => (
                            <Grid item xs={12} sm={6} md={4} key={post.id}>
                                <GirlPostsComp girl={post.girlId} user={user} post={post} />
                            </Grid>
                        ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default GirlProfile;


