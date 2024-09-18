import React from 'react';
import { Box, Button, Paper, Typography, Grid, Avatar } from '@mui/material';
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";
import { styled } from "@mui/material/styles";
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const PostCard = styled(Paper)(({ theme }) => ({
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius * 2,
    background: 'linear-gradient(135deg, #2c3e50, #34495e)',
    color: theme.palette.common.white,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'translateY(-5px)',
    },
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
}));

const PostMeta = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    backgroundImage: 'linear-gradient(45deg, #f1c40f, #f39c12)',
    color: theme.palette.common.white,
    fontWeight: 'bold',
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #f39c12, #f1c40f)',
    },
}));

function GirlPostComp({ girl, user, post, index }) {
    const isUserPremium = user && user.isPremium;
    const canViewPremiumContent = isUserPremium || !post.isPremium;

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            return timestamp.toDate().toLocaleDateString();
        }
        return 'Unknown date';
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
                                    <LockIcon sx={{ fontSize: 40, mb: 2 }} />
                                    <Typography variant="h6" align="center" gutterBottom>
                                        Premium Content
                                    </Typography>
                                    <PremiumButton variant="contained">
                                        Upgrade to Premium
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
                    <Typography variant="body1" gutterBottom>
                        {post.description}
                    </Typography>
                    <PostMeta>
                        <Box display="flex" alignItems="center">
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption">
                                {formatTimestamp(post.timestamp)}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <FavoriteIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="caption">
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