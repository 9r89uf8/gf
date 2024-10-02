import React from 'react';
import { Box, Button, Paper, Typography, Grid, IconButton } from '@mui/material';
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";
import {likeGirlPost} from "@/app/services/girlService";
import { styled } from "@mui/material/styles";
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useRouter } from "next/navigation";

const PostCard = styled(Paper)(({ theme }) => ({
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    background: 'linear-gradient(135deg, #2c3e50, #34495e)',
    color: theme.palette.common.white,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
}));

const PostImage = styled('img')({
    width: '100%',
    height: 'auto',
    display: 'block',
});

const BlurredOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

const PostContent = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    userSelect: 'none', // Add this line
    WebkitUserSelect: 'none', // Add this line for webkit browsers
    msUserSelect: 'none', // Add this line for IE/Edge
}));

const PostMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #343a40 30%, #000814 90%)',
    fontSize: 21,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #f39c12, #f1c40f)',
    },
}));

function GirlPostComp({ girl, user, post, index, onLike }) {
    const router = useRouter();
    const isUserLoggedIn = !!user;
    const isUserPremium = user && user.premium;
    const canViewPremiumContent = isUserPremium || !post.isPremium;

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp._seconds) {
            const date = new Date(timestamp._seconds * 1000);
            return date.toLocaleDateString();
        }
        return 'Unknown date';
    };

    const handleLike = async () => {
        if (isUserLoggedIn) {
            await likeGirlPost({postId: post.id});
        } else {
            // Optionally, you can redirect to login page or show a login prompt
            console.log("User must be logged in to like posts");
        }
    };

    const handleBuyPremium = () => {
        router.push('/premium');
    };

    return (
        <Grid item xs={12} sm={6} md={4} key={index}>
            <PostCard elevation={3}>
                <Box sx={{ position: 'relative' }}>
                    {post.image ? (
                        <>
                            <PostImage
                                src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                                alt={`Post ${index}`}
                            />
                            {!canViewPremiumContent && (
                                <BlurredOverlay>
                                    <LockIcon sx={{ fontSize: 60, mb: 2 }} />
                                    <Typography variant="h4" align="center" gutterBottom>
                                        Contenido Premium
                                    </Typography>
                                    <PremiumButton variant="contained" onClick={handleBuyPremium}>
                                        Comprar Premium
                                    </PremiumButton>
                                </BlurredOverlay>
                            )}
                        </>
                    ) : post.video ? (
                        <VideoPlayer
                            options={{
                                controls: true,
                                sources: [{
                                    src: `https://d3sog3sqr61u3b.cloudfront.net/${post.video}`,
                                    type: 'video/mp4'
                                }],
                                controlBar: {
                                    volumePanel: true,
                                    fullscreenToggle: false,
                                },
                            }}
                        />
                    ) : null}
                </Box>
                <PostContent>
                    <Typography variant="h5" gutterBottom>
                        {post.description}
                    </Typography>
                    <PostMeta>
                        <Box display="flex" alignItems="center">
                            <AccessTimeIcon sx={{ mr: 0.5, fontSize: 36 }} />
                            <Typography variant="h5">
                                {formatTimestamp(post.timestamp)}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <IconButton onClick={handleLike} color="inherit" size="small">
                                {user&&post.likes.includes(user.uid) ? <FavoriteIcon sx={{ fontSize: 36 }}/> : <FavoriteBorderIcon sx={{ fontSize: 36 }}/>}
                            </IconButton>
                            <Typography variant="h5">
                                {post.likesAmount}
                            </Typography>
                        </Box>
                    </PostMeta>
                </PostContent>
            </PostCard>
        </Grid>
    );
}

export default GirlPostComp;