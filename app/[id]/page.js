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
    Paper,
    Avatar,
    Grid,
    Divider,
    Chip
} from '@mui/material';
import { styled } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
    marginTop:10,
    color: theme.palette.common.white,
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    border: `4px solid ${theme.palette.common.white}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    backgroundImage: 'linear-gradient(45deg, #2ecc71, #27ae60)',
    color: 'white',
    padding: '10px 24px',
    borderRadius: '25px',
    fontWeight: 'bold',
    textTransform: 'none',
    boxShadow: '0 4px 6px rgba(46, 204, 113, 0.3)',
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #27ae60, #2ecc71)',
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

    if (!girl) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <ProfileCard elevation={4}>
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
                                <CheckCircleIcon sx={{ color: '#3498db', verticalAlign: 'middle', ml: 1 }} />
                            </Typography>
                            <Box display="flex" alignItems="center" mb={2}>
                                <CakeIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{girl.age} years old</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocationOnIcon sx={{ mr: 1 }} />
                                <Typography variant="body1">{girl.country}</Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body1" paragraph>
                                {girl.bio}
                            </Typography>
                            <ActionButton
                                onClick={handleChat}
                                startIcon={<ChatBubbleOutlineIcon />}
                            >
                                Send Message
                            </ActionButton>
                        </Box>
                    </Grid>
                </Grid>
            </ProfileCard>

            <Box mb={4}>
                <PostsFilter postsCount={girl.posts.length} />
            </Box>

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
    );
};

export default GirlProfile;
