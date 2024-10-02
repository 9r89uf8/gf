'use client';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/app/store/store';
import { getGirl } from "@/app/services/girlService";
import PostsFilter from "@/app/components/posts/PostsFilter";
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

const GirlProfile = () => {
    const params = useParams();
    const user = useStore((state) => state.user);
    const girl = useStore((state) => state.girl);
    const router = useRouter();

    useEffect(() => {
        getGirl();
    }, []);

    const handleChat = () => {
        router.push('/chat');
    };

    const handlePremium = () => {
        router.push('/premium');
    };

    if (!girl) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                padding: 2
            }}
        >
            <Container maxWidth="md">
                <GlassCard elevation={4}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Box display="flex" justifyContent="center">
                                <StyledAvatar
                                    src={`https://d3sog3sqr61u3b.cloudfront.net/${girl.picture}`}
                                    alt={girl.username}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Box>
                                <Typography variant="h4" gutterBottom>
                                    {girl.username}
                                    <VerifiedIcon sx={{ color: '#3498db', verticalAlign: 'middle', ml: 1, fontSize: 36 }} />
                                </Typography>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <SentimentVerySatisfiedRoundedIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h6">
                                        <strong>{girl.followers.toLocaleString()}</strong> Seguidores
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <CakeIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h6">{girl.age} años</Typography>
                                </Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <LocationOnIcon sx={{ mr: 1, fontSize: 36 }} />
                                    <Typography variant="h6">{girl.country}</Typography>
                                </Box>
                                <Divider sx={{ my: 2, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
                                <Typography variant="h6" paragraph>
                                    {girl.bio}
                                </Typography>
                                <GradientButton
                                    onClick={handleChat}
                                >
                                    Enviar Mensaje
                                </GradientButton>

                                <GradientButtonBuy
                                    onClick={handlePremium}
                                >
                                    Comprar Premium
                                </GradientButtonBuy>
                            </Box>
                        </Grid>
                    </Grid>
                </GlassCard>

                <GlassCard>
                    <PostsFilter postsCount={girl.posts.length} />
                </GlassCard>

                <Grid container spacing={3}>
                    {girl.posts.map((post, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                                <GirlPostsComp
                                    girl={post.girlId}
                                    user={user}
                                    post={post}
                                    index={index}
                                />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default GirlProfile;
