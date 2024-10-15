'use client'
import React, { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    Grid,
    IconButton,
    Avatar,
    Modal,
} from '@mui/material';
import VideoPlayer from "@/app/components/videoPlayer/VideoPlayer";
import {likeGirlPost} from "@/app/services/postsService";
import { styled } from "@mui/material/styles";
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import { useRouter } from "next/navigation";

// Styled Components

const PostCard = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    margin: theme.spacing(2, 0),
    userSelect: 'none',
    overflow: 'hidden',
}));

const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
}));

const MediaWrapper = styled(Box)({
    position: 'relative',
    width: '100%',
    maxHeight: '500px',
    overflow: 'hidden',
});

const PostImage = styled('img')({
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.3s',
    '&:hover': {
        transform: 'scale(1.05)',
    },
});

const BlurredOverlay = styled(Box)({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
});

const Actions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
}));

const Description = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0, 2, 2),
}));

const Footer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0, 2, 2),
    color: theme.palette.text.secondary,
}));

const PremiumButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(45deg, #343a40 30%, #000814 90%)',
    color: '#f8f9fa',
    fontWeight: 'bold',
    fontSize: 20,
    '&:hover': {
        backgroundImage: 'linear-gradient(45deg, #f39c12, #f1c40f)',
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


// Main Component

function GirlPostComp({ girl, user, post, index, onLike }) {
    const router = useRouter();
    const isUserLoggedIn = !!user;
    const isUserPremium = user?.premium;
    const canViewPremiumContent = isUserPremium || !post.isPremium;

    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleLike = async () => {
        if (isUserLoggedIn) {
            await likeGirlPost({ postId: post.id });
            if (onLike) onLike(post.id);
        } else {
            // Redirect to login or show a login prompt
            console.log("User must be logged in to like posts");
        }
    };

    const handleBuyPremium = () => {
        router.push('/premium');
    };

    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleCloseFullscreen = () => {
        setIsFullscreen(false);
    };

    return (
        <>
            <PostCard elevation={3}>
                {/* Header */}
                <Header>
                    <Link href={`/${post.girlId}`} passHref>
                        <Avatar
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${post.girlPicUrl}`}
                            alt={post.girlName}
                            sx={{ width: 60, height: 60, cursor: 'pointer', marginTop: -1.5, marginBottom: -1.5 }}
                        />
                    </Link>
                    <Box sx={{ marginLeft: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                            {post.girlName}
                        </Typography>
                    </Box>
                </Header>

                {/* Media */}
                <MediaWrapper>
                    {post.image ? (
                        <>
                            <PostImage
                                src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                                alt={`Post ${index}`}
                                onClick={handleImageClick}
                                style={{ cursor: 'pointer' }}
                            />
                            {!canViewPremiumContent && (
                                <BlurredOverlay>
                                    <LockIcon sx={{ fontSize: 60, mb: 2, color: 'white' }} />
                                    <Typography variant="h5" align="center" gutterBottom style={{ color: 'white' }}>
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
                </MediaWrapper>

                {/* Actions */}
                <Actions>
                    <IconButton onClick={handleLike} color="inherit">
                        {user && post.likes.includes(user.uid) ? (
                            <FavoriteIcon color="error" />
                        ) : (
                            <FavoriteBorderIcon style={{ fontSize: 36, marginBottom: -12, marginTop: -10 }} />
                        )}
                    </IconButton>
                    <Typography variant="h6" sx={{ marginLeft: 1 }}>
                        {post.likesAmount} Likes
                    </Typography>
                    {/* Additional action buttons can be added here (e.g., Comment, Share) */}
                </Actions>

                {/* Description */}
                <Description>
                    <Typography variant="h6">
                        <strong>{post.girlName}</strong> {post.description}
                    </Typography>
                </Description>
            </PostCard>

            {/* Fullscreen Modal */}
            {post.image && (
                <Modal
                    open={isFullscreen}
                    onClose={handleCloseFullscreen}
                    aria-labelledby="fullscreen-image-modal"
                    aria-describedby="modal-to-display-fullscreen-image"
                    disableScrollLock
                >
                    <Box sx={modalStyle}>
                        <img
                            src={`https://d3sog3sqr61u3b.cloudfront.net/${post.image}`}
                            alt={`Post ${index} Fullscreen`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain', // Maintain aspect ratio
                                borderRadius: '0', // Remove border radius for a cleaner look
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseFullscreen}
                        />
                    </Box>
                </Modal>
            )}
        </>
    );
}

export default GirlPostComp;

